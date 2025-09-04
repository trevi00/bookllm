from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class BookReview(BaseModel):
    book_title: str = Field(..., description="책 제목")
    author: str = Field(..., description="저자")
    content: str = Field(..., description="감상평 내용")
    rating: float = Field(..., ge=0, le=5, description="평점")
    user_emotion: str = Field(..., description="독자가 느낀 주요 감정")
    genre: Optional[str] = Field(None, description="장르")
    reading_date: Optional[datetime] = Field(None, description="독서 완료일")

class EmotionAnalysis(BaseModel):
    primary: str = Field(..., description="주요 감정")
    secondary: str = Field(..., description="보조 감정")
    intensity: str = Field(..., description="감정 강도")

class BookRecommendationItem(BaseModel):
    title: str = Field(..., description="추천 도서 제목")
    author: str = Field(..., description="추천 도서 저자")
    reason: str = Field(..., description="추천 이유")

class AIResponse(BaseModel):
    empathy_message: str = Field(..., description="공감 메시지")
    book_insights: List[str] = Field(..., description="책에 대한 통찰")
    emotion_analysis: EmotionAnalysis = Field(..., description="감정 분석 결과")
    book_recommendations: Optional[List[BookRecommendationItem]] = Field(None, description="추천 도서 목록")
    personalized_insight: Optional[str] = Field(None, description="개인화된 통찰")

class BookRecommendation(BaseModel):
    title: str = Field(..., description="추천 도서 제목")
    author: str = Field(..., description="추천 도서 저자")
    reason: str = Field(..., description="추천 이유")
    similarity_score: float = Field(..., ge=0, le=1, description="유사도 점수")

class ReviewAnalysisRequest(BaseModel):
    review_id: Optional[int] = None
    book_title: str
    author: str
    content: str
    rating: float = Field(..., ge=0, le=5)
    user_emotion: str
    genre: Optional[str] = None

class ReviewAnalysisResponse(BaseModel):
    review_id: Optional[int] = None
    ai_response: AIResponse
    recommendations: List[BookRecommendation]
    created_at: datetime = Field(default_factory=datetime.now)

class RecommendationRequest(BaseModel):
    book_title: str
    author: str
    genre: str

class RecommendationResponse(BaseModel):
    recommendations: List[BookRecommendation]
    generated_at: datetime = Field(default_factory=datetime.now)