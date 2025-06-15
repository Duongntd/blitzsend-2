import os
import uuid
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Header
from fastapi.responses import StreamingResponse
import redis.asyncio as aioredis
from dotenv import load_dotenv

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],  # lock this down in prod
  allow_methods=["*"],
  allow_headers=["*"],
)
app.mount("/", StaticFiles(directory="frontend", html=True), name="static")

load_dotenv()
MASTER_PASSWORD = os.getenv("MASTER_PASSWORD")
REDIS_URL = os.getenv("REDIS_URL")
FILE_TTL = int(os.getenv("FILE_TTL_SECONDS", "3600"))

app = FastAPI(title="Ephemeral File Share")
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
