import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import copy from 'copy-text-to-clipboard';

import { CopyableText } from './CopyableText';
import { ToastProvider } from './ToastProvider';

jest.mock('copy-text-to-clipboard', () => jest.fn(() => true));

const mockCopy = copy as jest.MockedFunction<typeof copy>;

const renderCopyableText = (
  ui: React.ReactElement,
  options?: Parameters<typeof render>[1],
) =>
  render(ui, {
    wrapper: ({ children }) => <ToastProvider>{children}</ToastProvider>,
    ...options,
  });

beforeEach(() => {
  mockCopy.mockClear();
  mockCopy.mockReturnValue(true);
});

test('applies small size modifier classes when size is small', () => {
  const { container } = renderCopyableText(
    <CopyableText size="small">#181c56</CopyableText>,
  );

  const root = container.querySelector('.eds-copyable-text');
  expect(root).toHaveClass('eds-copyable-text--size-small');
  expect(root).not.toHaveClass('eds-copyable-text--size-medium');

  expect(container.querySelector('.eds-copyable-text__button')).toHaveClass(
    'eds-icon-button--size-small',
  );
});

test('applies medium size modifier class by default', () => {
  const { container } = renderCopyableText(
    <CopyableText>#181c56</CopyableText>,
  );

  const root = container.querySelector('.eds-copyable-text');
  expect(root).toHaveClass('eds-copyable-text--size-medium');
  expect(root).not.toHaveClass('eds-copyable-text--size-small');

  expect(container.querySelector('.eds-copyable-text__button')).toHaveClass(
    'eds-icon-button--size-medium',
  );
});

test('copies text and shows toast when the copyable area is clicked', () => {
  renderCopyableText(<CopyableText>npm install @entur/alert</CopyableText>);

  fireEvent.click(screen.getByText('npm install @entur/alert'));

  expect(mockCopy).toHaveBeenCalledWith('npm install @entur/alert', {
    target: expect.any(HTMLButtonElement),
  });
  expect(screen.getByRole('status')).toHaveTextContent('Kopiert!');
  expect(screen.getByRole('status')).toHaveTextContent(
    'npm install @entur/alert ble kopiert til utklippstavlen.',
  );
});

test('copies text and shows toast when the copy button is clicked', () => {
  renderCopyableText(<CopyableText>#181c56</CopyableText>);

  fireEvent.click(
    screen.getByRole('button', { name: 'Kopier #181c56 til utklippstavlen' }),
  );

  expect(mockCopy).toHaveBeenCalledWith('#181c56', {
    target: expect.any(HTMLButtonElement),
  });
  expect(screen.getByRole('status')).toBeInTheDocument();
});

test('copies textToCopy instead of children when provided', () => {
  renderCopyableText(
    <CopyableText textToCopy="secret-value">visible</CopyableText>,
  );

  fireEvent.click(screen.getByText('visible'));

  expect(mockCopy).toHaveBeenCalledWith('secret-value', {
    target: expect.any(HTMLButtonElement),
  });
});

test('uses custom toast messages when provided', () => {
  renderCopyableText(
    <CopyableText
      successHeading="Kommando kopiert!"
      successMessage="Lim den inn i terminalen."
    >
      npm install @entur/alert
    </CopyableText>,
  );

  fireEvent.click(screen.getByText('npm install @entur/alert'));

  const toast = screen.getByRole('status');
  expect(toast).toHaveTextContent('Kommando kopiert!');
  expect(toast).toHaveTextContent('Lim den inn i terminalen.');
});

test('calls onClick when provided', () => {
  const onClick = jest.fn();
  renderCopyableText(<CopyableText onClick={onClick}>#181c56</CopyableText>);

  fireEvent.click(screen.getByText('#181c56'));

  expect(onClick).toHaveBeenCalledTimes(1);
});

test('does not show toast when copy fails', () => {
  mockCopy.mockReturnValue(false);

  renderCopyableText(<CopyableText>#181c56</CopyableText>);

  fireEvent.click(screen.getByText('#181c56'));

  expect(mockCopy).toHaveBeenCalled();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('throws when used outside ToastProvider', () => {
  const consoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  expect(() => render(<CopyableText>#181c56</CopyableText>)).toThrow(
    /ToastProvider/,
  );

  consoleError.mockRestore();
});
