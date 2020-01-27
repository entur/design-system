import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Drawer } from '.';

test('renders a drawer that closes when it should', () => {
  const spy = jest.fn();
  const { getByText } = render(
    <Drawer title="En skuff" onDismiss={spy} open={true}>
      Innholdet i skuffen
    </Drawer>,
  );

  expect(spy).not.toHaveBeenCalled();
  fireEvent.keyDown(getByText('En skuff'), { key: 'Escape' });
  expect(spy).toHaveBeenCalled();
});

test('does not render anything when open = false', () => {
  const { queryByText, rerender } = render(
    <Drawer title="En skuff" onDismiss={() => {}} open={true}>
      Innholdet i skuffen
    </Drawer>,
  );

  expect(queryByText('Innholdet i skuffen')).toBeInTheDocument();

  rerender(
    <Drawer title="En skuff" onDismiss={() => {}} open={false}>
      Innholdet i skuffen
    </Drawer>,
  );
  expect(queryByText('Innholdet i skuffen')).not.toBeInTheDocument();
});
