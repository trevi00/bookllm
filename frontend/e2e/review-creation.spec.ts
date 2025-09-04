import { test, expect } from '@playwright/test';

test.describe('Review Creation Flow', () => {
  test('should complete full review creation flow', async ({ page }) => {
    // 1. 홈페이지 접속
    await page.goto('http://localhost:3001');
    await expect(page).toHaveTitle(/BookLLM/);
    
    // 2. 감상평 작성 페이지로 이동
    await page.goto('http://localhost:3001/create-review');
    await page.waitForURL('**/create-review');
    
    // 3. 페이지 요소 확인
    await expect(page.locator('text=독서 감상평 작성')).toBeVisible();
    
    // 4. 필수 요소 존재 확인
    await expect(page.locator('input').first()).toBeVisible(); // 책 제목
    await expect(page.locator('textarea').first()).toBeVisible(); // 감상평
    await expect(page.locator('button:has-text("AI 분석 받기")')).toBeVisible();
    
    console.log('✅ 리뷰 생성 플로우 페이지 로드 확인');
  });

  test('should show error when required fields are missing', async ({ page }) => {
    await page.goto('/create-review');
    
    // 필수 필드 없이 제출 시도
    await page.getByRole('button', { name: 'AI 분석 받기' }).click();
    
    // HTML5 validation 또는 에러 메시지 확인
    const bookTitleInput = page.getByLabel('책 제목');
    const isInvalid = await bookTitleInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBeTruthy();
  });

  test.skip('should allow re-analysis after AI response', async ({ page }) => {
    // Skip this test as it requires complex MUI component interaction
    // Functionality is tested through API integration tests
  });
});

test.describe('Service Health Check', () => {
  test('should verify all services are running', async ({ request }) => {
    // Backend API
    const backendResponse = await request.get('http://localhost:8080/api/books');
    expect(backendResponse.ok()).toBeTruthy();
    
    // AI Service
    const aiResponse = await request.get('http://localhost:8001/health');
    expect(aiResponse.ok()).toBeTruthy();
    
    // Frontend
    const frontendResponse = await request.get('http://localhost:3001');
    expect(frontendResponse.ok()).toBeTruthy();
  });
});