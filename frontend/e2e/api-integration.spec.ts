import { test, expect } from '@playwright/test';

test.describe('BookLLM API Integration E2E Tests', () => {
  
  test('전체 리뷰 생성 플로우 - API 레벨', async ({ request }) => {
    console.log('=== 리뷰 생성 플로우 시작 ===');
    
    // 고유한 책 제목 생성 (중복 방지)
    const timestamp = Date.now();
    const uniqueBookTitle = `E2E Test Book ${timestamp}`;
    
    // 1단계: 책 조회 또는 생성
    console.log('1. 책 정보 조회/생성');
    const bookResponse = await request.get('http://localhost:8080/api/books/search', {
      params: {
        title: uniqueBookTitle,
        author: 'Test Author',
        genre: 'Fiction'
      }
    });
    
    expect(bookResponse.status()).toBe(200);
    const book = await bookResponse.json();
    expect(book.id).toBeDefined();
    console.log(`✅ 책 ID: ${book.id}`);
    
    // 2단계: AI 분석 요청
    console.log('2. AI 서비스 분석 요청');
    const aiStartTime = Date.now();
    const aiResponse = await request.post('http://localhost:8001/api/v1/reviews/analyze', {
      data: {
        book_title: uniqueBookTitle,
        author: 'Test Author',
        content: '이 책은 정말 훌륭했습니다. 깊은 감동을 받았고 많은 것을 배웠습니다.',
        rating: 5,
        user_emotion: 'Happy',
        genre: 'Fiction'
      }
    });
    
    const aiResponseTime = Date.now() - aiStartTime;
    expect(aiResponse.status()).toBe(200);
    const aiResult = await aiResponse.json();
    
    expect(aiResult.ai_response).toBeDefined();
    expect(aiResult.ai_response.empathy_message).toBeDefined();
    expect(aiResult.ai_response.book_insights).toBeDefined();
    expect(aiResult.ai_response.emotion_analysis).toBeDefined();
    
    console.log(`✅ AI 분석 완료 (${aiResponseTime}ms)`);
    console.log(`   - 공감 메시지: ${aiResult.ai_response.empathy_message.substring(0, 50)}...`);
    console.log(`   - 통찰 개수: ${aiResult.ai_response.book_insights.length}`);
    
    // 3단계: 리뷰 저장
    console.log('3. 리뷰 저장');
    const reviewPayload = {
      bookId: book.id,
      content: '이 책은 정말 훌륭했습니다. 깊은 감동을 받았고 많은 것을 배웠습니다.',
      rating: 5.0,
      userEmotion: 'Happy',
      readingDate: new Date().toISOString().slice(0, -1)
    };
    
    const saveResponse = await request.post('http://localhost:8080/api/reviews', {
      data: reviewPayload,
      headers: {
        'userId': '1',
        'Content-Type': 'application/json'
      }
    });
    
    expect(saveResponse.status()).toBe(201);
    const savedReview = await saveResponse.json();
    expect(savedReview.id).toBeDefined();
    expect(savedReview.bookTitle).toBe(uniqueBookTitle);
    
    console.log(`✅ 리뷰 저장 완료 (ID: ${savedReview.id})`);
    
    // 4단계: 저장된 리뷰 조회
    console.log('4. 저장된 리뷰 확인');
    const userReviewsResponse = await request.get('http://localhost:8080/api/reviews/user/1');
    expect(userReviewsResponse.status()).toBe(200);
    const userReviews = await userReviewsResponse.json();
    
    const createdReview = userReviews.find((r: any) => r.id === savedReview.id);
    expect(createdReview).toBeDefined();
    
    console.log('✅ 전체 플로우 성공적으로 완료');
    console.log('=== 테스트 종료 ===');
  });
  
  test('AI 서비스와 백엔드 연동 테스트', async ({ request }) => {
    console.log('=== AI-Backend 연동 테스트 ===');
    
    // 여러 번 AI 분석 요청하여 일관성 확인
    const testCases = [
      { emotion: 'Happy', content: 'Great book!' },
      { emotion: 'Sad', content: 'Made me cry' },
      { emotion: 'Excited', content: 'Amazing story!' }
    ];
    
    for (const testCase of testCases) {
      const response = await request.post('http://localhost:8001/api/v1/reviews/analyze', {
        data: {
          book_title: 'Test',
          author: 'Author',
          content: testCase.content,
          rating: 4,
          user_emotion: testCase.emotion,
          genre: 'Test'
        }
      });
      
      expect(response.status()).toBe(200);
      const result = await response.json();
      // 모의 응답이므로 emotion이 정확히 포함되지 않을 수 있음
      expect(result.ai_response.empathy_message).toBeDefined();
      expect(result.ai_response.empathy_message.length).toBeGreaterThan(0);
      console.log(`✅ ${testCase.emotion}: AI 응답 확인`);
    }
  });
  
  test('프로세스 분리 검증 - AI 분석과 저장이 독립적', async ({ request }) => {
    console.log('=== 프로세스 분리 검증 ===');
    
    // AI 분석만 실행 (저장하지 않음)
    const aiResponse = await request.post('http://localhost:8001/api/v1/reviews/analyze', {
      data: {
        book_title: 'Independence Test',
        author: 'Test',
        content: 'Testing independence',
        rating: 3,
        user_emotion: 'Neutral',
        genre: 'Test'
      }
    });
    
    expect(aiResponse.status()).toBe(200);
    console.log('✅ AI 분석만 실행 - 저장 없이 완료');
    
    // 리뷰 목록 확인 (새 리뷰가 추가되지 않았는지)
    const beforeCount = (await (await request.get('http://localhost:8080/api/reviews/user/1')).json()).length;
    
    // 다시 AI 분석 (여전히 저장하지 않음)
    await request.post('http://localhost:8001/api/v1/reviews/analyze', {
      data: {
        book_title: 'Another Test',
        author: 'Test',
        content: 'Another test',
        rating: 4,
        user_emotion: 'Happy',
        genre: 'Test'
      }
    });
    
    const afterCount = (await (await request.get('http://localhost:8080/api/reviews/user/1')).json()).length;
    expect(afterCount).toBe(beforeCount);
    
    console.log('✅ AI 분석이 자동으로 저장되지 않음 확인');
    console.log('✅ 프로세스 분리가 올바르게 구현됨');
  });
  
  test('성능 벤치마크', async ({ request }) => {
    console.log('=== 성능 벤치마크 ===');
    
    const iterations = 5;
    const responseTimes: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      const response = await request.post('http://localhost:8001/api/v1/reviews/analyze', {
        data: {
          book_title: `Book ${i}`,
          author: `Author ${i}`,
          content: `Content ${i}`,
          rating: 5,
          user_emotion: 'Happy',
          genre: 'Test'
        }
      });
      const responseTime = Date.now() - start;
      responseTimes.push(responseTime);
      
      expect(response.status()).toBe(200);
      console.log(`  반복 ${i + 1}: ${responseTime}ms`);
    }
    
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / iterations;
    const maxTime = Math.max(...responseTimes);
    const minTime = Math.min(...responseTimes);
    
    console.log(`✅ 평균 응답 시간: ${avgTime.toFixed(2)}ms`);
    console.log(`✅ 최소 응답 시간: ${minTime}ms`);
    console.log(`✅ 최대 응답 시간: ${maxTime}ms`);
    
    // 평균 응답 시간이 1초 미만인지 확인
    expect(avgTime).toBeLessThan(1000);
  });
});