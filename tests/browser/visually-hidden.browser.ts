import { expect, test } from '@playwright/test';

test('VisuallyHidden stays hidden when given a className', async ({ page }) => {
  await page.goto('/visually-hidden.html');
  const hidden = page.getByText('Hidden text');
  const box = await hidden.boundingBox();
  expect(box?.width).toBeLessThanOrEqual(1);
  expect(box?.height).toBeLessThanOrEqual(1);
});
