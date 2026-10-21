import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { CheckboxPanel, RadioPanel } from '.';
import { Fieldset, RadioGroup } from '..';
import { ExpandableText } from '@entur/expand';

expect.extend(toHaveNoViolations);

test('RadioPanel title selects its group value and follows controlled updates', async () => {
  const user = userEvent.setup();
  const spy = jest.fn();

  const { getByDisplayValue, rerender } = render(
    <RadioGroup
      name="city"
      label="Velg by"
      value="Oslo"
      onChange={e => spy(e.target.value)}
    >
      <RadioPanel title="Oslo" value="Oslo">
        Capital
      </RadioPanel>
      <RadioPanel title={<div>Bergen</div>} value="Bergen">
        Coastal city
      </RadioPanel>
    </RadioGroup>,
  );

  const firstOption = getByDisplayValue('Oslo');
  const secondOption = getByDisplayValue('Bergen');

  expect(firstOption).toHaveProperty('checked', true);
  expect(secondOption).toHaveProperty('checked', false);

  await user.click(screen.getByText('Bergen'));

  expect(spy.mock.calls).toEqual([['Bergen']]);
  expect(secondOption).not.toBeChecked();

  rerender(
    <RadioGroup name="city" label="Velg by" value="Bergen" onChange={spy}>
      <RadioPanel title="Oslo" value="Oslo">
        Oslo
      </RadioPanel>
      <RadioPanel title="Bergen" value="Bergen">
        Bergen
      </RadioPanel>
    </RadioGroup>,
  );

  expect(firstOption).toHaveProperty('checked', false);
  expect(secondOption).toHaveProperty('checked', true);
});

test('RadioPanel includes the secondary label in its name and content in its description', () => {
  render(
    <RadioGroup name="city" label="Velg by" value="Oslo" onChange={jest.fn()}>
      <RadioPanel title="Oslo" value="Oslo" secondaryLabel="99 kroner">
        Gjelder i Oslo.
      </RadioPanel>
    </RadioGroup>,
  );
  expect(
    screen.getByRole('radio', { name: 'Oslo 99 kroner' }),
  ).toHaveAccessibleDescription('Gjelder i Oslo.');
});

test.each([true, false])(
  'CheckboxPanel remains a single keyboard stop with hideCheckbox=%s',
  async hideCheckbox => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <>
        <CheckboxPanel
          title="Oslo"
          value="Oslo"
          hideCheckbox={hideCheckbox}
          onChange={e => onChange(e.target.checked)}
        />
        <button>Continue</button>
      </>,
    );
    expect(screen.getAllByRole('checkbox')).toHaveLength(1);
    const input = screen.getByRole('checkbox', { name: 'Oslo' });
    await user.tab();
    expect(input).toHaveFocus();
    await user.keyboard(' ');
    expect(input).toBeChecked();
    await user.click(screen.getByText('Oslo'));
    expect(input).not.toBeChecked();
    expect(onChange.mock.calls).toEqual([[true], [false]]);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
  },
);

test.each([true, false])(
  'RadioPanel group navigates with hideRadioButton=%s',
  async hideRadioButton => {
    const user = userEvent.setup();
    function Cities() {
      const [city, setCity] = React.useState('Oslo');
      return (
        <>
          <RadioGroup
            name="city"
            label="Velg by"
            value={city}
            onChange={e => setCity(e.target.value)}
          >
            <RadioPanel
              title="Oslo"
              value="Oslo"
              hideRadioButton={hideRadioButton}
            />
            <RadioPanel
              title="Bergen"
              value="Bergen"
              disabled
              hideRadioButton={hideRadioButton}
            />
            <RadioPanel
              title="Voss"
              value="Voss"
              hideRadioButton={hideRadioButton}
            />
          </RadioGroup>
          <button>Continue</button>
        </>
      );
    }
    render(<Cities />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Oslo' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Voss' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Voss' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Oslo' })).not.toBeChecked();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
  },
);

test.each(['radio', 'checkbox'] as const)(
  '%s panel expandable content is operable without selecting the panel',
  async role => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const Panel = role === 'radio' ? RadioPanel : CheckboxPanel;
    render(
      <RadioGroup name="city" label="Velg by" value={null} onChange={onChange}>
        <Panel title="Bergen" value="Bergen" onChange={onChange}>
          <ExpandableText title="Se mer info">Mye regn</ExpandableText>
        </Panel>
      </RadioGroup>,
    );
    await user.click(screen.getByRole('button', { name: 'Se mer info' }));
    expect(screen.getByText('Mye regn')).toBeVisible();
    expect(screen.getByRole(role, { name: 'Bergen' })).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  },
);

test('RadioPanel and CheckboxPanel content is interactable', async () => {
  const user = userEvent.setup();

  const spy = jest.fn();
  const spyRadio = jest.fn();
  const spyCheckbox = jest.fn();

  const { getByRole } = render(
    <div>
      <RadioGroup name="test" label="test" value={null} onChange={spy}>
        <RadioPanel title="test1" value="test1">
          <button aria-label="radio-test" onClick={spyRadio}>
            radioPanel button
          </button>
        </RadioPanel>
      </RadioGroup>
      <Fieldset>
        <CheckboxPanel title="Oslo" value="Oslo" onChange={spy}>
          <button aria-label="checkbox-test" onClick={spyCheckbox}>
            checkboxPanel button
          </button>
        </CheckboxPanel>
      </Fieldset>
    </div>,
  );

  const radioPanelButton = getByRole('button', { name: /radio-test/i });
  const checkboxPanelButton = getByRole('button', { name: /checkbox-test/i });

  await user.click(radioPanelButton);
  await user.click(checkboxPanelButton);

  expect(spyRadio).toHaveBeenCalledTimes(1);
  expect(spyCheckbox).toHaveBeenCalledTimes(1);
  expect(spy).not.toHaveBeenCalled();
  expect(screen.getByRole('radio', { name: 'test1' })).not.toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Oslo' })).not.toBeChecked();
});

test.each(['radio', 'checkbox'] as const)(
  'disabled %s panel ignores label clicks and Tab skips it',
  async role => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const Panel = role === 'radio' ? RadioPanel : CheckboxPanel;
    render(
      <>
        <RadioGroup
          name="city"
          label="Velg by"
          value={null}
          onChange={onChange}
          disabled
        >
          <Panel
            title="Oslo"
            value="Oslo"
            disabled={role === 'checkbox' ? true : undefined}
            onChange={onChange}
          />
        </RadioGroup>
        <button>Continue</button>
      </>,
    );
    await user.click(screen.getByText('Oslo'));
    await user.tab();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
    expect(screen.getByRole(role, { name: 'Oslo' })).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  },
);

test.each(['radio', 'checkbox'] as const)(
  'readOnly %s panel rejects mouse and keyboard changes',
  async role => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const Panel = role === 'radio' ? RadioPanel : CheckboxPanel;
    render(
      <RadioGroup
        name="city"
        label="Velg by"
        value={null}
        onChange={onChange}
        readOnly
      >
        <Panel
          title="Oslo"
          value="Oslo"
          readOnly={role === 'checkbox' ? true : undefined}
          onChange={onChange}
        />
      </RadioGroup>,
    );
    await user.click(screen.getByText('Oslo'));
    const input = screen.getByRole(role, { name: 'Oslo' });
    expect(input).toHaveFocus();
    await user.keyboard(' ');
    expect(input).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  },
);

test('RadioPanel should not have basic accessibility issues', async () => {
  const spy = jest.fn();
  const { container } = render(
    <RadioGroup name="city" label="Velg by" value="Bergen" onChange={spy}>
      <RadioPanel title="Oslo" value="Oslo" />
      <RadioPanel title="Bergen" value="Bergen" />
    </RadioGroup>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('CheckboxPanel should not have basic accessibility issues', async () => {
  const spy = jest.fn();
  const { container } = render(
    <Fieldset name="city" label="Velg by" onChange={spy}>
      <CheckboxPanel title="Oslo" value="Oslo" />
      <CheckboxPanel title="Bergen" value="Bergen" />
    </Fieldset>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('RadioPanel announces readOnly state via a hidden description', () => {
  const spy = jest.fn();

  const { getByDisplayValue, rerender } = render(
    <RadioGroup name="city" label="Velg by" value="Oslo" onChange={spy}>
      <RadioPanel title="Oslo" value="Oslo" />
    </RadioGroup>,
  );
  expect(getByDisplayValue('Oslo')).toHaveAccessibleName('Oslo');
  expect(getByDisplayValue('Oslo')).toHaveAccessibleDescription('');

  rerender(
    <RadioGroup
      name="city"
      label="Velg by"
      value="Oslo"
      onChange={spy}
      readOnly
    >
      <RadioPanel title="Oslo" value="Oslo" />
    </RadioGroup>,
  );
  const input = getByDisplayValue('Oslo');
  // readOnly must not change the accessible name - only add a description
  expect(input).toHaveAccessibleName('Oslo');
  expect(input).toHaveAccessibleDescription('Kan ikke endres');
});

test('CheckboxPanel announces readOnly state via a hidden description', () => {
  const { getByDisplayValue, rerender } = render(
    <Fieldset>
      <CheckboxPanel title="Oslo" value="Oslo" />
    </Fieldset>,
  );
  expect(getByDisplayValue('Oslo')).toHaveAccessibleName('Oslo');
  expect(getByDisplayValue('Oslo')).toHaveAccessibleDescription('');

  rerender(
    <Fieldset>
      <CheckboxPanel title="Oslo" value="Oslo" readOnly />
    </Fieldset>,
  );
  const input = getByDisplayValue('Oslo');
  expect(input).toHaveAccessibleName('Oslo');
  expect(input).toHaveAccessibleDescription('Kan ikke endres');
});

test('RadioPanel and CheckboxPanel use readOnlyLabelDescription as the readOnly description', () => {
  const { getByDisplayValue } = render(
    <>
      <RadioGroup name="city" label="Velg by" value="Oslo" onChange={jest.fn()}>
        <RadioPanel
          title="Oslo"
          value="Oslo"
          readOnly
          readOnlyLabelDescription="Read only"
        />
      </RadioGroup>
      <Fieldset>
        <CheckboxPanel
          title="Bergen"
          value="Bergen"
          readOnly
          readOnlyLabelDescription="Read only"
        />
      </Fieldset>
    </>,
  );
  expect(getByDisplayValue('Oslo')).toHaveAccessibleDescription('Read only');
  expect(getByDisplayValue('Bergen')).toHaveAccessibleDescription('Read only');
});

test('CheckboxPanel includes secondaryLabel in its accessible name', () => {
  const { getByDisplayValue } = render(
    <Fieldset>
      <CheckboxPanel title="Standard billett" value="a" secondaryLabel="299 kr">
        Oslo
      </CheckboxPanel>
    </Fieldset>,
  );
  expect(getByDisplayValue('a')).toHaveAccessibleName(
    'Standard billett 299 kr',
  );
});

test('CheckboxPanel exposes additional content as a description, not as part of its accessible name', () => {
  const { getByDisplayValue } = render(
    <Fieldset>
      <CheckboxPanel title="Standard billett" value="a">
        Gjelder i hele Oslo-regionen.
      </CheckboxPanel>
    </Fieldset>,
  );
  const input = getByDisplayValue('a');
  expect(input).toHaveAccessibleName('Standard billett');
  expect(input).toHaveAccessibleDescription('Gjelder i hele Oslo-regionen.');
});

test('CheckboxPanel with both readOnly and additional content describes both', () => {
  const { getByDisplayValue } = render(
    <Fieldset>
      <CheckboxPanel title="Standard billett" value="a" readOnly>
        Gjelder i hele Oslo-regionen.
      </CheckboxPanel>
    </Fieldset>,
  );
  expect(getByDisplayValue('a')).toHaveAccessibleDescription(
    'Gjelder i hele Oslo-regionen. Kan ikke endres',
  );
});

test('CheckboxPanel correctly names itself from a non-string (JSX) title', () => {
  const { getByDisplayValue, queryByText } = render(
    <Fieldset>
      <CheckboxPanel title={<div>Bergen</div>} value="a">
        Mye regn
      </CheckboxPanel>
    </Fieldset>,
  );
  expect(getByDisplayValue('a')).toHaveAccessibleName('Bergen');
  expect(queryByText('Bergen')).toBeVisible();
});

test('CheckboxPanel correctly includes a non-string (JSX) secondaryLabel in its accessible name', () => {
  const { getByDisplayValue } = render(
    <Fieldset>
      <CheckboxPanel
        title="Standard billett"
        value="a"
        secondaryLabel={<strong>299 kr</strong>}
      >
        Oslo
      </CheckboxPanel>
    </Fieldset>,
  );
  expect(getByDisplayValue('a')).toHaveAccessibleName(
    'Standard billett 299 kr',
  );
});

test('CheckboxPanel honors a consumer-provided aria-label over the generated name', () => {
  const { getByDisplayValue } = render(
    <Fieldset>
      <CheckboxPanel title="Standard billett" value="a" aria-label="Custom">
        Oslo
      </CheckboxPanel>
    </Fieldset>,
  );
  expect(getByDisplayValue('a')).toHaveAccessibleName('Custom');
});

test('CheckboxPanel honors a consumer-provided aria-labelledby over the generated name', () => {
  const { getByDisplayValue } = render(
    <Fieldset>
      <span id="external-label">Ekstern tittel</span>
      <CheckboxPanel
        title="Standard billett"
        value="a"
        aria-labelledby="external-label"
      >
        Oslo
      </CheckboxPanel>
    </Fieldset>,
  );
  expect(getByDisplayValue('a')).toHaveAccessibleName('Ekstern tittel');
});

test('CheckboxPanel appends its generated descriptions to a consumer-provided aria-describedby', () => {
  const { getByDisplayValue } = render(
    <Fieldset>
      <span id="external-help">Ekstern hjelp</span>
      <CheckboxPanel
        title="Standard billett"
        value="a"
        readOnly
        aria-describedby="external-help"
      >
        Gjelder i hele Oslo-regionen.
      </CheckboxPanel>
    </Fieldset>,
  );
  expect(getByDisplayValue('a')).toHaveAccessibleDescription(
    'Ekstern hjelp Gjelder i hele Oslo-regionen. Kan ikke endres',
  );
});

test.each([
  ['radio', false, 2],
  ['radio', true, 1],
  ['checkbox', false, 2],
  ['checkbox', true, 1],
] as const)(
  '%s panel renders its decorative indicator unless hidden (hide=%s)',
  (role, hide, count) => {
    render(
      <RadioGroup name="city" label="Velg by" value={null} onChange={jest.fn()}>
        {role === 'radio' ? (
          <RadioPanel title="Oslo" value="Oslo" hideRadioButton={hide} />
        ) : (
          <CheckboxPanel title="Oslo" value="Oslo" hideCheckbox={hide} />
        )}
      </RadioGroup>,
    );
    expect(screen.getAllByRole(role)).toHaveLength(1);
    expect(screen.getAllByRole(role, { hidden: true })).toHaveLength(count);
  },
);

test.each(['radio', 'checkbox'] as const)(
  '%s panel forwards className, style and size to the panel and rest props and ref to the input',
  role => {
    const ref = React.createRef<HTMLInputElement>();
    const Panel = role === 'radio' ? RadioPanel : CheckboxPanel;
    render(
      <RadioGroup name="city" label="Velg by" value={null} onChange={jest.fn()}>
        <Panel
          title="Oslo"
          value="Oslo"
          size="large"
          className="consumer-class"
          style={{ marginTop: '7px' }}
          data-consumer="value"
          ref={ref}
        />
      </RadioGroup>,
    );
    const panel = screen
      .getByText('Oslo')
      .closest('.eds-input-panel__container');
    expect(panel).toHaveClass('consumer-class', 'eds-input-panel--large');
    expect(panel).toHaveStyle({ marginTop: '7px' });
    const input = screen.getByRole(role, { name: 'Oslo' });
    expect(input).toHaveAttribute('data-consumer', 'value');
    expect(ref.current).toBe(input);
  },
);

test.each([
  ['disabled', 'eds-input-panel--disabled'],
  ['readOnly', 'eds-input-panel--readonly'],
] as const)('%s sets the %s modifier on the panel label', (prop, modifier) => {
  const { rerender } = render(<CheckboxPanel title="Oslo" value="Oslo" />);
  const label = screen.getByText('Oslo').closest('label');
  expect(label).toHaveClass('eds-input-panel');
  expect(label).not.toHaveClass(modifier);
  rerender(<CheckboxPanel title="Oslo" value="Oslo" {...{ [prop]: true }} />);
  expect(label).toHaveClass(modifier);
});
