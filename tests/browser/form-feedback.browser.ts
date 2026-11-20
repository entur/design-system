import { type Locator, type Page, expect, test } from '@playwright/test';

// Reads the description from Chromium's accessibility tree, not Playwright's
async function chromiumDescription(page: Page, locator: Locator) {
  await locator.evaluate(element => element.setAttribute('data-ax', ''));
  const cdp = await page.context().newCDPSession(page);
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeId } = await cdp.send('DOM.querySelector', {
    nodeId: root.nodeId,
    selector: '[data-ax]',
  });
  const { nodes } = await cdp.send('Accessibility.getPartialAXTree', {
    nodeId,
    fetchRelatives: false,
  });
  await locator.evaluate(element => element.removeAttribute('data-ax'));
  return nodes[0].description?.value;
}

test('form fields are described by their feedback text', async ({ page }) => {
  await page.goto('/form-feedback.html');
  const name = page.getByRole('textbox', { name: 'Name' });
  const city = page.getByRole('combobox', { name: /^City/ });
  await expect(name).toHaveAccessibleDescription('Enter a name');
  await expect(city).toHaveAccessibleDescription('Choose a city');

  if (test.info().project.name === 'chromium') {
    expect(await chromiumDescription(page, name)).toBe('Enter a name');
    expect(await chromiumDescription(page, city)).toBe('Choose a city');
  }
});

test('DatePicker describes only its first segment with the feedback text', async ({
  page,
}) => {
  await page.goto('/form-feedback.html');
  const segments = page.getByRole('spinbutton');
  await expect(segments.first()).toHaveAccessibleDescription(/Choose a date/);
  for (const segment of (await segments.all()).slice(1)) {
    await expect(segment).not.toHaveAccessibleDescription(/Choose a date/);
  }
});

test('read-only checkbox ignores clicks on its label and Space', async ({
  page,
}) => {
  await page.goto('/form-feedback.html');
  const checkbox = page.getByRole('checkbox', { name: 'Read-only option' });
  await page.getByText('Read-only option').click();
  await expect(checkbox).toBeChecked();
  await checkbox.focus();
  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
});
