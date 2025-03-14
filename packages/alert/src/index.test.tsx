import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BannerAlertBox, ToastAlertBox, SmallAlertBox } from '.';

test('renders banner alert boxes', () => {
  const { getByText } = render(
    <BannerAlertBox variant="success" title="A title">
      Some content
    </BannerAlertBox>,
  );
  expect(getByText('A title')).toBeInTheDocument();
  expect(getByText('Some content')).toBeInTheDocument();
});

test('renders toast alert boxes', () => {
  const { getByText } = render(
    <ToastAlertBox variant="success" title="A title">
      Some content
    </ToastAlertBox>,
  );
  expect(getByText('A title')).toBeInTheDocument();
  expect(getByText('Some content')).toBeInTheDocument();
});

test('renders small alert boxes', () => {
  const { getByText } = render(
    <SmallAlertBox variant="success">Some content</SmallAlertBox>,
  );
  expect(getByText('Some content')).toBeInTheDocument();
});

test('renders a close button when closable is true', () => {
  const spy = jest.fn();
  const { queryByLabelText, getByLabelText } = render(
    <ToastAlertBox
      variant="success"
      onClose={spy}
      closable={true}
      closeButtonLabel="Click to close"
    >
      Everything went well
    </ToastAlertBox>,
  );

  expect(getByLabelText('Click to close')).toBeInTheDocument();
  fireEvent.click(getByLabelText('Click to close'));
  expect(spy).toHaveBeenCalled();
  expect(queryByLabelText('Click to close')).not.toBeInTheDocument();
});
