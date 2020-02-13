import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { Dropdown } from '.';
import { act } from 'react-dom/test-utils';

const testItems = [
  'Oslo',
  'Bergen',
  'Stavanger',
  'Kristiansand',
  'Tromsø',
  'Leknes',
];

test('renders a regular dropdown', () => {
  const changeSpy = jest.fn();
  const { queryByText, getByText } = render(
    <Dropdown items={testItems} placeholder="Velg noe" onChange={changeSpy} />,
  );

  const triggerButton = getByText('Velg noe');
  expect(queryByText('Oslo')).not.toBeInTheDocument();

  fireEvent.click(triggerButton);
  expect(queryByText('Oslo')).toBeInTheDocument();

  fireEvent.click(getByText('Oslo'));
  expect(changeSpy).toHaveBeenCalledWith(
    {
      value: 'Oslo',
      label: 'Oslo',
    },
    expect.anything(),
  );
});
test('renders a searchable dropdown', async () => {
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

  act(() => {
    fireEvent.focus(inputField);
    fireEvent.change(inputField, { target: { value: 'er' } });
  });

  await wait(() => getByText('Bergen'));

  expect(getByText('Bergen')).toBeInTheDocument();
  expect(getByText('Stavanger')).toBeInTheDocument();
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

test('handles items prop when they are delivered by a synchronous function', async () => {
  const { getAllByRole, queryAllByRole, getByText } = render(
    <Dropdown items={() => testItems} placeholder="Velg noe" />,
  );

  const triggerButton = getByText('Velg noe');
  expect(queryAllByRole('option')).toHaveLength(0);

  fireEvent.click(triggerButton);

  await wait(() => getAllByRole('option'));

  expect(getAllByRole('option')).toHaveLength(testItems.length);
});

test('handles items prop when they are delivered by an asynchronous function', async () => {
  const { queryAllByRole, getAllByRole, getByText } = render(
    <Dropdown items={async () => testItems} placeholder="Velg noe" />,
  );

  const triggerButton = getByText('Velg noe');
  expect(queryAllByRole('option')).toHaveLength(0);

  fireEvent.click(triggerButton);

  await wait(() => getAllByRole('option'));

  expect(getAllByRole('option')).toHaveLength(testItems.length);
});

test('handles typeahead case', async () => {
  const changeSpy = jest.fn();
  const { queryByText, getByText, getByPlaceholderText } = render(
    <Dropdown
      items={inputValue =>
        Promise.resolve(testItems.filter(item => item.includes(inputValue)))
      }
      placeholder="Velg noe"
      onChange={changeSpy}
      searchable
      loadingText="2 sek"
    />,
  );

  const inputField = getByPlaceholderText('Velg noe');
  expect(queryByText('Bergen')).not.toBeInTheDocument();

  act(() => {
    fireEvent.focus(inputField);
    fireEvent.change(inputField, { target: { value: 'er' } });
  });

  await wait(() => getByText('Bergen'));

  expect(queryByText('2 sek')).not.toBeInTheDocument();

  expect(getByText('Bergen')).toBeInTheDocument();
  expect(getByText('Stavanger')).toBeInTheDocument();
  expect(queryByText('Oslo')).not.toBeInTheDocument();

  fireEvent.click(getByText('Bergen'));
  expect(changeSpy).toHaveBeenCalled();
});

test('lets the user select the highlighted index on tab', async () => {
  const changeSpy = jest.fn();
  const { getByPlaceholderText } = render(
    <Dropdown
      items={testItems}
      placeholder="Velg noe"
      onChange={changeSpy}
      searchable
      selectOnTab
    />,
  );

  const inputField = getByPlaceholderText('Velg noe');

  fireEvent.focus(inputField);

  // First we open the menu, which highlights the first item
  fireEvent.keyDown(inputField, { key: 'ArrowDown' });
  // Second, we move down to the second option, which is Bergen
  fireEvent.keyDown(inputField, { key: 'ArrowDown' });
  // Finally, we tab out of the component, which should call our onChange handler with Bergen
  fireEvent.keyDown(inputField, { key: 'Tab' });

  expect(changeSpy).toHaveBeenCalledWith(
    {
      value: 'Bergen',
      label: 'Bergen',
    },
    expect.anything(),
  );
});

test('auto-highlights first item if the highlightFirstItemOnOpen prop is set', async () => {
  const changeSpy = jest.fn();
  const { getByPlaceholderText } = render(
    <Dropdown
      highlightFirstItemOnOpen
      openOnFocus
      items={testItems}
      placeholder="Velg noe"
      onChange={changeSpy}
      searchable
    />,
  );

  const inputField = getByPlaceholderText('Velg noe');
  // The menu is opened automatically as the field gains focus. The first item is also highlighted.
  fireEvent.focus(inputField);
  // Because the selectOnTab prop is true, pressing tab immediately selects the first item
  fireEvent.keyDown(inputField, { key: 'Enter' });

  expect(changeSpy).toHaveBeenCalledWith(
    {
      value: 'Oslo',
      label: 'Oslo',
    },
    expect.anything(),
  );
});

test('auto-highlights first item if the highlightFirstItemOnOpen prop is set in the typeahead case', async () => {
  const changeSpy = jest.fn();
  const { queryByText, getByText, getByPlaceholderText } = render(
    <Dropdown
      highlightFirstItemOnOpen
      openOnFocus
      items={inputValue =>
        Promise.resolve(testItems.filter(item => item.includes(inputValue)))
      }
      placeholder="Velg noe"
      onChange={changeSpy}
      searchable
      loadingText="2 sek"
    />,
  );

  const inputField = getByPlaceholderText('Velg noe');
  expect(queryByText('Bergen')).not.toBeInTheDocument();

  act(() => {
    fireEvent.focus(inputField);
    fireEvent.change(inputField, { target: { value: 'er' } });
  });

  await wait(() => getByText('Bergen'));

  expect(queryByText('2 sek')).not.toBeInTheDocument();

  expect(getByText('Bergen')).toBeInTheDocument();
  expect(getByText('Stavanger')).toBeInTheDocument();
  expect(queryByText('Oslo')).not.toBeInTheDocument();

  fireEvent.keyDown(inputField, { key: 'Enter' });
  expect(changeSpy).toHaveBeenCalledWith(
    {
      value: 'Bergen',
      label: 'Bergen',
    },
    expect.anything(),
  );
});
