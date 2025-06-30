from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uvicorn

app = FastAPI(title="Happy Day AI Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Happy Day AI Service is running!"}

@app.get("/api/v1/health")
async def health():
    return {
        "status": "ok",
        "service": "ai-service",
        "timestamp": datetime.now().isoformat(),
    }

@app.get("/api/v1/models")
async def get_models():
    return {
        "models": [
            {
                "name": "emotion-classifier-v1",
                "version": "1.0.0",
                "type": "emotion_analysis",
                "status": "active"
            },
            {
                "name": "crisis-detector-v1",
                "version": "1.0.0",
                "type": "crisis_detection",
                "status": "active"
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8081)
