import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TravelSwitch, TravelTag } from '.';

test('keyboard and label clicks update a controlled transport filter and its selected route', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  function TransportFilter() {
    const [includeBus, setIncludeBus] = React.useState(false);
    return (
      <>
        <TravelSwitch
          transport="bus"
          checked={includeBus}
          onChange={event => {
            onChange(event.target.checked);
            setIncludeBus(event.target.checked);
          }}
        >
          Vis buss
        </TravelSwitch>
        {includeBus && <TravelTag transport="bus">31</TravelTag>}
      </>
    );
  }
  render(<TransportFilter />);
  const bus = screen.getByRole('checkbox', { name: 'Vis buss' });
  expect(bus).not.toBeChecked();
  expect(
    screen.queryByRole('img', { name: 'Buss 31' }),
  ).not.toBeInTheDocument();

  await user.tab();
  expect(bus).toHaveFocus();
  await user.keyboard(' ');
  expect(bus).toBeChecked();
  expect(screen.getByRole('img', { name: 'Buss 31' })).toBeVisible();

  await user.click(screen.getByText('Vis buss'));
  expect(bus).not.toBeChecked();
  expect(
    screen.queryByRole('img', { name: 'Buss 31' }),
  ).not.toBeInTheDocument();
  expect(onChange.mock.calls).toEqual([[true], [false]]);
});

test('disabled transport is skipped by keyboard and excluded from labelled form submission', async () => {
  const user = userEvent.setup();
  const onDisabledChange = jest.fn();
  const onSubmit = jest.fn();
  render(
    <form
      aria-label="Transportmidler"
      onSubmit={event => {
        event.preventDefault();
        onSubmit(new FormData(event.currentTarget).getAll('transport'));
      }}
    >
      <TravelSwitch
        transport="bus"
        name="transport"
        value="bus"
        checked
        disabled
        onChange={onDisabledChange}
      >
        Buss
      </TravelSwitch>
      <TravelSwitch transport="train" name="transport" value="train">
        Tog
      </TravelSwitch>
      <button type="submit">Søk reiser</button>
    </form>,
  );
  const bus = screen.getByRole('checkbox', { name: 'Buss' });
  const train = screen.getByRole('checkbox', { name: 'Tog' });
  expect(bus).toBeDisabled();
  expect(bus).toBeChecked();
  expect(train).not.toBeChecked();

  await user.click(bus);
  await user.click(screen.getByText('Buss'));
  await user.tab();
  expect(train).toHaveFocus();
  await user.keyboard(' ');
  expect(train).toBeChecked();
  expect(bus).toBeChecked();
  expect(onDisabledChange).not.toHaveBeenCalled();

  await user.click(screen.getByRole('button', { name: 'Søk reiser' }));
  expect(onSubmit.mock.calls).toEqual([[['train']]]);
});
