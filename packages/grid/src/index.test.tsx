// TODO: Implement some tests!
import React from 'react';
import { render } from '@testing-library/react';
import { GridItem, GridContainer } from '.';

test('GridContainer renders with correct classes, with an additional class', () => {
  const { container } = render(
    <GridContainer className="extra-class" spacing="small" rowSpacing="medium">
      Hello world
    </GridContainer>,
  );
  expect(container.querySelector('.eds-grid')).toBeTruthy();
  expect(container.querySelector('.eds-grid__container')).toHaveClass(
    'extra-class',
  );

  expect(container.querySelector('.eds-grid__container')).toHaveClass(
    'eds-grid--spacing-small',
  );
  expect(container.querySelector('.eds-grid__container')).toHaveClass(
    'eds-grid--spacing-row-medium',
  );
});

test('GridContainer renders GridItem as child, and GridItem has several props set correctly', () => {
  const { container } = render(
    <GridContainer spacing="small" rowSpacing="medium">
      <GridItem small={2} medium={3} large={4}></GridItem>
    </GridContainer>,
  );
  expect(container.querySelector('.eds-grid__item')).toHaveClass(
    'eds-grid--small-2',
  );
  expect(container.querySelector('.eds-grid__item')).toHaveClass(
    'eds-grid--medium-3',
  );
  expect(container.querySelector('.eds-grid__item')).toHaveClass(
    'eds-grid--large-4',
  );
});

test('Grid works with as-prop set to anchor tag', () => {
  const hrefLink = '#testerHref';
  const { getByTestId, rerender } = render(
    <GridContainer
      spacing="medium"
      as="a"
      href={hrefLink}
      data-testid="container"
    >
      <GridItem small={12} data-testid="item">
        Cool
      </GridItem>
    </GridContainer>,
  );

  const testerContainer = getByTestId('container');
  expect(testerContainer.nodeName).toBe('A');
  expect(testerContainer).toHaveAttribute('href', hrefLink);

  rerender(
    <GridContainer spacing="medium" data-testid="container">
      <GridItem as="a" href={hrefLink} small={12} data-testid="item">
        Cool
      </GridItem>
    </GridContainer>,
  );
  const testerItem = getByTestId('item');
  expect(testerItem.nodeName).toBe('A');
  expect(testerItem).toHaveAttribute('href', hrefLink);
});
