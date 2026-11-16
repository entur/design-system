import { type Locator, type Page, test } from '@playwright/test';

export type TabKey = 'Tab' | 'Shift+Tab';

// WebKit, like Safari, skips links on Tab unless Alt is held.
export async function pressTab(page: Page, key: TabKey = 'Tab') {
  const webkit = test.info().project.name === 'webkit';
  await page.keyboard.press(webkit ? key.replace('Tab', 'Alt+Tab') : key);
}

export async function tabUntil(page: Page, target: Locator, maxPresses = 10) {
  for (let press = 0; press < maxPresses; press++) {
    await pressTab(page);
    if (await target.evaluate(element => element === document.activeElement))
      return;
  }
  throw new Error(`Tab never reached the target in ${maxPresses} presses`);
}
