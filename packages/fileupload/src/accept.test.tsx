import React from 'react';
import { act, render, waitFor } from '@testing-library/react';

import { FileUpload } from './';

const file = (name: string, type: string) => new File(['x'], name, { type });

const drop = async (container: HTMLElement, files: File[]) => {
  const node = container.querySelector('.eds-file-upload__input');
  const event = new Event('drop', { bubbles: true });
  Object.assign(event, {
    dataTransfer: {
      files,
      items: files.map(f => ({
        kind: 'file',
        type: f.type,
        getAsFile: () => f,
      })),
      types: ['Files'],
    },
  });
  await act(async () => {
    node?.dispatchEvent(event);
  });
};

let warn: jest.SpyInstance;
let error: jest.SpyInstance;

beforeEach(() => {
  warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  expect(warn).not.toHaveBeenCalled();
  expect(error).not.toHaveBeenCalled();
  jest.restoreAllMocks();
});

const dropWith = async (
  accept: React.ComponentProps<typeof FileUpload>['accept'],
  files: File[],
) => {
  const onDrop = jest.fn();
  const { container } = render(
    <FileUpload accept={accept} files={[]} onDrop={onDrop} multiple />,
  );
  await drop(container, files);
  await waitFor(() => expect(onDrop).toHaveBeenCalled());
  const [accepted, rejected] = onDrop.mock.calls[0];
  return {
    accepted: accepted.map((f: File) => f.name),
    rejected: rejected.map((r: { file: File }) => r.file.name),
  };
};

const png = file('a.png', 'image/png');
const pdf = file('b.pdf', 'application/pdf');

test('accepts every file when accept is left out', async () => {
  const { accepted } = await dropWith(undefined, [png, pdf]);
  expect(accepted).toEqual(['a.png', 'b.pdf']);
});

test('accepts every file when accept is an empty string', async () => {
  const { accepted } = await dropWith('', [png, pdf]);
  expect(accepted).toEqual(['a.png', 'b.pdf']);
});

test('filters on a single MIME type given as a string', async () => {
  const { accepted, rejected } = await dropWith('image/png', [png, pdf]);
  expect(accepted).toEqual(['a.png']);
  expect(rejected).toEqual(['b.pdf']);
});

test('filters on a comma separated list of MIME types', async () => {
  const { accepted, rejected } = await dropWith('image/png, image/jpeg', [
    png,
    pdf,
  ]);
  expect(accepted).toEqual(['a.png']);
  expect(rejected).toEqual(['b.pdf']);
});

test('filters on a MIME type wildcard', async () => {
  const { accepted, rejected } = await dropWith('image/*', [png, pdf]);
  expect(accepted).toEqual(['a.png']);
  expect(rejected).toEqual(['b.pdf']);
});

test('filters on a file extension', async () => {
  const { accepted, rejected } = await dropWith('.pdf', [png, pdf]);
  expect(accepted).toEqual(['b.pdf']);
  expect(rejected).toEqual(['a.png']);
});

test('filters on an array of extensions', async () => {
  const { accepted, rejected } = await dropWith(['.pdf', '.png'], [png, pdf]);
  expect(accepted).toEqual(['a.png', 'b.pdf']);
  expect(rejected).toEqual([]);
});

test('filters on extensions and MIME types mixed together', async () => {
  const { accepted, rejected } = await dropWith('.pdf, image/png', [png, pdf]);
  expect(accepted).toEqual(['a.png', 'b.pdf']);
  expect(rejected).toEqual([]);
});

test('accepts the react-dropzone map form as well', async () => {
  const { accepted, rejected } = await dropWith(
    { 'application/pdf': ['.pdf'] },
    [png, pdf],
  );
  expect(accepted).toEqual(['b.pdf']);
  expect(rejected).toEqual(['a.png']);
});

test('keeps the accept attribute free of helper MIME types', async () => {
  const { container } = render(
    <FileUpload accept=".pdf, image/png" files={[]} />,
  );
  expect(
    container.querySelector('input[type=file]')?.getAttribute('accept'),
  ).toBe('.pdf,image/png');
});

test('leaves the accept attribute off when nothing is accepted', async () => {
  const { container } = render(<FileUpload files={[]} />);
  expect(
    container.querySelector('input[type=file]')?.hasAttribute('accept'),
  ).toBe(false);
});
