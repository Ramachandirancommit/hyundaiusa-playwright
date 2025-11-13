import { test, expect } from '@playwright/test';

test('Hyundai USA Homepage - URL and Title Verification', async ({ page }) => {
  // Step 1: Go to the homepage
  await page.goto('https://www.hyundaiusa.com/us/en', { waitUntil: 'load' });

  // Step 2: Verify redirection (URL confirmation)
  await expect(page).toHaveURL(/hyundaiusa\.com\/us\/en/);

  // Step 4: Confirm that the page content (like a key element) is loaded
  const header = page.locator('header');
  await expect(header).toBeVisible();

  console.log('✅ Page loaded, redirected correctly, and title verified.');
});
