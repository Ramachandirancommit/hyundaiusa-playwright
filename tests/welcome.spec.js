import { test, expect } from '@playwright/test';

test('Hyundai USA Homepage - Negative URL Verification', async ({ page }) => {
  await page.goto('https://www.hyundaiusa.com/us/en', { waitUntil: 'load' });

  // Intentionally failing URL check
  await expect(page).toHaveURL(/incorrect-url\.com/);

  const header = page.locator('header');
  await expect(header).toBeVisible();

  console.log('❌ This log may not appear because the test will fail at URL check.');
});
