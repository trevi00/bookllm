import requests
import json

# Base URLs
BACKEND_URL = "http://localhost:8080"
AI_SERVICE_URL = "http://localhost:8001"

def test_ai_service():
    """FastAPI AI 서비스 테스트"""
    print("=== FastAPI AI 서비스 테스트 ===")
    
    # Health check
    response = requests.get(f"{AI_SERVICE_URL}/health")
    print(f"Health Check: {response.json()}")
    
    # 리뷰 분석 테스트
    review_data = {
        "review_id": 1,
        "book_title": "어린 왕자",
        "author": "생텍쥐페리",
        "content": "이 책을 읽으며 어른이 되면서 잃어버린 순수함과 상상력을 다시 찾은 것 같아요. 특히 여우와의 대화에서 '가장 중요한 것은 눈에 보이지 않는다'는 구절이 마음 깊이 와닿았습니다.",
        "rating": 5.0,
        "user_emotion": "감동적이고 따뜻함",
        "genre": "동화"
    }
    
    print("\n리뷰 분석 요청 중...")
    response = requests.post(
        f"{AI_SERVICE_URL}/api/v1/reviews/analyze",
        json=review_data
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"분석 성공!")
        print(f"공감 메시지: {result['ai_response']['empathy_message'][:100]}...")
        print(f"추천 도서 수: {len(result['recommendations'])}")
    else:
        print(f"분석 실패: {response.status_code}")

def test_spring_boot():
    """Spring Boot 백엔드 테스트"""
    print("\n=== Spring Boot 백엔드 테스트 ===")
    
    # 사용자별 리뷰 조회
    response = requests.get(f"{BACKEND_URL}/api/reviews/user/1")
    print(f"사용자 리뷰 조회: {response.json()}")
    
    # 도서별 리뷰 조회
    response = requests.get(f"{BACKEND_URL}/api/reviews/book/1")
    print(f"도서 리뷰 조회: {response.json()}")

if __name__ == "__main__":
    print("BookLLM API 테스트 시작\n")
    
    # AI 서비스 테스트
    test_ai_service()
    
    # 백엔드 테스트
    test_spring_boot()
    
    print("\n테스트 완료!")