import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Dropdown } from '.';

jest.mock('./useScreenSize', () => ({
  useScreenSize: () => 'large',
}));

const testItems = [
  'Oslo',
  'Bergen',
  'Stavanger',
  'Kristiansand',
  'Tromsø',
  'Leknes',
];

test('renders a basic dropdown', () => {
  const changeSpy = jest.fn();
  const { queryByText, getByText } = render(
    <Dropdown items={testItems} placeholder="Velg noe" onChange={changeSpy} />,
  );

  const triggerButton = getByText('Velg noe');
  expect(queryByText('Oslo')).not.toBeInTheDocument();

  fireEvent.click(triggerButton);
  expect(queryByText('Oslo')).toBeInTheDocument();

  fireEvent.click(getByText('Oslo'));
  expect(changeSpy).toHaveBeenCalled();
});
test('renders a searchable dropdown', () => {
  const changeSpy = jest.fn();
  const { queryByText, getByText, getByPlaceholderText } = render(
    <Dropdown
      items={testItems}
      placeholder="Velg noe"
      onChange={changeSpy}
      searchable
    />,
  );

  const inputField = getByPlaceholderText('Velg noe');
  expect(queryByText('Bergen')).not.toBeInTheDocument();

  fireEvent.focus(inputField);
  fireEvent.change(inputField, { target: { value: 'er' } });
  expect(queryByText('Bergen')).toBeInTheDocument();
  expect(queryByText('Stavanger')).toBeInTheDocument();
  expect(queryByText('Oslo')).not.toBeInTheDocument();

  fireEvent.click(getByText('Bergen'));
  expect(changeSpy).toHaveBeenCalled();
});
test('handles all sorts of items', () => {
  const spy = jest.fn();
  const MockIcon = () => <svg />;
  const diverseListOfItems = [
    'Simple option',
    { label: 'Just label option' },
    { value: 'value', label: 'Label with different value' },
    { label: 'Just label with icons', icons: [MockIcon] },
    {
      value: 'another value',
      label: 'Full monty',
      icons: [MockIcon, MockIcon],
    },
  ];
  const { getAllByRole, getByRole } = render(
    <Dropdown
      items={diverseListOfItems}
      placeholder="Velg noe"
      searchable
      onChange={spy}
    />,
  );

  fireEvent.click(getByRole('button'));

  expect(getAllByRole('option')).toHaveLength(diverseListOfItems.length);
  fireEvent.click(getAllByRole('option')[0]); // Click the first option

  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({
      value: 'Simple option',
      label: 'Simple option',
    }),
    expect.anything(),
  );
});
