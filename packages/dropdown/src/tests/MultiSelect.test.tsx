import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MultiSelect, DropdownItemType, NormalizedDropdownItemType } from '..';

expect.extend(toHaveNoViolations);

describe('MultiSelect', () => {
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
  const normalizedTestItems = testItems.map(
    item =>
      ({
        value: item,
        label: item,
      } as NormalizedDropdownItemType),
  );

  test('is displayed with label', () => {
    render(
      <MultiSelect label="test label" items={testItems} selectedItems={[]} />,
    );

    expect(screen.queryAllByLabelText('test label')[0]).toBeInTheDocument();
  });

  test('can select elements with mouse', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const selectedItems = [
      {
        value: 'Bergen',
        label: 'Bergen',
      },
    ];
    render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={selectedItems}
        onChange={onChange}
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    await user.click(inputField);

    const menuItemOslo = screen.getByRole('option', { name: 'Oslo' });
    await user.click(menuItemOslo);

    expect(onChange).toHaveBeenCalledWith([
      {
        value: 'Bergen',
        label: 'Bergen',
      },
      {
        value: 'Oslo',
        label: 'Oslo',
      },
    ]);
  });

  test('can unselect element with mouse', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const selectedItems = [
      {
        value: 'Oslo',
        label: 'Oslo',
      },
      {
        value: 'Bergen',
        label: 'Bergen',
      },
    ];
    render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={selectedItems}
        onChange={onChange}
        ariaLabelSelectedItem=""
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    await user.click(inputField);

    const menuItemOslo = screen.getByRole('option', { name: 'Oslo' });
    await user.click(menuItemOslo);

    expect(onChange).toHaveBeenCalledWith([
      {
        value: 'Bergen',
        label: 'Bergen',
      },
    ]);
  });

  test('can select element with keyboard', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const selectedItems = [
      {
        value: 'Bergen',
        label: 'Bergen',
      },
    ];
    render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={selectedItems}
        onChange={onChange}
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    inputField.focus();
    await user.keyboard('{ }'); // open dropdown list

    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledWith([
      {
        value: 'Bergen',
        label: 'Bergen',
      },
      {
        value: 'Kristiansund',
        label: 'Kristiansund',
      },
    ]);
  });

  test('can unselect element with keyboard', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const selectedItems = [
      {
        value: 'Bergen',
        label: 'Bergen',
      },
      {
        value: 'Kristiansund',
        label: 'Kristiansund',
      },
    ];
    render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={selectedItems}
        onChange={onChange}
        ariaLabelSelectedItem=""
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    inputField.focus();
    await user.keyboard('{ }'); // open dropdown list

    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledWith([
      {
        value: 'Bergen',
        label: 'Bergen',
      },
    ]);
  });

  test('selectAll selects all elements', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={[]}
        onChange={onChange}
        labelSelectAll="select all"
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    await user.click(inputField); // open dropdown list

    await user.click(screen.getByRole('option', { name: 'select all' }));

    expect(onChange).toBeCalledWith(normalizedTestItems);
  });

  test('selectAll selects all elements when some are selected', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const selectedItems = [normalizedTestItems[0]];
    render(
      <MultiSelect
        label="test label"
        items={normalizedTestItems}
        selectedItems={selectedItems}
        onChange={onChange}
        labelSelectAll="select all"
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    await user.click(inputField); // open dropdown list

    await user.click(
      screen.getByRole('option', { name: 'select all, delvis valgt' }),
    );

    expect(onChange).toBeCalledWith(normalizedTestItems);
  });

  test('selectAll unselects all elements when all are selected', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <MultiSelect
        label="test label"
        items={normalizedTestItems}
        selectedItems={normalizedTestItems}
        onChange={onChange}
        ariaLabelChosenSingular="selected"
        labelSelectAll="select all"
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    await user.click(inputField); // open dropdown list

    await user.click(
      screen.getByRole('option', { name: 'select all, selected' }),
    );

    expect(onChange).toBeCalledWith([]);
  });

  test('hideSelectAll hides select all option', async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={[]}
        labelSelectAll="select all"
        hideSelectAll
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    inputField.focus();
    await user.keyboard('{ }'); // open dropdown list

    expect(
      screen.queryByRole('option', { name: 'select all' }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(testItems.length);
  });

  test('opens and closes visibly on click', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={[]}
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
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={[]}
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

    // select with enter or space does not close list
    await user.keyboard('{Enter}');
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
      <MultiSelect
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
        selectedItems={[]}
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
      <MultiSelect label="test label" items={testItems} selectedItems={[]} />,
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
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={[]}
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
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={[]}
        onChange={onChange}
        selectOnTab={true}
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    inputField.focus();
    await user.keyboard('{ }'); // open dropdown list

    await user.keyboard('{ArrowDown}{Enter}');
    await user.keyboard('{Tab}');

    expect(onChange).toBeCalledWith([{ label: 'Oslo', value: 'Oslo' }]);
  });

  test('displays selected items', () => {
    const selectedItems = [
      { label: 'selected1', value: 'selected1' },
      { label: 'selected2', value: 'selected2' },
    ];
    const onChange = jest.fn();
    render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={selectedItems}
        onChange={onChange}
      />,
    );

    expect(screen.queryByText(selectedItems[0].label)).toBeInTheDocument();
    expect(screen.queryByText(selectedItems[1].label)).toBeInTheDocument();
  });

  test('displays summary tag when more items than maxChips are selected', () => {
    const selectedItems = [
      { label: 'selected1', value: 'selected1' },
      { label: 'selected2', value: 'selected2' },
      { label: 'selected3', value: 'selected3' },
      { label: 'selected4', value: 'selected4' },
    ];
    render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={selectedItems}
        maxChips={3}
        ariaLabelChosenPlural="chosen"
      />,
    );

    expect(screen.queryByText('4 chosen')).toBeInTheDocument();
  });

  test('displays all-selected tag when all items are selected and total number of selected is larger than maxChips', () => {
    render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={normalizedTestItems}
        maxChips={3}
        ariaLabelChosenPlural="chosen"
        labelAllItemsSelected="all selected"
      />,
    );

    expect(screen.queryByText('all selected')).toBeInTheDocument();
  });

  test('clearable button clears selected item', async () => {
    const user = userEvent.setup();
    const selectedItems = [{ label: 'selected', value: 'selected' }];
    const onChange = jest.fn();
    render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={selectedItems}
        onChange={onChange}
        clearable
        labelClearAllItems="remove"
      />,
    );

    const clearableButton = screen.getByRole('button', { name: 'remove' });
    await user.click(clearableButton);

    expect(onChange).toBeCalledWith([]);
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
      <MultiSelect
        label="test label"
        items={mixedItems}
        selectedItems={[]}
        onChange={onChange}
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    inputField.focus();
    await user.keyboard('{ }'); // open dropdown list

    expect(screen.getAllByRole('option')).toHaveLength(mixedItems.length + 1); // '+ 1' to account for 'select all' option

    await user.keyboard('{ArrowDown}{Enter}'); // select first item
    // received selected item is formatted into normalized dropdown item type
    expect(onChange).toBeCalledWith([
      {
        label: 'Simple option',
        value: 'Simple option',
      },
    ]);
  });

  test('works with items as a synchronous function', async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        label="test label"
        items={() => testItems}
        selectedItems={[]}
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    await user.click(inputField);

    const listItems = await screen.findAllByRole('option');

    expect(listItems).toHaveLength(testItems.length + 1); // '+ 1' to account for 'select all' option
  });

  test('works with items as an asynchronous function', async () => {
    const user = userEvent.setup();
    const asyncItems = () => {
      return new Promise<DropdownItemType[]>(resolve => {
        setTimeout(() => resolve(testItems), 750);
      });
    };
    render(
      <MultiSelect label="test label" items={asyncItems} selectedItems={[]} />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    await user.click(inputField);

    const listItems = await screen.findAllByRole('option');

    expect(listItems).toHaveLength(testItems.length + 1); // '+ 1' to account for 'select all' option
  }, 1500);

  test('input is cleared when clearInputOnSelect is true', async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={[]}
        clearInputOnSelect
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    inputField.focus();
    await user.keyboard('{b}{e}{r}');
    await user.click(screen.getByRole('option', { name: 'Bergen' }));
    expect(inputField).toHaveValue('');
  });

  test('applies className to eds-dropdown element', () => {
    const { container } = render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={[]}
        className="custom-class"
      />,
    );

    const edsDropdownElement =
      container.getElementsByClassName('eds-dropdown')[0];
    expect(edsDropdownElement).toHaveClass('custom-class');
  });

  test('applies listStyle to list element', () => {
    const { container } = render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={[]}
        listStyle={{ color: 'pink' }}
      />,
    );

    const listElement =
      container.getElementsByClassName('eds-dropdown__list')[0];
    expect(listElement).toHaveStyle({ color: 'pink' });
  });

  test('does not violate basic accessibility', async () => {
    const selectedItems = [{ label: 'choice1', value: 'choice1' }];
    const { container } = render(
      <MultiSelect
        label="test label"
        items={testItems}
        selectedItems={selectedItems}
      />,
    );

    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
