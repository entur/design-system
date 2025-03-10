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

  test('is displayed with label', () => {
    render(
      <Dropdown label="test label" items={testItems} selectedItem={null} />,
    );

    expect(screen.queryAllByLabelText('test label')[0]).toBeInTheDocument();
  });

  test('can select element with mouse', async () => {
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

    const menuItemOslo = screen.getByRole('option', { name: 'Oslo' });
    await user.click(menuItemOslo);

    expect(onChange).toHaveBeenCalledWith({
      value: 'Oslo',
      label: 'Oslo',
    });
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

    const toggleButton = screen.getByRole('combobox', { name: 'test label' });
    toggleButton.focus();
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
      <Dropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
      />,
    );

    screen.getByRole('combobox', { name: 'test label' }).focus();

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

    // close on esc
    await user.keyboard('{Enter}');
    expect(dropdownList).toBeVisible();
    await user.keyboard('{Escape}');
    expect(dropdownList).not.toBeVisible();

    // close on tab
    await user.keyboard('{Enter}');
    expect(dropdownList).toBeVisible();
    await user.keyboard('{Tab}');
    expect(dropdownList).not.toBeVisible();
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

  test('displays selected item', () => {
    const selectedItem = { label: 'selected', value: 'selected' };
    render(
      <Dropdown
        label="test label"
        items={testItems}
        selectedItem={selectedItem}
      />,
    );

    expect(screen.queryByText(selectedItem.label)).toBeInTheDocument();
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

  test('applies className to eds-dropdown element', () => {
    const { container } = render(
      <Dropdown
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
      <Dropdown
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
      <Dropdown
        label="test label"
        items={testItems}
        selectedItem={selectedItem}
      />,
    );

    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
