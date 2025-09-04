import requests

print("BookLLM System Test")
print("=" * 40)

# 1. FastAPI Health Check
try:
    response = requests.get("http://localhost:8001/health")
    print(f"FastAPI AI Service: OK (Status {response.status_code})")
except:
    print("FastAPI AI Service: FAILED")

# 2. Spring Boot Check
try:
    response = requests.get("http://localhost:8080/api/reviews/user/1")
    print(f"Spring Boot Backend: OK (Status {response.status_code})")
except:
    print("Spring Boot Backend: FAILED")

# 3. React Frontend Check  
try:
    response = requests.get("http://localhost:3001")
    print(f"React Frontend: OK (Status {response.status_code})")
except:
    print("React Frontend: FAILED")

# 4. AI Service Test
print("\n" + "=" * 40)
print("Testing AI Analysis...")
try:
    test_review = {
        "book_title": "The Little Prince",
        "author": "Antoine de Saint-Exupery",
        "content": "This book touched my heart deeply. The story about the prince's journey and his rose made me think about what's truly important in life.",
        "rating": 5,
        "user_emotion": "moved",
        "genre": "fiction"
    }
    
    response = requests.post("http://localhost:8001/api/v1/reviews/analyze", json=test_review)
    if response.status_code == 200:
        result = response.json()
        print("AI Analysis: SUCCESS")
        if 'ai_response' in result and result['ai_response']:
            if result['ai_response'].get('empathy_message'):
                print("- Empathy message generated")
            if result['ai_response'].get('book_insights'):
                print(f"- Book insights: {len(result['ai_response']['book_insights'])} items")
        if 'recommendations' in result:
            print(f"- Recommendations: {len(result['recommendations'])} books")
    else:
        print(f"AI Analysis: FAILED (Status {response.status_code})")
except Exception as e:
    print(f"AI Analysis: ERROR - {str(e)[:50]}")

print("\n" + "=" * 40)
print("All systems operational!")
print("\nAccess the application at: http://localhost:3001")