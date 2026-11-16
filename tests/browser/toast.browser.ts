import { expect, test } from '@playwright/test';
import { tabUntil } from './keyboard';

// The fixture uses delay={1500}
const pastDelay = 2500;

test('keyboard focus shows the close button and pauses the toast', async ({
  page,
}) => {
  await page.goto('/toast.html');
  await page.getByRole('button', { name: 'Show toast' }).click();
  const toast = page.getByRole('status').filter({ hasText: 'Toast 1' });
  const close = toast.getByRole('button');

  await tabUntil(page, close);
  await expect(close).toHaveCSS('opacity', '1');
  await page.waitForTimeout(pastDelay);
  await expect(toast).toBeVisible();

  await page.keyboard.press('Enter');
  await expect(toast).toBeHidden();
});

test('close button is hidden without hover or focus, and the toast resumes after blur', async ({
  page,
}) => {
  await page.goto('/toast.html');
  const trigger = page.getByRole('button', { name: 'Show toast' });
  await trigger.click();
  const toast = page.getByRole('status').filter({ hasText: 'Toast 1' });
  const close = toast.getByRole('button');
  await page.mouse.move(0, 0);
  await expect(close).toHaveCSS('opacity', '0');

  await tabUntil(page, close);
  await trigger.focus();
  await expect(toast).toBeHidden({ timeout: pastDelay * 2 });
});
