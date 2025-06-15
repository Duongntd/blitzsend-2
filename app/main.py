import os
import uuid
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Header, Body
from fastapi.responses import StreamingResponse
import redis.asyncio as aioredis
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles


from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles



load_dotenv()
MASTER_PASSWORD = os.getenv("MASTER_PASSWORD")
REDIS_URL = os.getenv("REDIS_URL")
FILE_TTL = int(os.getenv("FILE_TTL_SECONDS", "3600"))

app = FastAPI(title="Ephemeral File Share")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],  # lock this down in prod
  allow_methods=["*"],
  allow_headers=["*"],
)
redis = aioredis.from_url(REDIS_URL)

# Simple header-based auth
async def check_auth(x_password: str = Header(...)):
    if x_password != MASTER_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.post("/upload", dependencies=[Depends(check_auth)])
async def upload(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    content = await file.read()
    # Store raw bytes under key; set TTL
    await redis.set(f"file:{file_id}", content, ex=FILE_TTL)
    return {"download_url": f"/download/{file_id}"}

@app.get("/download/{file_id}", dependencies=[Depends(check_auth)])
async def download(file_id: str):
    key = f"file:{file_id}"
    data = await redis.get(key)
    if not data:
        raise HTTPException(status_code=404, detail="File not found or expired")
    # Delete immediately after first download
    await redis.delete(key)
    return StreamingResponse(iter([data]), media_type="application/octet-stream")

@app.get("/list", dependencies=[Depends(check_auth)])
async def list_files():
    keys = await redis.keys("file:*")
    # Extract file IDs from keys
    file_ids = [k.decode().split(":", 1)[1] if isinstance(k, bytes) else k.split(":", 1)[1] for k in keys]
    return {"files": file_ids}

@app.post("/login")
async def login(password: str = Body(..., embed=True)):
    if password == MASTER_PASSWORD:
        return {"success": True}
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.post("/text", dependencies=[Depends(check_auth)])
async def write_text(text: str = Body(..., embed=True)):
    text_id = str(uuid.uuid4())
    await redis.set(f"text:{text_id}", text, ex=FILE_TTL)
    return {"text_id": text_id}

@app.get("/text/{text_id}", dependencies=[Depends(check_auth)])
async def get_text(text_id: str):
    key = f"text:{text_id}"
    data = await redis.get(key)
    if not data:
        raise HTTPException(status_code=404, detail="Text not found or expired")
    return {"text": data.decode() if isinstance(data, bytes) else data}

@app.get("/texts", dependencies=[Depends(check_auth)])
async def list_texts():
    keys = await redis.keys("text:*")
    text_ids = [k.decode().split(":", 1)[1] if isinstance(k, bytes) else k.split(":", 1)[1] for k in keys]
    return {"texts": text_ids}

app.mount("/", StaticFiles(directory="frontend", html=True), name="static")
