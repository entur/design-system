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
