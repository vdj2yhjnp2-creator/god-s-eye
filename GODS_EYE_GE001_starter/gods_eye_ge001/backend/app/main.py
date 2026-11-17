from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal
from uuid import uuid4

app = FastAPI(
    title="GOD'S EYE GE-001 API",
    version="0.1.0",
    description="Private personal intelligence platform API scaffold."
)

# Development-only CORS. Restrict to the deployed frontend origin in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class EventIn(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    category: Literal["system", "location", "intelligence", "device", "camera"] = "system"
    details: str = Field(default="", max_length=2000)

_events = []

@app.get("/api/health")
def health():
    return {"status": "online", "service": "ge001-api", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.get("/api/events")
def list_events():
    return {"items": list(reversed(_events)), "count": len(_events)}

@app.post("/api/events")
def create_event(event: EventIn):
    item = {
        "id": str(uuid4()),
        **event.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "source": "manual"
    }
    _events.append(item)
    return item
