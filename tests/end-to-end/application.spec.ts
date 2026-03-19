import { expect, test } from '@playwright/test';

test('the application boots and exposes diagnostics', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Gwanyan Interactive Grassland')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Diagnostics' })).toBeVisible();

  const diagnosticsPresence = await page.evaluate(() => {
    return typeof window.__GWANYAN_DIAGNOSTICS__?.getBufferedEntries === 'function';
  });

  expect(diagnosticsPresence).toBe(true);
});

test('moving the mouse keeps the application interactive', async ({ page }) => {
  await page.goto('/');

  const viewportSize = page.viewportSize();

  if (viewportSize === null) {
    throw new Error('A viewport size is required for the interaction test.');
  }

  await page.mouse.move(viewportSize.width * 0.25, viewportSize.height * 0.5);
  await page.mouse.move(viewportSize.width * 0.75, viewportSize.height * 0.4, {
    steps: 15,
  });

  await expect(page.getByRole('button', { name: 'Download Logs' })).toBeVisible();
});
