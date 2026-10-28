import { act, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, ModalContent, ModalOverlay } from '.';
import { installDialogPolyfill } from '../../../tests/jest/dialogPolyfill';
import { describeComponentContract } from '../../../tests/jest/componentContract';

installDialogPolyfill();

test.each(['mouse', 'Enter', 'native cancel'] as const)(
  'closes a controlled modal through %s and can reopen it',
  async dismissal => {
    const user = userEvent.setup();
    const onDismiss = jest.fn();
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Edit journey</button>
          <Modal
            open={open}
            onDismiss={() => {
              onDismiss();
              setOpen(false);
            }}
            title="Edit journey"
            closeLabel="Cancel editing"
            size="medium"
          >
            <button>Save journey</button>
          </Modal>
        </>
      );
    }
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Edit journey' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Edit journey' });
    expect(
      within(dialog).getByRole('heading', { name: 'Edit journey' }),
    ).toHaveFocus();
    const closeButton = within(dialog).getByRole('button', {
      name: 'Cancel editing',
    });
    expect(onDismiss).not.toHaveBeenCalled();

    if (dismissal === 'mouse') {
      await user.click(closeButton);
    } else if (dismissal === 'Enter') {
      await user.tab({ shift: true });
      expect(closeButton).toHaveFocus();
      await user.keyboard('{Enter}');
    } else {
      // jsdom does not fire the native cancel event on Escape, so dispatch it directly.
      const cancel = new Event('cancel', { cancelable: true });
      fireEvent(dialog, cancel);
      expect(cancel.defaultPrevented).toBe(true);
    }

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Save journey' }),
    ).not.toBeInTheDocument();
    await user.click(trigger);
    expect(
      screen.getByRole('dialog', { name: 'Edit journey' }),
    ).toBeInTheDocument();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  },
);

test('dismissal requests leave visibility under consumer control', async () => {
  const user = userEvent.setup();
  const onDismiss = jest.fn();
  const { rerender } = render(
    <Modal onDismiss={onDismiss} open title="Journey" size="medium">
      <button>Save</button>
    </Modal>,
  );
  const dialog = screen.getByRole('dialog', { name: 'Journey' });
  await user.click(screen.getByRole('button', { name: 'Lukk' }));
  expect(onDismiss).toHaveBeenCalledTimes(1);
  expect(dialog).toBeVisible();
  rerender(
    <Modal onDismiss={onDismiss} open={false} title="Journey" size="medium">
      <button>Save</button>
    </Modal>,
  );
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
  expect(onDismiss).toHaveBeenCalledTimes(1);
});

test.each([true, false])(
  'only requests backdrop dismissal when closeOnClickOutside is %s',
  async closeOnClickOutside => {
    const user = userEvent.setup();
    const onDismiss = jest.fn();
    render(
      <Modal
        onDismiss={onDismiss}
        open
        title="Journey"
        size="medium"
        closeOnClickOutside={closeOnClickOutside}
        showCloseButton={false}
      >
        <button>Save</button>
      </Modal>,
    );
    expect(
      screen.queryByRole('button', { name: 'Lukk' }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(screen.getByRole('heading', { name: 'Journey' }));
    expect(onDismiss).not.toHaveBeenCalled();
    const dialog = screen.getByRole('dialog', { name: 'Journey' });
    await user.click(dialog);
    expect(onDismiss).toHaveBeenCalledTimes(closeOnClickOutside ? 1 : 0);

    // jsdom does not fire the native cancel event on Escape, so dispatch it directly.

    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(onDismiss).toHaveBeenCalledTimes(closeOnClickOutside ? 2 : 1);
  },
);

test('focuses the requested field instead of the title and accepts keyboard input', async () => {
  const user = userEvent.setup();
  const initialFocusRef = createRef<HTMLInputElement>();
  render(
    <Modal
      onDismiss={jest.fn()}
      open
      title="Journey"
      size="medium"
      initialFocusRef={initialFocusRef}
      aria-label="Fallback name"
    >
      <label>
        Destination
        <input ref={initialFocusRef} />
      </label>
    </Modal>,
  );
  expect(screen.getByRole('dialog', { name: 'Journey' })).toBeInTheDocument();
  const input = screen.getByRole('textbox', { name: 'Destination' });
  expect(input).toHaveFocus();
  await user.keyboard('Oslo');
  expect(input).toHaveValue('Oslo');
});

test('uses an accessible label when no title is supplied', () => {
  render(
    <Modal onDismiss={jest.fn()} open aria-label="Journey" size="medium">
      <button>Save</button>
    </Modal>,
  );
  expect(screen.getByRole('dialog', { name: 'Journey' })).toBeInTheDocument();
});

// Bug: Modal forwards aria-describedby to ModalContent instead of the dialog.
test.failing('exposes aria-describedby on the modal dialog', () => {
  render(
    <Modal
      onDismiss={jest.fn()}
      open
      title="Delete journey"
      size="medium"
      aria-describedby="delete-description"
    >
      <p id="delete-description">This cannot be undone.</p>
    </Modal>,
  );
  expect(
    screen.getByRole('dialog', { name: 'Delete journey' }),
  ).toHaveAccessibleDescription('This cannot be undone.');
});

test('composes labelled and described content with overlay dismissal', async () => {
  const user = userEvent.setup();
  const onDismiss = jest.fn();
  function Example() {
    const [open, setOpen] = useState(true);
    return (
      <ModalOverlay
        open={open}
        onDismiss={() => {
          onDismiss();
          setOpen(false);
        }}
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-description"
      >
        <ModalContent size="small">
          <h2 id="confirmation-title" tabIndex={-1} data-autofocus="">
            Confirm journey
          </h2>
          <p id="confirmation-description">Check your destination.</p>
          <button>Confirm</button>
        </ModalContent>
      </ModalOverlay>
    );
  }
  const { container } = render(<Example />);
  const dialog = screen.getByRole('dialog', { name: 'Confirm journey' });
  expect(container).not.toContainElement(dialog);
  expect(dialog).toHaveAccessibleDescription('Check your destination.');
  expect(
    screen.getByRole('heading', { name: 'Confirm journey' }),
  ).toHaveFocus();
  await user.click(screen.getByRole('button', { name: 'Confirm' }));
  expect(onDismiss).not.toHaveBeenCalled();
  await user.click(dialog);
  expect(onDismiss).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('hydrates without mismatch when the server rendered no dialog', () => {
  const errors: string[] = [];
  const consoleSpy = jest
    .spyOn(console, 'error')
    .mockImplementation((...args) => {
      errors.push(args.map(String).join(' '));
    });

  const container = document.createElement('div');
  container.innerHTML = '<div><p>server content</p></div>';
  document.body.appendChild(container);

  let root: ReturnType<typeof hydrateRoot> | undefined;
  try {
    act(() => {
      root = hydrateRoot(
        container,
        <div>
          <p>server content</p>
          <Modal onDismiss={jest.fn()} open={false} title="title" size="large">
            Modal content
          </Modal>
        </div>,
      );
    });
    expect(errors.filter(error => /hydrat|did not match/i.test(error))).toEqual(
      [],
    );
    expect(document.body.querySelector('dialog')).toBeInTheDocument();
  } finally {
    act(() => root?.unmount());
    container.remove();
    consoleSpy.mockRestore();
  }
});

describeComponentContract('Modal', {
  render: props => (
    <Modal onDismiss={jest.fn()} open title="Journey" size="medium" {...props}>
      Content
    </Modal>
  ),
  getElement: () =>
    screen.getByRole('heading', { name: 'Journey' }).parentElement!,
  baseClassName: 'eds-modal__content',
});

test.each([
  ['small', 'center'],
  ['large', 'end'],
] as const)('applies size %s and align %s modifier classes', (size, align) => {
  render(
    <Modal onDismiss={jest.fn()} open title="Journey" size={size} align={align}>
      Content
    </Modal>,
  );
  const dialog = screen.getByRole('dialog', { name: 'Journey' });
  expect(dialog).toHaveClass(`eds-modal__overlay--size-${size}`);
  expect(
    screen.getByRole('heading', { name: 'Journey' }).parentElement,
  ).toHaveClass(
    `eds-modal__content--size-${size}`,
    `eds-modal__content--align-${align}`,
  );
});

describeComponentContract('ModalContent', {
  render: props => (
    <ModalContent size="small" {...props}>
      Content
    </ModalContent>
  ),
  getElement: () => screen.getByText('Content'),
  baseClassName: 'eds-modal__content',
});

test('ModalOverlay merges a consumer className on the dialog', () => {
  render(
    <ModalOverlay open aria-label="Journey" className="consumer-class">
      <button>Save</button>
    </ModalOverlay>,
  );
  expect(screen.getByRole('dialog', { name: 'Journey' })).toHaveClass(
    'eds-modal__overlay',
    'consumer-class',
  );
});
