import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Dropdown, DropdownItemType } from '..';

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
    const MockIcon = () => <svg />;
    const mixedItems = [
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

    expect(screen.getAllByRole('option')).toHaveLength(testItems.length);
  });

  test('works with items as an asynchronous function', async () => {
    const user = userEvent.setup();
    const asyncItems = () => {
      return new Promise<DropdownItemType[]>(resolve => {
        setTimeout(() => resolve(testItems), 1000);
      });
    };
    render(
      <Dropdown label="test label" items={asyncItems} selectedItem={null} />,
    );

    const toggleButton = screen.getByRole('combobox', { name: 'test label' });
    await user.click(toggleButton);

    await waitFor(() => screen.getAllByRole('option'));

    expect(screen.getAllByRole('option')).toHaveLength(testItems.length);
  });

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

  test('applies className to eds-dropdown__wrapper element', () => {
    const { container } = render(
      <Dropdown
        label="test label"
        items={testItems}
        selectedItem={null}
        className="custom-class"
      />,
    );

    const edsDropdownElement = container.getElementsByClassName(
      'eds-dropdown__wrapper',
    )[0];
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
