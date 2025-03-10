import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SearchableDropdown, DropdownItemType } from '..';

expect.extend(toHaveNoViolations);

describe('SearchableDropdown', () => {
  const testItems = [
    'Oslo',
    'Bergen',
    'Stavanger',
    'Kristiansund',
    'Tromsø',
    'Stavern',
    'Leknes',
    'Brønnøysund',
  ];

  test('is displayed with label', () => {
    render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={null}
      />,
    );

    expect(screen.queryAllByLabelText('test label')[0]).toBeInTheDocument();
  });

  test('can select element with mouse', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    await user.click(inputField);

    const menuItemOslo = screen.getByRole('option', { name: 'Oslo' });
    await user.click(menuItemOslo);

    expect(onChange).toHaveBeenCalledWith({
      value: 'Oslo',
      label: 'Oslo',
    });
  });

  test('selectedItem placeholder is correctly displayed on initial launch', async () => {
    const onChange = jest.fn();
    const selectedItem = { label: testItems[0], value: testItems[0] };
    render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={selectedItem}
        onChange={onChange}
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    const selectedItemPlaceholder = document.getElementsByClassName(
      'eds-dropdown--searchable__selected-item',
    )?.[0];

    expect(inputField).toHaveValue('');
    expect(selectedItemPlaceholder).toHaveTextContent(selectedItem.label);
  });

  test('can select element with keyboard', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    inputField.focus();
    await user.keyboard('{ }'); // open dropdown list

    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledWith({
      value: 'Kristiansund',
      label: 'Kristiansund',
    });
  });

  test('opens and closes visibly on click', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
        ariaLabelOpenList="togglebutton"
        ariaLabelCloseList="togglebutton"
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    const toggleButton = screen.getByRole('button', { name: 'togglebutton' });

    await user.click(inputField);
    const dropdownList = screen.getByRole('listbox', { name: 'test label' });
    expect(dropdownList).toBeVisible();

    await user.click(document.body);
    expect(dropdownList).not.toBeVisible();

    await user.click(toggleButton);
    expect(dropdownList).toBeVisible();
    await user.click(toggleButton);
    expect(dropdownList).not.toBeVisible();
  });

  test('opens and closes visibly with keyboard', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    inputField.focus();
    const dropdownList = screen.getByRole('listbox', {
      hidden: true,
    });

    // focus does not open list
    expect(dropdownList).not.toBeVisible();

    // space opens list
    await user.keyboard('{ }');
    expect(dropdownList).toBeVisible();

    // close on select with enter
    await user.keyboard('{Enter}');
    expect(dropdownList).not.toBeVisible();

    // open and don't close on select with space
    await user.keyboard('{ }');
    expect(dropdownList).toBeVisible();
    await user.keyboard('{ }');
    expect(dropdownList).toBeVisible();

    // close on esc
    await user.keyboard('{Escape}');
    expect(dropdownList).not.toBeVisible();

    // open on type
    await user.keyboard('{b}');
    expect(dropdownList).toBeVisible();
    await user.keyboard('{Escape}');

    // down arrow opens list
    await user.keyboard('{ArrowDown}');
    expect(dropdownList).toBeVisible();

    // close on tab
    await user.keyboard('{Tab}');
    expect(dropdownList).not.toBeVisible();
  });

  test('handles typeahead filter correctly', async () => {
    const user = userEvent.setup();
    const useResolvedItemsDebounceTimeout = 100;
    render(
      <SearchableDropdown
        label="test label"
        items={inputValue => {
          return new Promise<DropdownItemType[]>(resolve => {
            if (!inputValue) resolve(['default']);
            const queryRegex = new RegExp(inputValue, 'i');
            setTimeout(
              () => resolve(testItems.filter(item => queryRegex.test(item))),
              400,
            );
          });
        }}
        selectedItem={null}
        loadingText="loading"
        debounceTimeout={useResolvedItemsDebounceTimeout}
      />,
    );

    screen.getByRole('combobox', { name: 'test label' }).focus();

    expect(
      screen.queryByRole('option', { name: 'Bergen' }),
    ).not.toBeInTheDocument();

    // since we are updating state with typeahead we need to wrap this section in 'act'
    await act(async () => {
      await user.keyboard('{b}');

      await new Promise(r => setTimeout(r, useResolvedItemsDebounceTimeout)); // wait out debounce for search to start loading new data

      expect(screen.queryByText('loading')).toBeInTheDocument();

      await waitFor(() => screen.getByRole('option', { name: 'Bergen' }));
    });

    expect(screen.queryByText('loading')).not.toBeInTheDocument();

    expect(
      screen.queryByRole('option', { name: 'Bergen' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Brønnøysund' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Oslo' }),
    ).not.toBeInTheDocument();
  });

  test('works with default itemFilter', async () => {
    const user = userEvent.setup();
    render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={null}
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    inputField.focus();
    await user.keyboard('{ }'); // open dropdown list

    expect(
      screen.queryByRole('option', { name: 'Kristiansund' }),
    ).toBeInTheDocument();

    await user.keyboard('{b}');

    expect(
      screen.queryByRole('option', { name: 'Bergen' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Kristiansund' }),
    ).not.toBeInTheDocument();
  });

  test('works with custom itemFilter', async () => {
    const user = userEvent.setup();
    render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        itemFilter={
          (item, inputValue) =>
            !new RegExp(inputValue ?? '', 'i').test(item.label) // filter out matches
        }
      />,
    );

    screen.getByRole('combobox', { name: 'test label' }).focus();

    expect(
      screen.queryByRole('option', { name: 'Kristiansund' }),
    ).not.toBeInTheDocument();

    await user.keyboard('{b}');

    expect(
      screen.queryByRole('option', { name: 'Kristiansund' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Stavanger' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Bergen' }),
    ).not.toBeInTheDocument();
  });

  test('selects item with tab when selectOnTab is true', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
        selectOnTab={true}
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    inputField.focus();
    await user.keyboard('{ }'); // open dropdown list

    await user.keyboard('{Tab}');

    expect(onChange).toBeCalledWith({ label: 'Oslo', value: 'Oslo' });
  });

  test('displays selected item', () => {
    const selectedItem = { label: 'selected', value: 'selected' };
    render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={selectedItem}
      />,
    );

    expect(screen.queryByText(selectedItem.label)).toBeInTheDocument();
  });

  test('clearable button clears selected item', async () => {
    const user = userEvent.setup();
    const selectedItem = { label: 'selected', value: 'selected' };
    const onChange = jest.fn();
    render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={selectedItem}
        onChange={onChange}
        clearable
        labelClearSelectedItem="remove"
      />,
    );

    const clearableButton = screen.getByRole('button', { name: 'remove' });
    await user.click(clearableButton);

    expect(onChange).toBeCalledWith(null);
  });

  test('accepts all allowed types of items', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const MockIcon1 = () => <svg />;
    const MockIcon2 = () => <svg />;
    const mixedItems = [
      'Simple option',
      { label: 'Just label option' },
      { value: 'value', label: 'Label with different value' },
      { label: 'Just label with icons', icons: [MockIcon1] },
      {
        value: 'another value',
        label: 'Full monty',
        icons: [MockIcon1, MockIcon2],
      },
    ];
    render(
      <SearchableDropdown
        label="test label"
        items={mixedItems}
        selectedItem={null}
        onChange={onChange}
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    inputField.focus();
    await user.keyboard('{ }'); // open dropdown list

    expect(screen.getAllByRole('option')).toHaveLength(mixedItems.length);

    await user.keyboard('{Enter}'); // select first item
    // received selected item is formatted into normalized dropdown item type
    expect(onChange).toBeCalledWith({
      label: 'Simple option',
      value: 'Simple option',
    });
  });

  test('works with items as a synchronous function', async () => {
    const user = userEvent.setup();
    render(
      <SearchableDropdown
        label="test label"
        items={() => testItems}
        selectedItem={null}
      />,
    );

    const toggleButton = screen.getByRole('combobox', { name: 'test label' });
    await user.click(toggleButton);

    const listItems = await screen.findAllByRole('option');

    expect(listItems).toHaveLength(testItems.length);
  });

  test('works with items as an asynchronous function', async () => {
    const user = userEvent.setup();
    const asyncItems = () => {
      return new Promise<DropdownItemType[]>(resolve => {
        setTimeout(() => resolve(testItems), 750);
      });
    };
    render(
      <SearchableDropdown
        label="test label"
        items={asyncItems}
        selectedItem={null}
      />,
    );

    const toggleButton = screen.getByRole('combobox', { name: 'test label' });
    await user.click(toggleButton);

    const listItems = await screen.findAllByRole('option');

    expect(listItems).toHaveLength(testItems.length);
  }, 1500);

  test('applies className to eds-dropdown element', () => {
    const { container } = render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        className="custom-class"
      />,
    );

    const edsDropdownElement =
      container.getElementsByClassName('eds-dropdown')[0];
    expect(edsDropdownElement).toHaveClass('custom-class');
  });

  test('applies listStyle to list element', () => {
    const { container } = render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        listStyle={{ color: 'pink' }}
      />,
    );

    const listElement =
      container.getElementsByClassName('eds-dropdown__list')[0];
    expect(listElement).toHaveStyle({ color: 'pink' });
  });

  test('does not violate basic accessibility', async () => {
    const selectedItem = { label: 'choice1', value: 'choice1' };
    const { container } = render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={selectedItem}
      />,
    );

    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
