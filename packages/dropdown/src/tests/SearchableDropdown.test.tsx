import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DropdownItemType, SearchableDropdown } from '..';

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

  test('displays the initial selection and offers it as a placeholder when editing', async () => {
    const user = userEvent.setup();
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
    expect(screen.getByText(selectedItem.label)).toBeVisible();
    expect(inputField).toHaveValue('');
    await user.click(screen.getByText(selectedItem.label));
    expect(inputField).toHaveFocus();
    expect(inputField).toHaveAttribute('placeholder', selectedItem.label);
    expect(onChange).not.toHaveBeenCalled();
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

    await user.tab();
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
    onChange.mockClear();

    // close on esc
    await user.keyboard('{Escape}');
    expect(dropdownList).not.toBeVisible();
    expect(inputField).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();

    // open on type
    await user.keyboard('{b}');
    expect(dropdownList).toBeVisible();
    await user.keyboard('{Escape}');

    // down arrow opens list
    await user.keyboard('{ArrowDown}');
    expect(dropdownList).toBeVisible();

    // close on tab
    await user.tab();
    expect(dropdownList).not.toBeVisible();
    expect(inputField).not.toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
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

    await user.keyboard('{b}');

    await waitFor(() => screen.getByRole('option', { name: 'Bergen' }), {
      timeout: 3000,
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

  test('recovers from an unmatched search and selects a restored result', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
        noMatchesText="No matching cities"
      />,
    );

    const inputField = screen.getByRole('combobox', { name: 'test label' });
    await user.type(inputField, 'unknown city');
    expect(screen.getByText('No matching cities')).toBeVisible();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    await user.clear(inputField);
    expect(screen.queryByText('No matching cities')).not.toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(testItems.length);

    await user.type(inputField, 'BER');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: 'Bergen' })).toBeVisible();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ label: 'Bergen', value: 'Bergen' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
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

  describe('aria-invalid', () => {
    test.each(['negative', 'error'] as const)(
      'is true for %s variant',
      variant => {
        render(
          <SearchableDropdown
            label="test label"
            items={testItems}
            selectedItem={null}
            onChange={() => undefined}
            variant={variant}
          />,
        );

        expect(
          screen.getByRole('combobox', { name: 'test label' }),
        ).toHaveAttribute('aria-invalid', 'true');
      },
    );

    test('is false for warning variant', () => {
      render(
        <SearchableDropdown
          label="test label"
          items={testItems}
          selectedItem={null}
          onChange={() => undefined}
          variant="warning"
        />,
      );

      expect(
        screen.getByRole('combobox', { name: 'test label' }),
      ).toHaveAttribute('aria-invalid', 'false');
    });
  });
  test('forwards className and style to the container and merges its own classes', () => {
    const { container } = render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        className="custom-class"
        style={{ marginTop: '7px' }}
      />,
    );
    const outer = container.firstElementChild;
    expect(outer).toHaveClass(
      'eds-dropdown',
      'eds-dropdown--searchable',
      'custom-class',
    );
    expect(outer).toHaveStyle({ marginTop: '7px' });
  });

  test('forwards rest props to the field wrapper and ref to the input', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        data-testid="field"
        ref={ref}
      />,
    );
    const combobox = screen.getByRole('combobox', { name: 'test label' });
    const field = screen.getByTestId('field');
    expect(field).toHaveClass('eds-form-control-wrapper');
    expect(field).toContainElement(combobox);
    expect(ref.current).toBe(combobox);
  });

  test('applies listStyle to the list', async () => {
    const user = userEvent.setup();
    render(
      <SearchableDropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        listStyle={{ color: 'pink' }}
      />,
    );
    await user.click(screen.getByRole('combobox', { name: 'test label' }));
    expect(screen.getByRole('listbox')).toHaveStyle({ color: 'pink' });
  });
});
