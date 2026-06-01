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
  };
});

test('renders a nice looking modal', () => {
  const spy = jest.fn();
  const { getByTestId } = render(
    <Modal onDismiss={spy} open={true} title="title" size="large">
      <div data-testid="content">Modal content</div>
    </Modal>,
  );
  expect(getByTestId('content')).toHaveTextContent('Modal content');

  expect(spy).not.toHaveBeenCalled();
  fireEvent.keyDown(getByTestId('content'), { key: 'Escape' });
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
