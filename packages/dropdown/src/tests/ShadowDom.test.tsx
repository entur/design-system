import React from 'react';
import { cleanup, fireEvent, render, within } from '@testing-library/react';
import { Dropdown, MultiSelect, SearchableDropdown } from '..';

/**
 * Simulates a realistic browser click: mousedown → mouseup → click.
 * In shadow DOM, mouseup/mousedown events that reach window-level listeners
 * have their target retargeted to the shadow host. This triggers downshift's
 * outside-click detection, which can close the dropdown prematurely.
 */
function realClick(element: Element) {
  fireEvent.mouseDown(element);
  fireEvent.mouseUp(element);
  fireEvent.click(element);
}

function createShadowDomContainer() {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const shadowRoot = host.attachShadow({ mode: 'open' });
  const container = document.createElement('div');
  shadowRoot.appendChild(container);
  return { host, container };
}

let host: HTMLDivElement;
let container: HTMLDivElement;

beforeEach(() => {
  ({ host, container } = createShadowDomContainer());
});

afterEach(() => {
  cleanup();
  document.body.removeChild(host);
});

const testItems = [
  { value: '1', label: 'Oslo' },
  { value: '2', label: 'Bergen' },
  { value: '3', label: 'Stavanger' },
];

describe('SearchableDropdown in shadow DOM', () => {
  function renderInShadow(
    props: Partial<React.ComponentProps<typeof SearchableDropdown>> = {},
  ) {
    const onChange = jest.fn();
    render(
      <SearchableDropdown
        label="Velg by"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
        {...props}
      />,
      { container },
    );
    return { view: within(container), onChange };
  }

  test('renders a combobox input', () => {
    const { view } = renderInShadow();
    expect(view.getByRole('combobox')).toBeTruthy();
  });

  test('shows options when opened', () => {
    const { view } = renderInShadow();
    realClick(view.getByRole('combobox'));
    expect(view.getAllByRole('option')).toHaveLength(testItems.length);
  });

  test('calls onChange when an item is selected', () => {
    const { view, onChange } = renderInShadow();
    realClick(view.getByRole('combobox'));
    realClick(view.getByRole('option', { name: /Bergen/ }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Bergen' }),
    );
  });

  test('calls onChange exactly once per selection', () => {
    const { view, onChange } = renderInShadow();
    realClick(view.getByRole('combobox'));
    realClick(view.getByRole('option', { name: /Stavanger/ }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('Dropdown in shadow DOM', () => {
  function renderInShadow(
    props: Partial<React.ComponentProps<typeof Dropdown>> = {},
  ) {
    const onChange = jest.fn();
    render(
      <Dropdown
        label="Velg by"
        items={testItems}
        selectedItem={null}
        onChange={onChange}
        {...props}
      />,
      { container },
    );
    return { view: within(container), onChange };
  }

  test('shows options when opened', () => {
    const { view } = renderInShadow();
    const toggleButton = view.getByRole('combobox');
    realClick(toggleButton);
    expect(view.getAllByRole('option')).toHaveLength(testItems.length);
  });

  test('calls onChange when an item is selected', () => {
    const { view, onChange } = renderInShadow();
    realClick(view.getByRole('combobox'));
    realClick(view.getByRole('option', { name: /Bergen/ }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Bergen' }),
    );
  });
});

describe('MultiSelect in shadow DOM', () => {
  function renderInShadow(
    props: Partial<React.ComponentProps<typeof MultiSelect>> = {},
  ) {
    const onChange = jest.fn();
    render(
      <MultiSelect
        label="Velg byer"
        items={testItems}
        selectedItems={[]}
        onChange={onChange}
        {...props}
      />,
      { container },
    );
    return { view: within(container), onChange };
  }

  test('shows options when opened', () => {
    const { view } = renderInShadow();
    realClick(view.getByRole('combobox'));
    // +1 for "Velg alle" item
    expect(view.getAllByRole('option').length).toBeGreaterThanOrEqual(
      testItems.length,
    );
  });

  test('calls onChange when an item is selected', () => {
    const { view, onChange } = renderInShadow();
    realClick(view.getByRole('combobox'));
    realClick(view.getByRole('option', { name: /Bergen/ }));
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ label: 'Bergen' })]),
    );
  });

  test('allows selecting multiple items in sequence', () => {
    const { view, onChange } = renderInShadow();
    realClick(view.getByRole('combobox'));
    realClick(view.getByRole('option', { name: /Oslo/ }));

    expect(onChange).toHaveBeenCalledTimes(1);

    realClick(view.getByRole('option', { name: /Bergen/ }));
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
