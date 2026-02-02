import React from 'react';
import { render } from '@testing-library/react';
import { Flex } from './Flex';
import { FlexSpacer } from './FlexSpacer';

test('Flex sets CSS variables from props', () => {
  const { getByTestId } = render(
    <Flex
      data-testid="flex"
      direction="column"
      align="center"
      justify="space-between"
      gap="m"
    />,
  );

  const flex = getByTestId('flex');
  expect(flex).toHaveClass('eds-layout-flex');
  expect(flex.style.getPropertyValue('--flex-direction')).toBe('column');
  expect(flex.style.getPropertyValue('--flex-align-items')).toBe('center');
  expect(flex.style.getPropertyValue('--flex-justify-content')).toBe(
    'space-between',
  );
  expect(flex.style.getPropertyValue('--flex-gap')).toBe('var(--m)');
});

test('FlexSpacer renders with presentation semantics', () => {
  const { getByTestId } = render(<FlexSpacer data-testid="spacer" />);
  const spacer = getByTestId('spacer');

  expect(spacer).toHaveClass('eds-layout-flex-spacer');
  expect(spacer).toHaveAttribute('role', 'presentation');
  expect(spacer).toHaveAttribute('aria-hidden', 'true');
});
