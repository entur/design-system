import { type Locator, type Page, expect, test } from '@playwright/test';

type TabKey = 'Tab' | 'Shift+Tab';

// WebKit, like Safari, skips links on Tab unless Alt is held.
async function pressTab(page: Page, key: TabKey = 'Tab') {
  const webkit = test.info().project.name === 'webkit';
  await page.keyboard.press(webkit ? key.replace('Tab', 'Alt+Tab') : key);
}

// Native modal dialogs may hand focus to browser UI at their edges instead of
// wrapping, so only page content behind the dialog is ruled out.
async function expectFocusInsideDialogOrBrowser(dialog: Locator) {
  const focusedOutside = await dialog.evaluate(element => {
    const active = document.activeElement;
    return !!active && active !== document.body && !element.contains(active);
  });
  expect(focusedOutside).toBe(false);
}

test('modal Tab order moves through its content in both directions', async ({
  page,
}) => {
  await page.goto('/?scenario=modal');
  await page.getByRole('button', { name: 'Open modal', exact: true }).click();

  const dialog = page.getByRole('dialog', { name: 'Travel preferences' });
  const close = dialog.getByRole('button', {
    name: 'Close modal',
    exact: true,
  });
  const destination = dialog.getByRole('textbox', { name: 'Destination' });
  const save = dialog.getByRole('button', { name: 'Save preferences' });

  await expect(
    dialog.getByRole('heading', { name: 'Travel preferences' }),
  ).toBeFocused();
  await pressTab(page);
  await expect(destination).toBeFocused();
  await pressTab(page);
  await expect(save).toBeFocused();
  await pressTab(page, 'Shift+Tab');
  await expect(destination).toBeFocused();
  await pressTab(page, 'Shift+Tab');
  await expect(close).toBeFocused();
});

test('modal keeps keyboard focus out of the page behind it', async ({
  page,
}) => {
  await page.goto('/?scenario=modal');
  await page.getByRole('button', { name: 'Open modal', exact: true }).click();

  const dialog = page.getByRole('dialog', { name: 'Travel preferences' });
  await dialog.getByRole('button', { name: 'Save preferences' }).focus();
  for (let press = 0; press < 3; press++) {
    await pressTab(page);
    await expectFocusInsideDialogOrBrowser(dialog);
  }

  await dialog
    .getByRole('button', { name: 'Close modal', exact: true })
    .focus();
  for (let press = 0; press < 3; press++) {
    await pressTab(page, 'Shift+Tab');
    await expectFocusInsideDialogOrBrowser(dialog);
  }
});

for (const dismissal of ['Escape', 'close button'] as const) {
  test(`modal restores its invoker after ${dismissal}`, async ({ page }) => {
    await page.goto('/?scenario=modal');
    const invoker = page.getByRole('button', {
      name: 'Open modal',
      exact: true,
    });
    await invoker.click();
    const dialog = page.getByRole('dialog', { name: 'Travel preferences' });
    await expect(dialog).toBeVisible();

    if (dismissal === 'Escape') {
      await page.keyboard.press('Escape');
    } else {
      await dialog
        .getByRole('button', { name: 'Close modal', exact: true })
        .click();
    }

    await expect(dialog).toBeHidden();
    await expect(invoker).toBeFocused();
  });
}

test('modal honors initialFocusRef', async ({ page }) => {
  await page.goto('/?scenario=modal&customFocus');
  await page.getByRole('button', { name: 'Open modal', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Travel preferences' });
  await expect(
    dialog.getByRole('textbox', { name: 'Destination' }),
  ).toBeFocused();
});

test('skip link transfers focus and subsequent Tab to main content', async ({
  page,
}) => {
  await page.goto('/?scenario=skip-link');
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await pressTab(page);
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await pressTab(page);
  await expect(
    page.getByRole('link', { name: 'Main content link' }),
  ).toBeFocused();
});

test('collapsed content is excluded from keyboard navigation before and after expansion', async ({
  page,
}) => {
  await page.goto('/?scenario=expand');
  const trigger = page.getByRole('button', { name: 'Journey details' });
  const after = page.getByRole('button', { name: 'After panel' });

  await pressTab(page);
  await expect(
    page.getByRole('button', { name: 'Before panel' }),
  ).toBeFocused();
  await pressTab(page);
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await pressTab(page);
  await expect(after).toBeFocused();
  await pressTab(page, 'Shift+Tab');
  await expect(trigger).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const passenger = page.getByRole('textbox', { name: 'Passenger name' });
  await expect(passenger).toBeVisible();
  await pressTab(page);
  await expect(passenger).toBeFocused();
  await pressTab(page);
  await expect(page.getByRole('link', { name: 'Journey link' })).toBeFocused();
  await pressTab(page);
  await expect(after).toBeFocused();

  await pressTab(page, 'Shift+Tab');
  await pressTab(page, 'Shift+Tab');
  await pressTab(page, 'Shift+Tab');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(passenger).toHaveCount(0);
  await pressTab(page);
  await expect(after).toBeFocused();
  await pressTab(page, 'Shift+Tab');
  await expect(trigger).toBeFocused();
});
