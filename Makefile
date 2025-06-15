# Run Docker
docker-run:
	docker compose up --build -d

docker-restart:
	docker compose down
	docker compose up --build -d

# Run uvicorn
uvicorn-run:
	uvicorn app.main:app --reload

# Deploy app
deploy:
	flyctl deploy

# Set env

env-set-secret:
flyctl secrets set MASTER_PASSWORD=$(SECRET)

# flyctl secrets set MASTER_PASSWORD=your_prod_password
# flyctl secrets set REDIS_URL=<your-redis-url>
# flyctl secrets set FILE_TTL_SECONDS=3600