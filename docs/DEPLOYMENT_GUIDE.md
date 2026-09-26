# Creda API — Cloud Deployment Guide

This guide provides instructions for deploying the **Creda Backend API** to production environments (Render, Railway, or Docker).

---

## 🚀 Option 1: Deploy on Render (Recommended)

Render is pre-configured with the [`render.yaml`](file:///c:/Users/user/OneDrive/Desktop/Creda-repo/backend/render.yaml) blueprint.

### Steps:
1. Push your code to your GitHub repository on `main` or `backend/develop`.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Blueprint**.
4. Select your **Creda** GitHub repository.
5. Render will automatically detect `backend/render.yaml` and configure:
   - **Service Name**: `creda-backend-api`
   - **Runtime**: Python 3.11
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Fill in your environment variables in the Render dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `DATABASE_URL`: Your Supabase or Render PostgreSQL connection string
   - `GITHUB_TOKEN`: (Optional) GitHub personal access token for higher rate limits
   - `JWT_SECRET`: Random 32+ character string
7. Click **Apply**. Your API will deploy and provide a live URL:
   `https://creda-backend-api.onrender.com`

---

## 🚂 Option 2: Deploy on Railway

1. Log into [Railway](https://railway.app).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Set **Root Directory** to `backend`.
4. Railway will automatically detect the [`Procfile`](file:///c:/Users/user/OneDrive/Desktop/Creda-repo/backend/Procfile).
5. Add the variables from `.env.example` in Railway's **Variables** tab.
6. Generate a public domain under **Settings → Networking**.

---

## 🐳 Option 3: Run with Docker Locally or on VPS

### 1. Build the Docker Image
```bash
cd backend
docker build -t creda-backend:latest .
```

### 2. Run the Container
```bash
docker run -d \
  -p 8000:8000 \
  --name creda-api \
  --env-file .env \
  creda-backend:latest
```

### 3. Verify Health
```bash
curl http://localhost:8000/health
# Output: {"status":"healthy","environment":"production","version":"0.1.0"}
```

---

## ⚙️ Environment Variables Checklist

| Variable | Required? | Default | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Optional | `sqlite:///./creda_dev.db` | PostgreSQL connection string (Supabase or Render). Falls back to SQLite if not provided. |
| `OPENAI_API_KEY` | **Yes** (for AI) | `""` | OpenAI API key for skill extraction and job matching. |
| `JWT_SECRET` | **Yes** (prod) | Secure fallback | 32+ char key for JWT token signing. |
| `SUPABASE_URL` | Optional | `""` | Supabase project URL for cloud file storage. |
| `SUPABASE_KEY` | Optional | `""` | Supabase service/anon key. |
| `GITHUB_TOKEN` | Optional | `""` | GitHub personal access token. |
| `ENVIRONMENT` | Optional | `development` | Set to `production` in live deployments. |
