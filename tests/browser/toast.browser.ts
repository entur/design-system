import { type Locator, type Page, expect, test } from '@playwright/test';
import { pressTab } from './keyboard';

// The fixture uses delay={1500}
const pastDelay = 2500;

test.skip(
  ({ browserName }) => browserName === 'webkit' && process.platform === 'linux',
  'Linux WebKit leaves the hidden close button out of the tab order; macOS WebKit and Safari do not',
);

// The toast container comes before the page content in the DOM
async function tabBackToClose(page: Page, close: Locator) {
  // Wait for the slide-in animation, which a slow runner can still be in
  await close.evaluate(element =>
    Promise.all(
      element
        .closest('.eds-alert-box')!
        .getAnimations({ subtree: true })
        .map(animation => animation.finished),
    ),
  );
  await page.getByRole('button', { name: 'Show toast' }).focus();
  await pressTab(page, 'Shift+Tab');
  await expect(close).toBeFocused();
}

test('keyboard focus shows the close button and pauses the toast', async ({
  page,
}) => {
  await page.goto('/toast.html');
  await page.getByRole('button', { name: 'Show toast' }).click();
  const toast = page.locator('.eds-toast-container .eds-alert-box', {
    hasText: 'Toast 1',
  });
  const close = toast.getByRole('button');

  await tabBackToClose(page, close);
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
  const toast = page.locator('.eds-toast-container .eds-alert-box', {
    hasText: 'Toast 1',
  });
  const close = toast.getByRole('button');
  await page.mouse.move(0, 0);
  await expect(close).toHaveCSS('opacity', '0');

  await tabBackToClose(page, close);
  await trigger.focus();
  await expect(toast).toBeHidden({ timeout: pastDelay * 2 });
});
