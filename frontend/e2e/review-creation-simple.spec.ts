import { test, expect } from '@playwright/test';

test.describe('BookLLM E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // webpack-dev-server overlay를 숨기기
    await page.addStyleTag({ 
      content: `
        #webpack-dev-server-client-overlay { display: none !important; }
        #webpack-dev-server-client-overlay-div { display: none !important; }
        iframe#webpack-dev-server-client-overlay { display: none !important; }
        body > div[style*="z-index: 2147483647"] { display: none !important; }
      ` 
    });
    await page.waitForTimeout(500);
  });

  test('전체 리뷰 생성 플로우 테스트', async ({ page }) => {
    // 1. 홈페이지 접속
    await page.goto('http://localhost:3001');
    await expect(page).toHaveTitle(/BookLLM/);
    
    // 2. 감상평 작성 페이지로 네비게이션
    await page.goto('http://localhost:3001/create-review');
    await expect(page).toHaveURL(/create-review/);
    
    // 3. 페이지 요소 확인
    await expect(page.locator('text=독서 감상평 작성')).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('textarea').first()).toBeVisible();
    await expect(page.locator('button:has-text("AI 분석 받기")')).toBeVisible();
    
    console.log('✅ 리뷰 생성 페이지 로드 테스트 통과');
  });

  test('서비스 상태 확인', async ({ request }) => {
    // Backend API 확인
    const backendResponse = await request.get('http://localhost:8080/api/books');
    expect(backendResponse.status()).toBe(200);
    console.log('✅ Backend 서비스 정상');
    
    // AI Service 확인
    const aiResponse = await request.get('http://localhost:8001/health');
    expect(aiResponse.status()).toBe(200);
    console.log('✅ AI 서비스 정상');
    
    // Frontend 확인
    const frontendResponse = await request.get('http://localhost:3001');
    expect(frontendResponse.status()).toBe(200);
    console.log('✅ Frontend 서비스 정상');
  });

  test('AI 분석 응답 시간 테스트', async ({ request }) => {
    const startTime = Date.now();
    
    const response = await request.post('http://localhost:8001/api/v1/reviews/analyze', {
      data: {
        book_title: 'Test Book',
        author: 'Test Author',
        content: 'Great book!',
        rating: 5,
        user_emotion: 'Happy',
        genre: 'Fiction'
      }
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(5000); // 5초 이내 응답
    
    const data = await response.json();
    expect(data.ai_response).toBeDefined();
    expect(data.ai_response.empathy_message).toBeDefined();
    
    console.log(`✅ AI 서비스 응답 시간: ${responseTime}ms`);
  });
});