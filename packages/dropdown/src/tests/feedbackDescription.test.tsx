import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown, MultiSelect, NativeDropdown, SearchableDropdown } from '..';

const items = [
  { label: 'Oslo', value: 'osl' },
  { label: 'Bergen', value: 'bgo' },
];

const dropdowns: [string, (props: Record<string, unknown>) => JSX.Element][] = [
  [
    'Dropdown',
    props => (
      <Dropdown
        label="City"
        items={items}
        selectedItem={null}
        onChange={() => undefined}
        {...props}
      />
    ),
  ],
  [
    'NativeDropdown',
    props => <NativeDropdown label="City" items={items} {...props} />,
  ],
  [
    'SearchableDropdown',
    props => (
      <SearchableDropdown
        label="City"
        items={items}
        selectedItem={null}
        onChange={() => undefined}
        {...props}
      />
    ),
  ],
  [
    'MultiSelect',
    props => (
      <MultiSelect
        label="City"
        items={items}
        selectedItems={[]}
        onChange={() => undefined}
        {...props}
      />
    ),
  ],
];

test.each(dropdowns)(
  '%s is described by its feedback text while the feedback is shown',
  (_, renderDropdown) => {
    const { rerender } = render(
      renderDropdown({ variant: 'negative', feedback: 'Choose a city' }),
    );
    const field = screen.getByRole('combobox', { name: /^City/ });
    expect(field).toHaveAccessibleDescription('Choose a city');

    rerender(renderDropdown({}));
    expect(field).toHaveAccessibleDescription('');
  },
);

test.each(dropdowns)(
  '%s keeps a consumer aria-describedby next to the feedback text',
  (_, renderDropdown) => {
    render(
      <>
        <p id="city-hint">Where you travel from</p>
        {renderDropdown({
          variant: 'negative',
          feedback: 'Choose a city',
          'aria-describedby': 'city-hint',
        })}
      </>,
    );
    expect(
      screen.getByRole('combobox', { name: /^City/ }),
    ).toHaveAccessibleDescription('Where you travel from Choose a city');
  },
);

test('read-only SearchableDropdown describes its focusable selected item', async () => {
  const user = userEvent.setup();
  render(
    <SearchableDropdown
      label="City"
      items={items}
      selectedItem={items[0]}
      onChange={() => undefined}
      readOnly
      variant="negative"
      feedback="Choose a city"
    />,
  );
  await user.tab();
  expect(document.activeElement).toHaveAccessibleDescription('Choose a city');
});
