from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models.schemas import (
    RecommendationRequest,
    RecommendationResponse,
    BookRecommendation
)
from app.services.openai_service import OpenAIService

openai_service = OpenAIService()

router = APIRouter()

@router.post("/", response_model=RecommendationResponse)
async def get_book_recommendations(request: RecommendationRequest):
    try:
        recommendations = await openai_service.get_recommendations(
            book_title=request.book_title,
            author=request.author,
            genre=request.genre
        )
        
        return RecommendationResponse(
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get recommendations: {str(e)}"
        )

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "recommendations"}