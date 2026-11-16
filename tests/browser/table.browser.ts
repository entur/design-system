import { expect, test } from '@playwright/test';
import { pressTab } from './keyboard';

test('Tab reaches one row and arrow keys move between rows', async ({
  page,
}) => {
  await page.goto('/table.html');
  const rows = page.locator('tbody tr');
  await page.getByRole('button', { name: 'Before table' }).focus();

  await pressTab(page);
  await expect(rows.nth(0)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(rows.nth(1)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(rows.nth(2)).toBeFocused();
  expect(
    await rows.evaluateAll(elements =>
      elements.map(element => element.getAttribute('tabindex')),
    ),
  ).toEqual(['-1', '-1', '0']);

  // Leave the table and come back: the last row is still the one in the tab order
  await pressTab(page);
  await pressTab(page);
  await expect(page.getByRole('button', { name: 'After table' })).toBeFocused();
  await pressTab(page, 'Shift+Tab');
  await pressTab(page, 'Shift+Tab');
  await expect(rows.nth(2)).toBeFocused();
});

test('clicking a button inside a row leaves focus where the browser put it', async ({
  page,
}) => {
  await page.goto('/table.html');
  const edit = page.getByRole('button', { name: 'Edit Bergen' });
  await edit.click();
  // WebKit, like Safari, never focuses a clicked button, so the row gets it
  if (test.info().project.name === 'webkit') {
    await expect(page.locator('tbody tr').nth(1)).toBeFocused();
  } else {
    await expect(edit).toBeFocused();
  }
});
