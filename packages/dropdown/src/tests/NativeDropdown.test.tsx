import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NativeDropdown, NormalizedDropdownItemType } from '..';

describe('NativeDropdown', () => {
  const items = [
    { label: 'Oslo', value: 'osl' },
    { label: 'Bergen', value: 'bgo' },
  ];

  test('reports the selected item and native target, then reflects a controlled update', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { rerender } = render(
      <NativeDropdown
        label="City"
        items={items}
        selectedItem={items[0]}
        onChange={onChange}
      />,
    );
    const select = screen.getByRole('combobox', { name: 'City' });
    expect(select).toHaveValue('osl');

    await user.selectOptions(
      select,
      screen.getByRole('option', { name: 'Bergen' }),
    );
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      value: 'bgo',
      selectedItem: items[1],
      target: select,
    });
    expect(select).toHaveValue('osl');

    rerender(
      <NativeDropdown
        label="City"
        items={items}
        selectedItem={items[1]}
        onChange={onChange}
      />,
    );
    expect(select).toHaveValue('bgo');
    expect(
      screen.getByRole('option', { name: 'Bergen', selected: true }),
    ).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('value takes precedence over selectedItem without emitting a change', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <NativeDropdown
        label="City"
        items={items}
        selectedItem={items[0]}
        value="bgo"
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('combobox', { name: 'City' })).toHaveValue('bgo');

    rerender(
      <NativeDropdown
        label="City"
        items={items}
        selectedItem={items[0]}
        value="osl"
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('combobox', { name: 'City' })).toHaveValue('osl');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('uncontrolled selection is submitted using the option value', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <form
        aria-label="Journey"
        onSubmit={event => {
          event.preventDefault();
          onSubmit(new FormData(event.currentTarget).get('city'));
        }}
      >
        <NativeDropdown label="City" name="city" items={items} />
        <button type="submit">Continue</button>
      </form>,
    );
    await user.tab();
    const select = screen.getByRole('combobox', { name: 'City' });
    expect(select).toHaveFocus();
    await user.selectOptions(select, 'bgo');
    expect(select).toHaveValue('bgo');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('bgo');
  });

  test.each(['disabled', 'readOnly'] as const)(
    '%s prevents selection and is skipped by keyboard navigation',
    async mode => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <>
          <NativeDropdown
            label="City"
            items={items}
            selectedItem={items[0]}
            onChange={onChange}
            {...{ [mode]: true }}
          />
          <button>Continue</button>
        </>,
      );
      const select = screen.getByRole('combobox', { name: /^City/ });
      expect(select).toBeDisabled();
      await user.selectOptions(select, 'bgo');
      expect(select).toHaveValue('osl');
      await user.tab();
      expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
      expect(onChange).not.toHaveBeenCalled();
    },
  );

  test('announces loading until asynchronous options become available', async () => {
    let resolveItems!: (items: NormalizedDropdownItemType<string>[]) => void;
    const pendingItems = new Promise<NormalizedDropdownItemType<string>[]>(
      resolve => {
        resolveItems = resolve;
      },
    );
    render(
      <NativeDropdown
        label="City"
        items={() => pendingItems}
        loadingText="Loading cities"
      />,
    );

    expect(await screen.findByLabelText('Loading cities')).toBeInTheDocument();
    const select = screen.getByRole('combobox', { name: 'City' });
    expect(select).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    await act(async () => resolveItems(items));
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByRole('option', { name: 'Bergen' })).toHaveValue('bgo');
    expect(select).toHaveAttribute('aria-busy', 'false');
    expect(screen.queryByLabelText('Loading cities')).not.toBeInTheDocument();
  });

  // Bug: NativeDropdown compares numeric item.value to the select's string value,
  // so onChange reports selectedItem: null for a supported numeric item.
  test.failing(
    'returns the normalized item when its value is numeric',
    async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      const numericItems = [
        { label: 'Oslo', value: 1 },
        { label: 'Bergen', value: 2 },
      ];
      render(
        <NativeDropdown
          label="City"
          items={numericItems}
          onChange={onChange}
        />,
      );
      const select = screen.getByRole('combobox', { name: 'City' });
      await user.selectOptions(select, '2');
      expect(onChange).toHaveBeenCalledWith({
        value: '2',
        selectedItem: numericItems[1],
        target: select,
      });
    },
  );

  test('forwards className and style to the container and rest props and ref to the select', () => {
    const ref = React.createRef<HTMLSelectElement>();
    const { container } = render(
      <NativeDropdown
        label="City"
        items={['Oslo', 'Bergen']}
        className="custom-class"
        style={{ marginTop: '7px' }}
        data-consumer="value"
        ref={ref}
      />,
    );
    const outer = container.firstElementChild;
    expect(outer).toHaveClass('custom-class');
    expect(outer).toHaveStyle({ marginTop: '7px' });
    const select = screen.getByRole('combobox', { name: 'City' });
    expect(select).toHaveAttribute('data-consumer', 'value');
    expect(ref.current).toBe(select);
  });
});
