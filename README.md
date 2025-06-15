# Installation

# Run locally

uvicorn app.main:app --reload
docker compose down
docker compose up --build -d

## Check for errors

docker ps
docker compose logs web

# Deployment

## Initial setup the of the deployment (Skip to step 6 for redeployment)

1. Install fly.io
   brew install flyctl
   fly auth login
2. From your project root
fly launch \
 --name tempshare-web \
 --region iad \
 --dockerfile Dockerfile \
 --no-deploy
<!-- This creates a fly.toml with defaults (service port 8000, etc). -->
3. Configure env vars
flyctl secrets set \
 MASTER_PASSWORD=supersecret123 \
 FILE_TTL_SECONDS=3600
<!-- Do not set REDIS_URL yet. -->
4. Stand up Redis
fly redis create \
 --name tempshare-redis \
 --region iad
  <!-- When it’s ready, Fly will show you a connection string like REDIS_URL=redis://<host>:6379. -->

5. Wire them together
   flyctl secrets set REDIS_URL=redis://<host>:6379

6. Deploy
   flyctl deploy

# Set env variables

flyctl secrets set MASTER_PASSWORD=your_prod_password
flyctl secrets set REDIS_URL=<your-redis-url>
flyctl secrets set FILE_TTL_SECONDS=3600
