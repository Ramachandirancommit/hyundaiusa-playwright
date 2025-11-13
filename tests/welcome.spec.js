import { test, expect } from '@playwright/test';

test('Verify Welcome Back section and interactions on Hyundai USA homepage', async ({ page }) => {
  test.setTimeout(90000);

  // Step 1: Navigate
  await page.goto('https://www.hyundaiusa.com/us/en', { waitUntil: 'domcontentloaded' });

  // Step 2: Wait for either ZIP modal or Welcome Back
  const zipInput = page.locator('input#zipModalInput[placeholder="Enter ZIP Code"]');
  const welcomeBack = page.locator('h3.tnt-headline', { hasText: 'Welcome Back.' });

  await Promise.race([
    zipInput.waitFor({ state: 'visible', timeout: 30000 }).catch(() => null),
    welcomeBack.waitFor({ state: 'visible', timeout: 30000 }).catch(() => null),
  ]);

  // Step 3: If ZIP modal appears
  if (await zipInput.isVisible()) {
    await zipInput.fill('80001');

    // Find Confirm button *inside* the ZIP modal container only
    const zipModal = page.locator('div[class*="zip"], div[role="dialog"]', { has: zipInput });
    const confirmButton = zipModal.locator('button:has-text("Confirm")').first();

    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    } else {
      await zipInput.press('Enter');
    }

    // Wait for modal to disappear
    await expect(zipInput).not.toBeVisible({ timeout: 10000 });
  }

  // Step 4: Welcome Back headline
  await welcomeBack.waitFor({ state: 'visible', timeout: 30000 });
  await expect(welcomeBack).toBeVisible();

  // Step 5: Warranty text
  const warrantyText =
    'Did you know every new 2026 Hyundai comes with America’s Best Warranty, which includes a 10-year/100,000-mile Powertrain Limited Warranty? And with 3 Day Worry-Free Exchange from a Shopper Assurance dealership, you can shop with confidence.';
  const warrantySpan = page.locator('span.tnt-subhead-1');
  await expect(warrantySpan).toHaveText(warrantyText);

  // Step 6: Model Name
  const modelName = page.locator('h4.wb-model-year', { hasText: '2026' });
  await expect(modelName).toContainText('2026 IONIQ 5');

  // Step 7: Car Image
  const carImage = page.locator('img.tnt-img[alt="2026 IONIQ 5"]');
  await expect(carImage).toBeVisible();

  // Step 8: See Offers Button
  const seeOffersBtn = page.locator('a.tnt-cta-1', { hasText: 'See Offers' });
  await expect(seeOffersBtn).toBeVisible();
  await Promise.all([
    page.waitForNavigation({ timeout: 20000 }),
    seeOffersBtn.click()
  ]);
  await expect(page).toHaveURL(/offers\/detail/);

  // Step 9: Go Back and Request a Quote
  await page.goBack();
  await page.waitForSelector('a.tnt-cta-2', { timeout: 20000 });
  const requestQuoteBtn = page.locator('a.tnt-cta-2', { hasText: 'Request a quote' });
  await expect(requestQuoteBtn).toBeVisible();
  await Promise.all([
    page.waitForNavigation({ timeout: 20000 }),
    requestQuoteBtn.click()
  ]);
  await expect(page).toHaveURL(/vehicles\/ioniq-5/);

  // Step 10: Back for disclaimer
  await page.goBack();
  const infoButton = page.locator('button.tooltip-trigger[aria-label="Click to read disclaimer information"]');
  await expect(infoButton).toBeVisible();
  await infoButton.click();

  // Step 11: Disclaimer Text
  const disclaimerText = page.locator('p', {
    hasText: 'Under the 3 Day Worry-Free Exchange'
  });
  await expect(disclaimerText).toBeVisible();

  // Step 12: Close Popup
  const closeBtn = page.locator('button.modal-x[aria-label="Close"]');
  await expect(closeBtn).toBeVisible();
  await closeBtn.click();
  await expect(disclaimerText).not.toBeVisible();
});
