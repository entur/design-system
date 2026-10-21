import { useState } from 'react';
import { cleanup, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dropdown,
  MultiSelect,
  NormalizedDropdownItemType,
  SearchableDropdown,
} from '..';

let host: HTMLDivElement;
let container: HTMLDivElement;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  const shadowRoot = host.attachShadow({ mode: 'open' });
  container = document.createElement('div');
  shadowRoot.appendChild(container);
});

afterEach(() => {
  cleanup();
  host.remove();
});

const testItems = [
  { value: '1', label: 'Oslo' },
  { value: '2', label: 'Bergen' },
  { value: '3', label: 'Stavanger' },
];

describe('shadow DOM pointer interactions', () => {
  test('SearchableDropdown selects once without treating the option click as an outside click', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SearchableDropdown
        label="Velg by"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
      />,
      { container },
    );
    const view = within(container);
    await user.click(view.getByRole('combobox', { name: 'Velg by' }));
    expect(view.getAllByRole('option')).toHaveLength(testItems.length);
    await user.click(view.getByRole('option', { name: 'Bergen' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(testItems[1]);
    expect(view.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('Dropdown selects once without treating the option click as an outside click', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Dropdown
        label="Velg by"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
      />,
      { container },
    );
    const view = within(container);
    await user.click(view.getByRole('combobox', { name: 'Velg by' }));
    expect(view.getAllByRole('option')).toHaveLength(testItems.length);
    await user.click(view.getByRole('option', { name: 'Bergen' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(testItems[1]);
    expect(view.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('MultiSelect keeps its list open for successive controlled selections', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    function Cities() {
      const [selectedItems, setSelectedItems] = useState<
        NormalizedDropdownItemType<string>[]
      >([]);
      return (
        <MultiSelect
          label="Velg byer"
          items={testItems}
          selectedItems={selectedItems}
          onChange={items => {
            onChange(items);
            setSelectedItems(items);
          }}
        />
      );
    }
    render(<Cities />, { container });
    const view = within(container);
    await user.click(view.getByRole('combobox', { name: 'Velg byer' }));
    expect(view.getAllByRole('option')).toHaveLength(testItems.length + 1);
    await user.click(view.getByRole('option', { name: 'Oslo' }));
    expect(onChange).toHaveBeenNthCalledWith(1, [testItems[0]]);
    expect(view.getByRole('listbox', { name: 'Velg byer' })).toBeVisible();
    await user.click(view.getByRole('option', { name: 'Bergen' }));
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(2, [testItems[0], testItems[1]]);
    expect(
      view.getByRole('option', { name: /Oslo/, selected: true }),
    ).toBeVisible();
    expect(
      view.getByRole('option', { name: /Bergen/, selected: true }),
    ).toBeVisible();
  });
});
