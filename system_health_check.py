#!/usr/bin/env python3
"""
BookLLM 시스템 상태 확인 스크립트
"""

import requests
import json
from datetime import datetime
from typing import Dict, Any

def check_service(name: str, url: str, expected_status: int = 200) -> Dict[str, Any]:
    """서비스 상태 확인"""
    try:
        response = requests.get(url, timeout=5)
        is_healthy = response.status_code == expected_status
        return {
            "name": name,
            "url": url,
            "status": "✅ Running" if is_healthy else f"⚠️ Status {response.status_code}",
            "response_time": f"{response.elapsed.total_seconds():.2f}s",
            "healthy": is_healthy
        }
    except requests.exceptions.RequestException as e:
        return {
            "name": name,
            "url": url,
            "status": f"❌ Error: {str(e)[:50]}",
            "response_time": "N/A",
            "healthy": False
        }

def main():
    print("=" * 60)
    print("BookLLM 시스템 상태 점검")
    print(f"시간: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # 서비스 목록
    services = [
        ("MySQL Database", "http://localhost:3307", 404),  # MySQL은 HTTP가 아니라서 404 예상
        ("FastAPI AI Service", "http://localhost:8001/health", 200),
        ("Spring Boot Backend", "http://localhost:8080/api/reviews/user/1", 200),
        ("React Frontend", "http://localhost:3001", 200),
    ]
    
    results = []
    for name, url, expected in services:
        result = check_service(name, url, expected)
        results.append(result)
        print(f"\n{result['name']}:")
        print(f"  URL: {result['url']}")
        print(f"  상태: {result['status']}")
        print(f"  응답시간: {result['response_time']}")
    
    # 전체 상태 요약
    all_healthy = all(r['healthy'] for r in results if r['name'] != "MySQL Database")
    
    print("\n" + "=" * 60)
    if all_healthy:
        print("✅ 모든 서비스가 정상 작동 중입니다!")
        print("\n📌 접속 방법:")
        print("  - Frontend: http://localhost:3001")
        print("  - API Docs: http://localhost:8001/docs")
        print("  - Backend: http://localhost:8080")
    else:
        print("⚠️ 일부 서비스에 문제가 있습니다.")
        failed = [r['name'] for r in results if not r['healthy']]
        print(f"  문제 서비스: {', '.join(failed)}")
    
    # AI 테스트
    print("\n" + "=" * 60)
    print("AI 서비스 테스트:")
    try:
        test_data = {
            "book_title": "테스트 책",
            "author": "테스트 저자",
            "content": "정말 감동적인 책이었습니다.",
            "rating": 5,
            "user_emotion": "감동",
            "genre": "소설"
        }
        response = requests.post(
            "http://localhost:8001/api/v1/reviews/analyze",
            json=test_data,
            timeout=30
        )
        if response.status_code == 200:
            result = response.json()
            if 'ai_response' in result and result['ai_response']:
                print("  ✅ AI 분석 기능 정상 작동")
                if result['ai_response'].get('empathy_message'):
                    print(f"  공감 메시지 생성: 성공")
            else:
                print("  ⚠️ AI 응답이 비어있음")
        else:
            print(f"  ❌ AI 서비스 오류: {response.status_code}")
    except Exception as e:
        print(f"  ❌ AI 테스트 실패: {str(e)[:100]}")
    
    print("\n" + "=" * 60)
    print("점검 완료!")

if __name__ == "__main__":
    main()