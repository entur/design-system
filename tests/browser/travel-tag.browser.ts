import { expect, test } from '@playwright/test';
import { pressTab } from './keyboard';

test('close button of a removable TravelTag is reachable with Tab and removes it', async ({
  page,
}) => {
  await page.goto('/travel-tag.html');
  const tag = page.getByRole('group', { name: 'Buss 31' });
  const close = tag.getByRole('button', { name: 'Fjern Buss 31' });

  await pressTab(page);
  await expect(close).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(tag).toHaveCount(0);
});
