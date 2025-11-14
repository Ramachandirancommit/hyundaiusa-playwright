import { test, expect } from '@playwright/test';

test('Hyundai USA Homepage - Positive URL Verification', async ({ page }) => {
  await page.goto('https://www.hyundaiusa.com/us/en', { waitUntil: 'load' });

  // Positive URL check
  await expect(page).toHaveURL(/hyundaiusa\.com\/us\/en/);

  const header = page.locator('header');
  await expect(header).toBeVisible();

  console.log('✅ Page loaded and URL verified successfully.');
});
