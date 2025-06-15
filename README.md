# Installation

# Run locally
uvicorn app.main:app --reload
docker compose down
docker compose up --build -d
## Check for errors
docker ps
docker compose logs web

# Deployment