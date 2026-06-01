import React from 'react';
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
