import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TagChip } from '.';

test('removes only the requested tag with mouse and keyboard without submitting', async () => {
  const user = userEvent.setup();
  const onClose = jest.fn();
  const onSubmit = jest.fn(event => event.preventDefault());
  function SelectedCities() {
    const [cities, setCities] = useState(['Oslo', 'Bergen', 'Trondheim']);
    return (
      <form onSubmit={onSubmit}>
        {cities.map(city => (
          <TagChip
            key={city}
            onClose={() => {
              onClose(city);
              setCities(current => current.filter(value => value !== city));
            }}
          >
            {city}
          </TagChip>
        ))}
      </form>
    );
  }
  render(<SelectedCities />);

  await user.click(screen.getByRole('button', { name: 'Fjern Oslo' }));
  expect(screen.queryByText('Oslo')).not.toBeInTheDocument();
  expect(screen.getByText('Bergen')).toBeInTheDocument();
  expect(screen.getByText('Trondheim')).toBeInTheDocument();
  expect(onClose).toHaveBeenNthCalledWith(1, 'Oslo');

  await user.tab();
  expect(screen.getByRole('button', { name: 'Fjern Bergen' })).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(screen.queryByText('Bergen')).not.toBeInTheDocument();
  expect(screen.getByText('Trondheim')).toBeInTheDocument();
  expect(onClose).toHaveBeenNthCalledWith(2, 'Bergen');

  await user.tab();
  expect(screen.getByRole('button', { name: 'Fjern Trondheim' })).toHaveFocus();
  await user.keyboard(' ');
  expect(screen.queryByText('Trondheim')).not.toBeInTheDocument();
  expect(onClose).toHaveBeenNthCalledWith(3, 'Trondheim');
  expect(onClose).toHaveBeenCalledTimes(3);
  expect(onSubmit).not.toHaveBeenCalled();
});

test('uses a custom removal name for rich content and leaves removal to the parent', async () => {
  const user = userEvent.setup();
  const onClose = jest.fn();
  render(
    <TagChip onClose={onClose} closeButtonAriaLabel="Fjern valgt by Oslo">
      <strong>Oslo</strong>
    </TagChip>,
  );
  await user.click(screen.getByText('Oslo'));
  expect(onClose).not.toHaveBeenCalled();
  const remove = screen.getByRole('button', { name: 'Fjern valgt by Oslo' });
  await user.click(remove);
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(remove).toBeInTheDocument();
  expect(screen.getByText('Oslo')).toBeInTheDocument();
});

test('forwards className and rest props to the tag, ref to the close button, and selects size classes', () => {
  const ref = React.createRef<HTMLButtonElement>();
  render(
    <TagChip
      ref={ref}
      onClose={jest.fn()}
      className="consumer-class"
      size="small"
      data-consumer="value"
    >
      Oslo
    </TagChip>,
  );
  const closeButton = screen.getByRole('button', { name: 'Fjern Oslo' });
  expect(ref.current).toBe(closeButton);
  const tag = closeButton.parentElement;
  expect(tag).toHaveClass(
    'consumer-class',
    'eds-tag-chip',
    'eds-chip--size-small',
  );
  expect(tag).toHaveAttribute('data-consumer', 'value');
});
