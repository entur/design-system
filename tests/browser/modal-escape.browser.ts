import { type Locator, type Page, expect, test } from '@playwright/test';

async function openModal(page: Page) {
  await page.goto('/modal-escape.html');
  await page.getByRole('button', { name: 'Open modal' }).click();
  const dialog = page.getByRole('dialog', { name: 'Journey' });
  await expect(dialog).toBeVisible();
  return dialog;
}

const cases: {
  name: string;
  open: (dialog: Locator, page: Page) => Promise<void>;
  isOpen: (dialog: Locator, page: Page) => Locator;
}[] = [
  {
    name: 'Dropdown',
    open: async dialog => {
      await dialog.getByRole('combobox', { name: 'City', exact: true }).click();
    },
    isOpen: dialog => dialog.getByRole('option', { name: 'Oslo' }),
  },
  {
    name: 'SearchableDropdown',
    open: async dialog => {
      await dialog.getByRole('combobox', { name: 'Search city' }).click();
    },
    isOpen: dialog => dialog.getByRole('option', { name: 'Bergen' }),
  },
  {
    name: 'DatePicker',
    open: async (dialog, page) => {
      await dialog.getByRole('spinbutton').first().click();
      await page.keyboard.press('Alt+ArrowDown');
    },
    isOpen: dialog => dialog.getByRole('grid'),
  },
  {
    name: 'OverflowMenu',
    open: async dialog => {
      await dialog.getByRole('button', { name: 'Actions' }).click();
    },
    isOpen: (_, page) => page.getByRole('menu'),
  },
  {
    name: 'Popover',
    open: async dialog => {
      await dialog.getByRole('button', { name: 'Options' }).click();
      await dialog.getByRole('textbox', { name: 'Note' }).click();
    },
    isOpen: dialog => dialog.getByRole('textbox', { name: 'Note' }),
  },
  {
    name: 'Popover with focus on its trigger',
    open: async dialog => {
      await dialog.getByRole('button', { name: 'Options' }).click();
    },
    isOpen: dialog => dialog.getByRole('textbox', { name: 'Note' }),
  },
  {
    name: 'Drawer',
    open: async dialog => {
      await dialog.getByRole('button', { name: 'Open drawer' }).click();
    },
    isOpen: dialog => dialog.getByRole('dialog', { name: 'Details' }),
  },
  {
    name: 'Tooltip',
    open: async dialog => {
      await dialog.getByRole('button', { name: 'Save' }).focus();
    },
    isOpen: (_, page) => page.getByRole('tooltip'),
  },
];

for (const { name, open, isOpen } of cases) {
  test(`Escape closes an open ${name} first, then the modal`, async ({
    page,
  }) => {
    const dialog = await openModal(page);
    await open(dialog, page);
    await expect(isOpen(dialog, page)).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(isOpen(dialog, page)).toBeHidden();
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
}

test('Escape on a closed Dropdown closes the modal', async ({ page }) => {
  const dialog = await openModal(page);
  await dialog.getByRole('combobox', { name: 'City', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('Escape on a closed OverflowMenu trigger closes the modal', async ({
  page,
}) => {
  const dialog = await openModal(page);
  await dialog.getByRole('button', { name: 'Actions' }).focus();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('Escape clears a clearable Dropdown first, then closes the modal', async ({
  page,
}) => {
  const dialog = await openModal(page);
  const combobox = dialog.getByRole('combobox', { name: 'Home city' });
  await expect(combobox).toContainText('Oslo');
  await combobox.focus();

  await page.keyboard.press('Escape');
  await expect(combobox).not.toContainText('Oslo');
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

for (const { name, open, isOpen } of [
  {
    name: 'Popover',
    // Keyboard, since Safari moves focus out of the drawer on click
    open: (drawer: Locator) =>
      drawer.getByRole('button', { name: 'Drawer options' }).press('Enter'),
    isOpen: (drawer: Locator) =>
      drawer.getByRole('textbox', { name: 'Drawer note' }),
  },
  {
    name: 'OverflowMenu',
    open: (drawer: Locator) =>
      drawer.getByRole('button', { name: 'Drawer actions' }).press('Enter'),
    isOpen: (_: Locator, page: Page) =>
      page.getByRole('menuitem', { name: 'Share' }),
  },
]) {
  test(`Escape closes a ${name} in a Drawer, then the Drawer, then the modal`, async ({
    page,
  }) => {
    const dialog = await openModal(page);
    await dialog.getByRole('button', { name: 'Open drawer' }).click();
    const drawer = dialog.getByRole('dialog', { name: 'Details' });
    await open(drawer);
    await expect(isOpen(drawer, page)).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(isOpen(drawer, page)).toBeHidden();
    await expect(drawer).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
}

test('Escape closes a Dropdown in a Popover, then the Popover, then the modal', async ({
  page,
}) => {
  const dialog = await openModal(page);
  await dialog.getByRole('button', { name: 'Options' }).click();
  const combobox = dialog.getByRole('combobox', { name: 'Popover city' });
  await combobox.click();
  await expect(combobox).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Escape');
  await expect(combobox).toHaveAttribute('aria-expanded', 'false');
  await expect(dialog.getByRole('textbox', { name: 'Note' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog.getByRole('textbox', { name: 'Note' })).toBeHidden();
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

for (const field of ['segmented control', 'SearchableDropdown with a value']) {
  test(`Escape on a ${field} in a Drawer closes the Drawer`, async ({
    page,
  }) => {
    const dialog = await openModal(page);
    await dialog.getByRole('button', { name: 'Open drawer' }).click();
    const drawer = dialog.getByRole('dialog', { name: 'Details' });
    const target =
      field === 'segmented control'
        ? drawer.getByRole('radio', { name: 'Light' })
        : drawer.getByRole('combobox', { name: 'Drawer city' });
    await target.focus();

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(dialog).toBeVisible();
  });
}
