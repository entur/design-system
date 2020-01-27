import React from 'react';
import { render } from '@testing-library/react';
import { SecondarySquareButton, SuccessSquareButton } from '.';

test('renders secondary square buttons', () => {
  const { getByRole } = render(
    <SecondarySquareButton>
      <svg /> Add
    </SecondarySquareButton>,
  );
  expect(getByRole('button')).toHaveClass('eds-square-button--secondary');
});

test('renders success square buttons', () => {
  const { getByRole } = render(
    <SuccessSquareButton>
      <svg /> Save
    </SuccessSquareButton>,
  );
  expect(getByRole('button')).toHaveClass('eds-square-button--success');
});
