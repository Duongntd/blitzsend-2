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

# Tempshare — Technical Specification

## 1. Overview

A single-page application for one-time file/text uploads and downloads.

- **Frontend:** Vue 3 + Vite
- **Backend:** FastAPI (Python 3.11)
- **Storage:** Redis (in-memory, TTL)
- **Auth:** Single master password via header
- **Deployment:** Docker & Docker Compose (local); Fly.io (production)

---

## 2. Frontend

### 2.1. Framework & Build

- **Vue 3** with `<script setup lang=ts>` syntax
- **Vite** for fast dev server and build
- **Directory:** `frontend/`
- **Entry:** `frontend/src/main.ts` → mounts `<App/>`

### 2.2. UI

- Uses Tailwind via CDN or optional PostCSS install

### 2.3. Routing (optional)

- **Vue Router** (manual) or **vite-plugin-pages** for file-based routes
- Root (`/`) renders `HomePage.vue` via `<router-view/>`

### 2.4. Linting & Types

- **ESLint** + `eslint-plugin-vue` + `vite-plugin-eslint`
- `.eslintrc.json` extends:
  - `eslint:recommended`
  - `plugin:vue/vue3-recommended`
- **TypeScript** support via `tsconfig.json`:
  - `include`: `src/**/*.ts, src/**/*.vue`
  - `baseUrl: "."` & `paths: {"@/*": ["src/*"]}`
  - Shim: `src/shims-vue.d.ts`

### 2.5. Env-vars

- `VITE_API_BASE`
  - Provided in `.env` (dev) or `.env.production` (build)
  - Example: `VITE_API_BASE=http://localhost:8000`

---

## 3. Backend

### 3.1. Framework

- **FastAPI** with Uvicorn (ASGI)
- **Endpoints**:
  - `POST /upload` → stores file bytes in Redis, returns `{ download_url }`
  - `GET  /download/{id}` → streams bytes, deletes key on first access

### 3.2. Auth

- Header `X-Password: <MASTER_PASSWORD>`
- Master password loaded from env-var `MASTER_PASSWORD`

### 3.3. Storage & Ephemerality

- **Redis** (async client `redis.asyncio`)
- Keys: `file:<uuid>` → binary value
- TTL (`EXPIRE`) set via `FILE_TTL_SECONDS` (default 3600s)
- On download: key deleted atomically

### 3.4. Static-Files

- FastAPI mounts built frontend at `/`:
  ```python
  app.mount("/", StaticFiles(directory="frontend", html=True), name="static")
  ```
