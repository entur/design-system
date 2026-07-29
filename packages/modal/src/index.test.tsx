import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { fireEvent, render } from '@testing-library/react';
import { Modal } from '.';

// Polyfill <dialog> methods for jsdom
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

test('renders a nice looking modal', () => {
  const spy = jest.fn();
  const { getByTestId, baseElement } = render(
    <Modal onDismiss={spy} open={true} title="title" size="large">
      <div data-testid="content">Modal content</div>
    </Modal>,
  );
  expect(getByTestId('content')).toHaveTextContent('Modal content');

  expect(spy).not.toHaveBeenCalled();
  const dialog = baseElement.querySelector('dialog');
  dialog?.dispatchEvent(new Event('cancel', { cancelable: true }));
  expect(spy).toHaveBeenCalled();
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

  act(() => {
    hydrateRoot(
      container,
      <div>
        <p>server content</p>
        <Modal onDismiss={jest.fn()} open={false} title="title" size="large">
          Modal content
        </Modal>
      </div>,
    );
  });
  consoleSpy.mockRestore();

  expect(errors.filter(error => /hydrat|did not match/i.test(error))).toEqual(
    [],
  );
  // The portal still lands once mounted
  expect(document.body.querySelector('dialog')).toBeInTheDocument();
});

test('can be closed by clicking the close button', () => {
  const spy = jest.fn();
  const { getByLabelText } = render(
    <Modal onDismiss={spy} open={true} title="title" size="large">
      <div data-testid="content">Modal content</div>
    </Modal>,
  );

  fireEvent.click(getByLabelText('Lukk'));
  expect(spy).toHaveBeenCalled();
});
