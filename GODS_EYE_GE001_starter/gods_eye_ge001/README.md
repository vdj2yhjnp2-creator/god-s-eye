# GOD'S EYE GE-001

Starter project for a private, cloud-hosted personal intelligence dashboard.
This is a development scaffold, not a deployed service.

## Stack
- Frontend: React + TypeScript + Vite (responsive PWA-ready foundation)
- Backend: FastAPI
- Database: PostgreSQL + PostGIS
- Cache/events: Redis
- Local orchestration: Docker Compose

## Start locally
Requirements: Docker Desktop and Node.js 20+.

1. Copy `.env.example` to `.env` and change every secret.
2. Start backend services:
   ```bash
   docker compose up --build
   ```
3. In another terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Open the Vite URL shown in the terminal. API health: http://localhost:8000/api/health

## Important
- No cloud deployment or external integrations are configured yet.
- Map view currently uses a clearly-labelled illustrative tactical canvas. Real maps require a tile provider and, for satellite imagery, a provider/API key with suitable licensing.
- Device location must be explicitly shared by the device owner. Browser geolocation requires HTTPS (localhost is exempt).
- Camera integrations must use cameras you own or are authorized to administer. Never expose camera RTSP ports directly to the public internet.
- Add production authentication, MFA, rate limiting, secrets management, backups, monitoring, and security review before exposing this service to the internet.
