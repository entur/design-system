import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Dropdown, DropdownItemType, NormalizedDropdownItemType } from '..';

expect.extend(toHaveNoViolations);

describe('Dropdown', () => {
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

  test('reports mouse selection and displays the controlled update', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { rerender } = render(
      <Dropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
      />,
    );

    const toggleButton = screen.getByRole('combobox', { name: 'test label' });
    await user.click(toggleButton);

    const menuItemOslo = screen.getByRole('option', { name: 'Oslo' });
    await user.click(menuItemOslo);

    expect(onChange).toHaveBeenCalledWith({
      value: 'Oslo',
      label: 'Oslo',
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    rerender(
      <Dropdown
        label="test label"
        items={testItems}
        selectedItem={{ value: 'Oslo', label: 'Oslo' }}
        onChange={onChange}
      />,
    );
    expect(toggleButton).toHaveTextContent('Oslo');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('can select element with keyboard', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Dropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
      />,
    );

    await user.tab();
    await user.keyboard('{Enter}{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledWith({
      value: 'Kristiansund',
      label: 'Kristiansund',
    });
  });

  test('opens and closes visibly on click', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Dropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
      />,
    );

    const toggleButton = screen.getByRole('combobox', { name: 'test label' });

    await user.click(toggleButton);
    const dropdownList = screen.getByRole('listbox', { name: 'test label' });

    expect(dropdownList).toBeVisible();

    await user.click(document.body);

    expect(dropdownList).not.toBeVisible();
  });

  test('opens and closes visibly with keyboard', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <>
        <Dropdown
          label="test label"
          items={testItems}
          selectedItem={null}
          onChange={onChange}
        />
        <button>Continue</button>
      </>,
    );

    await user.tab();
    const combobox = screen.getByRole('combobox', { name: 'test label' });
    expect(combobox).toHaveFocus();

    await user.keyboard('{Enter}');
    const dropdownList = screen.getByRole('listbox', { name: 'test label' });

    // open and close on select with enter
    expect(dropdownList).toBeVisible();
    await user.keyboard('{Enter}');
    expect(dropdownList).not.toBeVisible();

    // open and close on select with space
    await user.keyboard('{ }');
    expect(dropdownList).toBeVisible();
    await user.keyboard('{ }');
    expect(dropdownList).not.toBeVisible();
    onChange.mockClear();

    // close on esc
    await user.keyboard('{Enter}');
    expect(dropdownList).toBeVisible();
    await user.keyboard('{Escape}');
    expect(dropdownList).not.toBeVisible();
    expect(combobox).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();

    // close on tab
    await user.keyboard('{Enter}');
    expect(dropdownList).toBeVisible();
    await user.tab();
    expect(dropdownList).not.toBeVisible();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('selects item with tab when selectOnTab is true', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Dropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
        selectOnTab={true}
      />,
    );

    const toggleButton = screen.getByRole('combobox', { name: 'test label' });

    toggleButton.focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{Tab}');

    expect(onChange).toBeCalledWith({ label: 'Oslo', value: 'Oslo' });
  });

  test('marks selected option as selected if set initially', async () => {
    const user = userEvent.setup();
    const normalizedItems: NormalizedDropdownItemType<string>[] = testItems.map(
      item => ({
        label: item,
        value: item,
      }),
    );

    const bergenItem = normalizedItems[1];

    const fn = jest.fn();

    render(
      <Dropdown
        label="test label"
        items={normalizedItems}
        selectedItem={bergenItem}
        onChange={fn}
      />,
    );

    // not changed yet
    expect(fn).not.toHaveBeenCalled();

    // not visible since not opened
    const item = screen.queryByRole('option', { selected: true });
    expect(item).not.toBeInTheDocument();

    const toggleButton = screen.getByRole('combobox', { name: 'test label' });
    expect(toggleButton).toHaveTextContent('Bergen');
    await user.click(toggleButton);

    const selectedOption = screen.getByRole('option', { selected: true });
    expect(selectedOption).toHaveTextContent('Bergen');

    // all others
    const otherOptions = screen.getAllByRole('option', { selected: false });
    expect(otherOptions).toHaveLength(normalizedItems.length - 1);
  });

  test('clearable button clears selected item', async () => {
    const user = userEvent.setup();
    const selectedItem = { label: 'selected', value: 'selected' };
    const onChange = jest.fn();
    render(
      <Dropdown
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
      <Dropdown
        label="test label"
        items={mixedItems}
        selectedItem={null}
        onChange={onChange}
      />,
    );

    screen.getByRole('combobox', { name: 'test label' }).focus();
    await user.keyboard('{Enter}');

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
      <Dropdown
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
      <Dropdown label="test label" items={asyncItems} selectedItem={null} />,
    );

    const toggleButton = screen.getByRole('combobox', { name: 'test label' });
    await user.click(toggleButton);

    const listItems = await screen.findAllByRole('option');

    expect(listItems).toHaveLength(testItems.length);
  }, 1500);

  test('highlights matched item on letter keydown', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <Dropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
      />,
    );

    const toggleButton = screen.getByRole('combobox', { name: 'test label' });
    toggleButton.focus();

    // Set highlighted item to first item that start with 's'
    await user.keyboard('{s}');
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith({
      value: 'Stavanger',
      label: 'Stavanger',
    });
  });

  test('disabled dropdown ignores clicks and is skipped by keyboard navigation', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <>
        <Dropdown
          label="test label"
          items={testItems}
          selectedItem={null}
          disabled
          onChange={onChange}
        />
        <button>Continue</button>
      </>,
    );

    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveAttribute('aria-disabled', 'true');
    await user.click(combobox);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
    await user.keyboard('{Enter}{ArrowDown}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('empty items show feedback and recover when choices become available', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { rerender } = render(
      <Dropdown
        label="test label"
        items={[]}
        selectedItem={null}
        onChange={onChange}
        noMatchesText="No cities available"
      />,
    );

    await user.click(screen.getByRole('combobox', { name: 'test label' }));
    expect(screen.getByText('No cities available')).toBeVisible();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).not.toHaveBeenCalled();

    rerender(
      <Dropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
        noMatchesText="No cities available"
      />,
    );
    await user.keyboard('{Escape}{Enter}');
    expect(screen.queryByText('No cities available')).not.toBeInTheDocument();
    await user.click(screen.getByRole('option', { name: 'Bergen' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      label: 'Bergen',
      value: 'Bergen',
    });
  });

  test('does not violate basic accessibility', async () => {
    const selectedItem = { label: 'choice1', value: 'choice1' };
    const { container } = render(
      <Dropdown
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
          <Dropdown
            label="test label"
            items={testItems}
            selectedItem={null}
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
        <Dropdown
          label="test label"
          items={testItems}
          selectedItem={null}
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
      <Dropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        className="custom-class"
        style={{ marginTop: '7px' }}
      />,
    );
    const outer = container.firstElementChild;
    expect(outer).toHaveClass('eds-dropdown', 'custom-class');
    expect(outer).toHaveStyle({ marginTop: '7px' });
  });

  test('forwards rest props to the field wrapper and ref to the combobox', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Dropdown
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
    expect(field).toBe(combobox);
    expect(ref.current).toBe(combobox);
  });

  test('applies listStyle to the list', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
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
