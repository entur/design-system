import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GridContainer, GridItem } from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

test('composes a navigation landmark with a semantic list of destinations', () => {
  render(
    <GridContainer as="nav" aria-label="Destinations">
      <GridContainer as="ul">
        <GridItem as="li">
          <a href="/oslo">Oslo</a>
        </GridItem>
        <GridItem as="li">
          <a href="/bergen">Bergen</a>
        </GridItem>
      </GridContainer>
    </GridContainer>,
  );

  const navigation = screen.getByRole('navigation', { name: 'Destinations' });
  const list = within(navigation).getByRole('list');
  const items = within(list).getAllByRole('listitem');

  expect(items).toHaveLength(2);
  items.forEach(item => expect(item.parentElement).toBe(list));
  expect(within(items[0]).getByRole('link', { name: 'Oslo' })).toHaveAttribute(
    'href',
    '/oslo',
  );
  expect(
    within(items[1]).getByRole('link', { name: 'Bergen' }),
  ).toHaveAttribute('href', '/bergen');
});

test('keeps links and nested form controls keyboard accessible within a main landmark', async () => {
  const user = userEvent.setup();
  render(
    <GridContainer as="main" aria-label="Journey planner">
      <GridItem as="a" href="/departures">
        Departures
      </GridItem>
      <GridItem>
        <label htmlFor="destination">Destination</label>
        <input id="destination" />
      </GridItem>
    </GridContainer>,
  );

  const main = screen.getByRole('main', { name: 'Journey planner' });
  const departures = within(main).getByRole('link', { name: 'Departures' });
  const destination = within(main).getByRole('textbox', {
    name: 'Destination',
  });

  await user.tab();
  expect(departures).toHaveFocus();
  await user.tab();
  expect(destination).toHaveFocus();
  await user.keyboard('Oslo');
  expect(destination).toHaveValue('Oslo');
  await user.tab({ shift: true });
  expect(departures).toHaveFocus();
});

test('spacing, rowSpacing and column spans select their modifier classes', () => {
  render(
    <GridContainer spacing="small" rowSpacing="medium" aria-label="Grid">
      <GridItem small={2} medium={3} large={4}>
        Oslo
      </GridItem>
    </GridContainer>,
  );
  expect(screen.getByLabelText('Grid')).toHaveClass(
    'eds-grid',
    'eds-grid__container',
    'eds-grid--spacing-small',
    'eds-grid--spacing-row-medium',
  );
  const item = screen.getByText('Oslo');
  expect(item).toHaveClass(
    'eds-grid',
    'eds-grid__item',
    'eds-grid--small-2',
    'eds-grid--medium-3',
    'eds-grid--large-4',
  );
  expect(item).not.toHaveClass('eds-grid__container');
});

test('equal spacing and rowSpacing need no separate row class', () => {
  render(
    <GridContainer spacing="small" rowSpacing="small" aria-label="Grid" />,
  );
  expect(screen.getByLabelText('Grid').className).not.toMatch(
    /eds-grid--spacing-row-/,
  );
});

// Bug: spacing without rowSpacing adds the class "eds-grid--spacing-row-undefined".
test.failing('spacing without rowSpacing adds no row spacing class', () => {
  render(<GridContainer spacing="small" aria-label="Grid" />);
  expect(screen.getByLabelText('Grid').className).not.toMatch(
    /eds-grid--spacing-row-/,
  );
});

describeComponentContract('GridContainer', {
  render: props => <GridContainer {...props}>Oslo</GridContainer>,
  getElement: () => screen.getByText('Oslo'),
  baseClassName: 'eds-grid__container',
  as: 'section',
});

describeComponentContract('GridItem', {
  render: props => <GridItem {...props}>Oslo</GridItem>,
  getElement: () => screen.getByText('Oslo'),
  baseClassName: 'eds-grid__item',
  as: 'li',
});
