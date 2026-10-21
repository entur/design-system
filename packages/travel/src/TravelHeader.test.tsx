import { render, screen, within } from '@testing-library/react';

import { TravelHeader } from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

// A non-literal `as` keeps jsx-a11y/heading-has-content from treating the
// component as an empty heading; its content comes from `from` and `to`.
const headingLevel = 'h2';

test('a journey heading announces its direction and updates with the destination', () => {
  const { rerender } = render(
    <TravelHeader as={headingLevel} from="Oslo S" to="Bergen" />,
  );

  const heading = screen.getByRole('heading', {
    level: 2,
    name: 'Fra Oslo S, til Bergen',
  });
  expect(within(heading).getByText('Oslo S')).toBeVisible();
  expect(within(heading).getByText('Bergen')).toBeVisible();

  rerender(<TravelHeader as={headingLevel} from="Oslo S" to="Trondheim S" />);
  expect(heading).toHaveAccessibleName('Fra Oslo S, til Trondheim S');
  expect(within(heading).getByText('Trondheim S')).toBeVisible();
  expect(screen.queryByText('Bergen')).not.toBeInTheDocument();
});

test('size and noWrap select their modifier classes', () => {
  const { rerender } = render(
    <TravelHeader as={headingLevel} from="Oslo S" to="Bergen" />,
  );
  const heading = screen.getByRole('heading');
  expect(heading).toHaveClass('eds-travel-header--large');
  expect(heading).not.toHaveClass('eds-travel-header--no-wrap');
  expect(screen.getByText('Oslo S')).toHaveClass('eds-travel-header__from');
  expect(screen.getByText('Bergen')).toHaveClass('eds-travel-header__to');

  rerender(
    <TravelHeader
      as={headingLevel}
      from="Oslo S"
      to="Bergen"
      size="medium"
      noWrap
    />,
  );
  expect(heading).toHaveClass(
    'eds-travel-header--medium',
    'eds-travel-header--no-wrap',
  );
  expect(heading).not.toHaveClass('eds-travel-header--large');
});

describeComponentContract('TravelHeader', {
  render: props => <TravelHeader from="Oslo S" to="Bergen" {...props} />,
  getElement: () => screen.getByLabelText('Fra Oslo S, til Bergen'),
  baseClassName: 'eds-travel-header',
  as: 'h3',
});

// Bug: TravelHeader interpolates ReactNode destinations as "[object Object]" in aria-label.
test.failing(
  'a journey heading announces the text of ReactNode destinations',
  () => {
    render(
      <TravelHeader
        as={headingLevel}
        from={<strong>Oslo S</strong>}
        to={<strong>Bergen</strong>}
      />,
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveAccessibleName(
      'Fra Oslo S, til Bergen',
    );
  },
);
