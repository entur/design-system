import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import copy from 'copy-text-to-clipboard';

import { CopyableText } from './CopyableText';
import { ToastProvider } from './ToastProvider';
import { describeComponentContract } from '../../../tests/jest/componentContract';

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

test.each([
  ['small', 'medium'],
  ['medium', 'small'],
] as const)(
  'applies %s size modifier classes to the wrapper and copy button',
  (size, otherSize) => {
    const { container } = renderCopyableText(
      <CopyableText size={size}>#181c56</CopyableText>,
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass(`eds-copyable-text--size-${size}`);
    expect(root).not.toHaveClass(`eds-copyable-text--size-${otherSize}`);
    expect(
      screen.getByRole('button', { name: 'Kopier #181c56 til utklippstavlen' }),
    ).toHaveClass(`eds-icon-button--size-${size}`);
  },
);

test('defaults to the medium size', () => {
  const { container } = renderCopyableText(
    <CopyableText>#181c56</CopyableText>,
  );
  expect(container.firstElementChild).toHaveClass(
    'eds-copyable-text--size-medium',
  );
});

test('copies text and shows toast when the copyable area is clicked', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  renderCopyableText(
    <CopyableText onClick={onClick}>npm install @entur/alert</CopyableText>,
  );

  await user.click(screen.getByText('npm install @entur/alert'));

  expect(onClick).toHaveBeenCalledTimes(1);
  expect(mockCopy).toHaveBeenCalledTimes(1);
  expect(mockCopy).toHaveBeenCalledWith('npm install @entur/alert', {
    target: expect.any(HTMLButtonElement),
  });
  expect(screen.getByRole('status')).toHaveTextContent('Kopiert!');
  expect(screen.getByRole('status')).toHaveTextContent(
    'npm install @entur/alert ble kopiert til utklippstavlen.',
  );
});

test('copies text and shows toast when the copy button is clicked', async () => {
  const user = userEvent.setup();
  renderCopyableText(<CopyableText>#181c56</CopyableText>);

  await user.click(
    screen.getByRole('button', { name: 'Kopier #181c56 til utklippstavlen' }),
  );

  expect(mockCopy).toHaveBeenCalledWith('#181c56', {
    target: expect.any(HTMLButtonElement),
  });
  expect(screen.getByRole('status')).toBeInTheDocument();
});

test('copies from the small copy button with the keyboard without moving focus', async () => {
  const user = userEvent.setup();
  renderCopyableText(<CopyableText size="small">#181c56</CopyableText>);
  const button = screen.getByRole('button', {
    name: 'Kopier #181c56 til utklippstavlen',
  });

  await user.tab();
  expect(button).toHaveFocus();
  await user.keyboard('{Enter}');

  expect(mockCopy).toHaveBeenCalledTimes(1);
  expect(mockCopy).toHaveBeenCalledWith('#181c56', { target: button });
  expect(screen.getByRole('status')).toHaveTextContent(
    '#181c56 ble kopiert til utklippstavlen.',
  );
  expect(button).toHaveFocus();
});

test('copies textToCopy instead of children when provided', async () => {
  const user = userEvent.setup();
  renderCopyableText(
    <CopyableText textToCopy="secret-value">visible</CopyableText>,
  );

  await user.click(screen.getByText('visible'));

  expect(mockCopy).toHaveBeenCalledWith('secret-value', {
    target: expect.any(HTMLButtonElement),
  });
  expect(screen.getByRole('status')).toHaveTextContent(
    'secret-value ble kopiert til utklippstavlen.',
  );
});

test('uses custom toast messages when provided', async () => {
  const user = userEvent.setup();
  renderCopyableText(
    <CopyableText
      successHeading="Kommando kopiert!"
      successMessage="Lim den inn i terminalen."
    >
      npm install @entur/alert
    </CopyableText>,
  );

  await user.click(screen.getByText('npm install @entur/alert'));

  const toast = screen.getByRole('status');
  expect(toast).toHaveTextContent('Kommando kopiert!');
  expect(toast).toHaveTextContent('Lim den inn i terminalen.');
});

test('does not show toast when copy fails', async () => {
  const user = userEvent.setup();
  mockCopy.mockReturnValue(false);

  renderCopyableText(<CopyableText>#181c56</CopyableText>);

  await user.click(screen.getByText('#181c56'));

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

describeComponentContract('CopyableText', {
  render: props => (
    <ToastProvider>
      <CopyableText {...props}>#181c56</CopyableText>
    </ToastProvider>
  ),
  getElement: ({ container }) => container.firstElementChild as HTMLElement,
  baseClassName: 'eds-copyable-text',
});
