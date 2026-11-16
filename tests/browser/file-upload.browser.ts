import { expect, test } from '@playwright/test';

const textFile = (name: string) => ({
  name,
  mimeType: 'text/plain',
  buffer: Buffer.from(name),
});

test('announces every upload and returns focus after the last file is removed', async ({
  page,
}) => {
  await page.goto('/file-upload.html');
  const input = page.locator('input[type="file"]');
  const status = page.getByRole('status');

  await input.setInputFiles(textFile('first.txt'));
  await expect(status).toHaveText('Opplasting fullført: first.txt');
  await input.setInputFiles(textFile('second.txt'));
  await expect(status).toHaveText('Opplasting fullført: second.txt');

  for (const name of ['first.txt', 'second.txt']) {
    await page.getByRole('button', { name: new RegExp(name) }).focus();
    await page.keyboard.press('Enter');
  }
  await expect(page.getByRole('button', { name: /^Attachment/ })).toBeFocused();
});
