# 1) Build the Vue app
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build    # outputs to frontend/dist

# 2) Build the Python app
FROM python:3.11-slim
WORKDIR /app

# Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy FastAPI code
COPY app/ ./app/

# Copy built frontend into 'frontend' for StaticFiles
COPY --from=build-frontend /app/frontend/dist ./frontend

# Expose and run
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
