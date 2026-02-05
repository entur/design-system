import React from 'react';
import { render } from '@testing-library/react';
import { Grid } from './Grid';
import { GridItem } from './GridItem';

test('Grid sets CSS variables from props', () => {
  const { getByTestId } = render(
    <Grid
      data-testid="grid"
      templateColumns="200px 1fr"
      gap="s"
      columnGap="none"
      height="100%"
    />,
  );

  const grid = getByTestId('grid');
  expect(grid).toHaveClass('eds-layout-grid');
  expect(grid.style.getPropertyValue('--grid-template-columns')).toBe(
    '200px 1fr',
  );
  expect(grid.style.getPropertyValue('--grid-gap')).toBe('var(--s)');
  expect(grid.style.getPropertyValue('--grid-column-gap')).toBe('0');
  expect(grid.style.getPropertyValue('--grid-height')).toBe('100%');
});

test('Grid sets align and justify CSS variables from props', () => {
  const { getByTestId } = render(
    <Grid
      data-testid="grid"
      align="center"
      justify="space-between"
      alignContent="end"
    />,
  );

  const grid = getByTestId('grid');
  expect(grid.style.getPropertyValue('--grid-align-items')).toBe('center');
  expect(grid.style.getPropertyValue('--grid-justify-content')).toBe(
    'space-between',
  );
  expect(grid.style.getPropertyValue('--grid-align-content')).toBe('end');
});

test('GridItem formats colSpan and rowSpan values', () => {
  const { getByTestId } = render(
    <GridItem data-testid="item" colSpan={3} rowSpan="2 / 3" />,
  );

  const item = getByTestId('item');
  expect(item).toHaveClass('eds-layout-grid-item');
  expect(item.style.getPropertyValue('--grid-item-column')).toBe('span 3');
  expect(item.style.getPropertyValue('--grid-item-row')).toBe('2 / 3');
});
