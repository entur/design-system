import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import { describeComponentContract } from '../../../../../tests/jest/componentContract';
import { Grid } from './Grid';
import { GridItem } from './GridItem';

describeComponentContract('Grid', {
  render: props => <Grid data-testid="grid" {...props} />,
  getElement: () => screen.getByTestId('grid'),
  baseClassName: 'eds-layout-grid',
  refElement: HTMLDivElement,
  as: 'section',
});

describeComponentContract('GridItem', {
  render: props => <GridItem data-testid="item" {...props} />,
  getElement: () => screen.getByTestId('item'),
  baseClassName: 'eds-layout-grid-item',
  refElement: HTMLDivElement,
  as: 'li',
});

test('Grid defaults gap to m for rows and columns', () => {
  const { getByTestId } = render(<Grid data-testid="grid" />);
  const el = getByTestId('grid');
  expect(el.style.getPropertyValue('--grid-gap-base')).toBe('var(--m)');
  expect(el.style.getPropertyValue('--grid-row-gap-base')).toBe('var(--m)');
  expect(el.style.getPropertyValue('--grid-column-gap-base')).toBe('var(--m)');
});

test('Grid keeps consumer style alongside its CSS vars', () => {
  const { getByTestId } = render(
    <Grid data-testid="grid" gap="s" style={{ marginTop: '7px' }} />,
  );
  const el = getByTestId('grid');
  expect(el).toHaveStyle({ marginTop: '7px' });
  expect(el.style.getPropertyValue('--grid-gap-base')).toBe('var(--s)');
});

test('Grid sets plain templateColumns at base only', () => {
  const { getByTestId } = render(
    <Grid data-testid="grid" templateColumns="200px 1fr" />,
  );
  const el = getByTestId('grid');
  expect(el.style.getPropertyValue('--grid-template-columns-base')).toBe(
    '200px 1fr',
  );
  expect(el.style.getPropertyValue('--grid-template-columns-m')).toBe('');
});

test('Grid sets responsive templateColumns for explicit breakpoints', () => {
  const { getByTestId } = render(
    <Grid
      data-testid="grid"
      templateColumns={{
        base: '1fr',
        m: 'repeat(6, 1fr)',
        lg: 'repeat(12, 1fr)',
      }}
    />,
  );
  const el = getByTestId('grid');
  expect(el.style.getPropertyValue('--grid-template-columns-base')).toBe('1fr');
  expect(el.style.getPropertyValue('--grid-template-columns-m')).toBe(
    'repeat(6, 1fr)',
  );
  expect(el.style.getPropertyValue('--grid-template-columns-lg')).toBe(
    'repeat(12, 1fr)',
  );
  expect(el.style.getPropertyValue('--grid-template-columns-xl')).toBe('');
});

test('Grid sets responsive gap as spacing vars for explicit breakpoints', () => {
  const { getByTestId } = render(
    <Grid data-testid="grid" gap={{ base: 'xs', m: 'm' }} />,
  );
  const el = getByTestId('grid');
  expect(el.style.getPropertyValue('--grid-gap-base')).toBe('var(--xs)');
  expect(el.style.getPropertyValue('--grid-gap-m')).toBe('var(--m)');
  expect(el.style.getPropertyValue('--grid-gap-lg')).toBe('');
});

test('Grid sets responsive templateColumns for s breakpoint', () => {
  const { getByTestId } = render(
    <Grid
      data-testid="grid"
      templateColumns={{
        base: '1fr',
        s: 'repeat(6, 1fr)',
        lg: 'repeat(12, 1fr)',
      }}
    />,
  );
  const el = getByTestId('grid');
  expect(el.style.getPropertyValue('--grid-template-columns-base')).toBe('1fr');
  expect(el.style.getPropertyValue('--grid-template-columns-s')).toBe(
    'repeat(6, 1fr)',
  );
  expect(el.style.getPropertyValue('--grid-template-columns-m')).toBe('');
  expect(el.style.getPropertyValue('--grid-template-columns-lg')).toBe(
    'repeat(12, 1fr)',
  );
});

test('Grid sets minHeight and maxHeight as CSS vars', () => {
  const { getByTestId } = render(
    <Grid
      data-testid="grid"
      minHeight="200px"
      maxHeight={{ base: '400px', lg: '600px' }}
    />,
  );
  const el = getByTestId('grid');
  expect(el.style.getPropertyValue('--grid-min-height-base')).toBe('200px');
  expect(el.style.getPropertyValue('--grid-max-height-base')).toBe('400px');
  expect(el.style.getPropertyValue('--grid-max-height-lg')).toBe('600px');
});

test('Grid sets rowGap as CSS var', () => {
  const { getByTestId } = render(<Grid data-testid="grid" rowGap="s" />);
  const el = getByTestId('grid');
  expect(el.style.getPropertyValue('--grid-row-gap-base')).toBe('var(--s)');
  expect(el.style.rowGap).toBe('');
});

test('Grid sets align, justify, justifyItems, alignContent', () => {
  const { getByTestId } = render(
    <Grid
      data-testid="grid"
      align="center"
      justify="space-between"
      alignContent="end"
      justifyItems="start"
    />,
  );
  const el = getByTestId('grid');
  expect(el.style.getPropertyValue('--grid-align-items-base')).toBe('center');
  expect(el.style.getPropertyValue('--grid-justify-content-base')).toBe(
    'space-between',
  );
  expect(el.style.getPropertyValue('--grid-align-content-base')).toBe('end');
  expect(el.style.getPropertyValue('--grid-justify-items-base')).toBe('start');
});

test('GridItem sets plain colSpan as col-start at base only', () => {
  const { getByTestId } = render(<GridItem data-testid="item" colSpan={6} />);
  const el = getByTestId('item');
  expect(el.style.getPropertyValue('--grid-item-col-start-base')).toBe(
    'span 6',
  );
  expect(el.style.getPropertyValue('--grid-item-col-start-m')).toBe('');
});

test('GridItem sets responsive colSpan, splitting slash values into start/end', () => {
  const { getByTestId } = render(
    <GridItem data-testid="item" colSpan={{ base: 12, m: 6, lg: '1 / -1' }} />,
  );
  const el = getByTestId('item');
  expect(el.style.getPropertyValue('--grid-item-col-start-base')).toBe(
    'span 12',
  );
  expect(el.style.getPropertyValue('--grid-item-col-start-m')).toBe('span 6');
  expect(el.style.getPropertyValue('--grid-item-col-start-lg')).toBe('1');
  expect(el.style.getPropertyValue('--grid-item-col-end-lg')).toBe('-1');
  expect(el.style.getPropertyValue('--grid-item-col-start-xl')).toBe('');
});

test('GridItem sets responsive rowSpan', () => {
  const { getByTestId } = render(
    <GridItem data-testid="item" rowSpan={{ base: 1, m: 2 }} />,
  );
  const el = getByTestId('item');
  expect(el.style.getPropertyValue('--grid-item-row-start-base')).toBe(
    'span 1',
  );
  expect(el.style.getPropertyValue('--grid-item-row-start-m')).toBe('span 2');
});

test('GridItem does not set col var when colSpan not provided', () => {
  const { getByTestId } = render(<GridItem data-testid="item" />);
  expect(
    getByTestId('item').style.getPropertyValue('--grid-item-col-start-base'),
  ).toBe('');
});

test('Grid sets minWidth as CSS var', () => {
  const { getByTestId } = render(<Grid data-testid="grid" minWidth="200px" />);
  const el = getByTestId('grid');
  expect(el.style.getPropertyValue('--grid-min-width-base')).toBe('200px');
  expect(el.style.getPropertyValue('--grid-min-width-m')).toBe('');
});

test('Grid sets responsive maxWidth for explicit breakpoints', () => {
  const { getByTestId } = render(
    <Grid data-testid="grid" maxWidth={{ base: '100%', lg: '1200px' }} />,
  );
  const el = getByTestId('grid');
  expect(el.style.getPropertyValue('--grid-max-width-base')).toBe('100%');
  expect(el.style.getPropertyValue('--grid-max-width-m')).toBe('');
  expect(el.style.getPropertyValue('--grid-max-width-lg')).toBe('1200px');
  expect(el.style.getPropertyValue('--grid-max-width-xl')).toBe('');
});

test('GridItem sets colStart and colEnd as CSS vars', () => {
  const { getByTestId } = render(
    <GridItem data-testid="item" colStart={2} colEnd={-1} />,
  );
  const el = getByTestId('item');
  expect(el.style.getPropertyValue('--grid-item-col-start-base')).toBe('2');
  expect(el.style.getPropertyValue('--grid-item-col-end-base')).toBe('-1');
});

test('GridItem sets responsive colStart', () => {
  const { getByTestId } = render(
    <GridItem data-testid="item" colStart={{ base: 1, m: 3 }} />,
  );
  const el = getByTestId('item');
  expect(el.style.getPropertyValue('--grid-item-col-start-base')).toBe('1');
  expect(el.style.getPropertyValue('--grid-item-col-start-m')).toBe('3');
  expect(el.style.getPropertyValue('--grid-item-col-start-lg')).toBe('');
});

test('GridItem sets rowStart and rowEnd as CSS vars', () => {
  const { getByTestId } = render(
    <GridItem data-testid="item" rowStart={2} rowEnd="span 3" />,
  );
  const el = getByTestId('item');
  expect(el.style.getPropertyValue('--grid-item-row-start-base')).toBe('2');
  expect(el.style.getPropertyValue('--grid-item-row-end-base')).toBe('span 3');
});

test('GridItem colStart uses s breakpoint', () => {
  const { getByTestId } = render(
    <GridItem data-testid="item" colStart={{ base: 1, s: 2, lg: 3 }} />,
  );
  const el = getByTestId('item');
  expect(el.style.getPropertyValue('--grid-item-col-start-base')).toBe('1');
  expect(el.style.getPropertyValue('--grid-item-col-start-s')).toBe('2');
  expect(el.style.getPropertyValue('--grid-item-col-start-m')).toBe('');
  expect(el.style.getPropertyValue('--grid-item-col-start-lg')).toBe('3');
});

test('GridItem sets responsive alignSelf', () => {
  const { getByTestId } = render(
    <GridItem
      data-testid="item"
      alignSelf={{ base: 'stretch', m: 'center' }}
    />,
  );
  const el = getByTestId('item');
  expect(el.style.getPropertyValue('--grid-item-align-self-base')).toBe(
    'stretch',
  );
  expect(el.style.getPropertyValue('--grid-item-align-self-m')).toBe('center');
});

test('Grid and GridItem compose a semantic list', () => {
  const gridRef = createRef<HTMLUListElement>();
  const itemRef = createRef<HTMLLIElement>();
  render(
    <Grid as="ul" aria-label="Destinations" ref={gridRef}>
      <GridItem as="li" ref={itemRef}>
        <a href="/oslo">Oslo</a>
      </GridItem>
      <GridItem as="li">
        <a href="/bergen">Bergen</a>
      </GridItem>
    </Grid>,
  );

  const list = screen.getByRole('list', { name: 'Destinations' });
  const items = within(list).getAllByRole('listitem');
  expect(gridRef.current).toBe(list);
  expect(itemRef.current).toBe(items[0]);
  expect(items).toHaveLength(2);
  expect(within(items[0]).getByRole('link', { name: 'Oslo' })).toHaveAttribute(
    'href',
    '/oslo',
  );
  expect(
    within(items[1]).getByRole('link', { name: 'Bergen' }),
  ).toHaveAttribute('href', '/bergen');
});
