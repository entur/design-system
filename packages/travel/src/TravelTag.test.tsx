import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TravelTag } from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

test('journey tags identify the transport and show destination, departure and walking time', () => {
  render(
    <>
      <TravelTag transport="train" label="Bergen" details="Avgang 609">
        F4
      </TravelTag>
      <TravelTag transport="walk" type="duration" label="Til holdeplassen">
        12 min
      </TravelTag>
    </>,
  );

  const train = screen.getByRole('img', { name: 'Tog F4' });
  expect(within(train).getByText('F4')).toBeVisible();
  expect(within(train).getByText('Avgang 609')).toBeVisible();
  expect(screen.getByText('Bergen')).toBeVisible();
  expect(screen.getByRole('img', { name: 'Gange 12 min' })).toBeVisible();
  expect(screen.getByText('Til holdeplassen')).toBeVisible();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('removing a selected route leaves the other route intact without submitting the form', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  function SelectedRoutes() {
    const [includeBus, setIncludeBus] = React.useState(true);
    return (
      <form
        aria-label="Valgte linjer"
        onSubmit={event => {
          event.preventDefault();
          onSubmit();
        }}
      >
        {includeBus && (
          <TravelTag transport="bus" onClose={() => setIncludeBus(false)}>
            31
          </TravelTag>
        )}
        <TravelTag transport="tram">12</TravelTag>
      </form>
    );
  }
  render(<SelectedRoutes />);

  const bus = screen.getByRole('img', { name: 'Buss 31' });
  await user.click(within(bus).getByRole('button'));

  expect(
    screen.queryByRole('img', { name: 'Buss 31' }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Trikk 12' })).toBeVisible();
  expect(onSubmit).not.toHaveBeenCalled();
});

test('type, alert and onClose select their modifier classes', () => {
  const { rerender } = render(<TravelTag transport="bus">31</TravelTag>);
  const tag = screen.getByRole('img', { name: 'Buss 31' });
  expect(tag).toHaveClass('eds-travel-tag', 'eds-travel-tag--transport');
  expect(tag).not.toHaveClass(
    'eds-travel-tag--type-duration',
    'eds-travel-tag--closable',
    'eds-travel-tag--alert',
  );

  rerender(
    <TravelTag
      transport="bus"
      type="duration"
      alert="error"
      onClose={jest.fn()}
    >
      31
    </TravelTag>,
  );
  expect(screen.getByRole('img', { name: 'Buss 31 error' })).toHaveClass(
    'eds-travel-tag--type-duration',
    'eds-travel-tag--closable',
    'eds-travel-tag--alert',
    'eds-travel-tag--alert--error',
  );
});

test('label placement selects its wrapper modifier class', () => {
  render(
    <TravelTag transport="bus" label="Sentrum" labelPlacement="bottom">
      31
    </TravelTag>,
  );
  expect(screen.getByText('Sentrum')).toHaveClass(
    'eds-travel-tag__label--bottom',
  );
  expect(
    screen.getByRole('img', { name: 'Buss 31' }).parentElement,
  ).toHaveClass('eds-travel-tag__wrapper--label-position-bottom');
});

describeComponentContract('TravelTag', {
  render: props => (
    <TravelTag transport="bus" {...props}>
      31
    </TravelTag>
  ),
  getElement: () => screen.getByRole('img', { name: 'Buss 31' }),
  baseClassName: 'eds-travel-tag',
});

// Bug: TravelTag's close button has neither text nor an accessible label.
test.failing(
  'a removable route exposes an accessible name for its close button',
  () => {
    render(
      <TravelTag transport="bus" onClose={jest.fn()}>
        31
      </TravelTag>,
    );

    expect(screen.getByRole('button')).toHaveAccessibleName();
  },
);
