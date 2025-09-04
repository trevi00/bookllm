# BookLLM Architecture

## 개요
AI 기반 독서 감상평 분석 및 추천 시스템

## 시스템 구성

### 1. AI Service (Python FastAPI)
- **포트**: 8001
- **역할**: OpenAI API를 활용한 감상평 분석 및 도서 추천
- **주요 기능**:
  - 감상평 감정 분석
  - 공감 메시지 생성
  - 도서 인사이트 추출
  - 유사 도서 추천

### 2. Backend Service (Spring Boot)
- **포트**: 8080
- **역할**: 비즈니스 로직 및 데이터 관리
- **주요 도메인**:
  - User: 사용자 관리
  - Book: 도서 정보 관리
  - Review: 감상평 관리
  - Recommendation: 추천 도서 관리

### 3. Database (MySQL)
- **포트**: 3307 (Docker)
- **데이터베이스명**: bookllm

### 4. Frontend (React) - 예정
- **포트**: 3000
- **역할**: 사용자 인터페이스

## API 엔드포인트

### AI Service
- `POST /api/v1/reviews/analyze`: 리뷰 분석
- `POST /api/v1/recommendations`: 도서 추천

### Backend Service
- `POST /api/reviews`: 리뷰 작성
- `GET /api/reviews/user/{userId}`: 사용자별 리뷰 조회
- `GET /api/reviews/book/{bookId}`: 도서별 리뷰 조회
- `GET /api/reviews/{reviewId}`: 특정 리뷰 조회

## 데이터 플로우
1. 사용자가 리뷰 작성
2. Backend에서 리뷰 저장
3. AI Service 호출하여 분석
4. 분석 결과를 리뷰에 업데이트
5. 사용자에게 결과 반환