from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import reviews, recommendations
from app.core.config import settings

app = FastAPI(
    title="BookLLM AI Service",
    description="AI service for book review analysis and recommendations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reviews.router, prefix="/api/v1/reviews", tags=["reviews"])
app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["recommendations"])

@app.get("/")
async def root():
    return {"message": "BookLLM AI Service", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}