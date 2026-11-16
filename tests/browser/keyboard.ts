import { type Page, test } from '@playwright/test';

export type TabKey = 'Tab' | 'Shift+Tab';

// WebKit, like Safari, skips links on Tab unless Alt is held.
export async function pressTab(page: Page, key: TabKey = 'Tab') {
  const webkit = test.info().project.name === 'webkit';
  await page.keyboard.press(webkit ? key.replace('Tab', 'Alt+Tab') : key);
}
