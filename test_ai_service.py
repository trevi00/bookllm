# -*- coding: utf-8 -*-
import requests
import json
import sys

# UTF-8 인코딩 설정
sys.stdout.reconfigure(encoding='utf-8')

# AI 서비스 테스트
def test_ai_service():
    url = "http://localhost:8001/api/v1/reviews/analyze"
    
    test_cases = [
        {
            "book_title": "데미안",
            "author": "헤르만 헤세",
            "content": "자아를 찾아가는 여정이 정말 감동적이었습니다. 싱클레어의 성장 과정을 보며 많은 것을 느꼈어요.",
            "rating": 5,
            "user_emotion": "감동적",
            "genre": "소설"
        },
        {
            "book_title": "어린 왕자",
            "author": "생텍쥐페리",
            "content": "순수함과 사랑에 대해 다시 생각해보게 되었습니다. 어른이 되어 읽으니 더 깊은 의미가 느껴집니다.",
            "rating": 4.5,
            "user_emotion": "따뜻함",
            "genre": "동화"
        },
        {
            "book_title": "테스트 책",
            "author": "테스트 저자",
            "content": "재미있고 흥미로운 이야기였습니다. 페이지를 넘기는 손을 멈출 수 없었어요.",
            "rating": 4,
            "user_emotion": "즐거움",
            "genre": "소설"
        }
    ]
    
    for i, test_data in enumerate(test_cases, 1):
        print(f"\n{'='*60}")
        print(f"테스트 {i}: {test_data['book_title']} - {test_data['author']}")
        print(f"{'='*60}")
        
        try:
            response = requests.post(url, json=test_data)
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result.get('ai_response', {})
                
                print("\n[SUCCESS] AI 분석 성공!")
                print("\n[공감 메시지]")
                print(f"   {ai_response.get('empathy_message', 'N/A')}")
                
                print("\n[책에 대한 통찰]")
                insights = ai_response.get('book_insights', [])
                for insight in insights:
                    print(f"   - {insight}")
                
                print("\n[감정 분석]")
                emotion = ai_response.get('emotion_analysis', {})
                print(f"   주요 감정: {emotion.get('primary', 'N/A')}")
                print(f"   보조 감정: {emotion.get('secondary', 'N/A')}")
                print(f"   강도: {emotion.get('intensity', 'N/A')}")
                
                print("\n[추천 도서]")
                recommendations = ai_response.get('book_recommendations', [])
                if recommendations:
                    for rec in recommendations:
                        print(f"   - {rec.get('title', 'N/A')} / {rec.get('author', 'N/A')}")
                        print(f"     이유: {rec.get('reason', 'N/A')}")
                else:
                    print("   추천 도서가 없습니다.")
                
                print("\n[개인화된 통찰]")
                print(f"   {ai_response.get('personalized_insight', 'N/A')}")
                
            else:
                print(f"[ERROR] 오류 발생: HTTP {response.status_code}")
                print(f"   {response.text}")
                
        except Exception as e:
            print(f"[ERROR] 연결 오류: {str(e)}")
    
    print(f"\n{'='*60}")
    print("테스트 완료!")
    print(f"{'='*60}")

if __name__ == "__main__":
    test_ai_service()