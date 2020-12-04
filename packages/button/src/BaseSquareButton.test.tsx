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

test('Button renders as an <a> tag, with an href-property', () => {
  let children = 'Button children';
  const hrefLink = '#coolLinkAddresss';
  const { getByTestId } = render(
    <SecondarySquareButton as="a" href={hrefLink} data-testid="testerButton2">
      {children}
    </SecondarySquareButton>,
  );
  const testerButton = getByTestId('testerButton2');

  expect(testerButton.nodeName).toBe('A');
  expect(testerButton).toHaveAttribute('href', hrefLink);
});
