-- AI 추천 도서 및 개인화된 통찰 컬럼 추가
ALTER TABLE reviews 
ADD COLUMN ai_book_recommendations TEXT,
ADD COLUMN ai_personalized_insight TEXT;