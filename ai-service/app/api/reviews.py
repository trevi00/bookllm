from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models.schemas import (
    ReviewAnalysisRequest,
    ReviewAnalysisResponse,
    BookReview,
    AIResponse
)
from app.services.openai_service import OpenAIService

router = APIRouter()
openai_service = OpenAIService()

@router.post("/analyze")
async def analyze_review(request: ReviewAnalysisRequest):
    try:
        # OpenAI 서비스에 전달할 데이터 준비
        review_data = {
            'book_title': request.book_title,
            'author': request.author,
            'content': request.content,
            'rating': request.rating,
            'user_emotion': request.user_emotion,
            'genre': request.genre
        }
        
        # AI 분석 실행
        result = openai_service.analyze_review(review_data)
        
        # 직접 딕셔너리로 반환 (FastAPI가 자동으로 JSON으로 변환)
        return {
            "review_id": request.review_id,
            "ai_response": result.get('ai_response'),
            "recommendations": []  # recommendations는 ai_response 내부에 포함됨
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Review analysis failed: {str(e)}"
        )

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "review-analysis"}