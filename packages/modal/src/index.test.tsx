import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Modal } from '.';

// Needed to silence Reach's styling warning
jest.mock('@reach/utils', () => ({
  ...(jest.requireActual('@reach/utils') as object),
  checkStyles: jest.fn(),
}));

test('renders a nice looking modal', () => {
  const spy = jest.fn();
  const { getByTestId } = render(
    <Modal onDismiss={spy} open={true} title="title" size="large">
      <div data-testid="content">Modal content</div>
    </Modal>,
  );
  expect(getByTestId('content')).toHaveTextContent('Modal content');

  expect(spy);
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
