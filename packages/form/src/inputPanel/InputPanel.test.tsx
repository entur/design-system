import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { CheckboxPanel, RadioPanel } from '.';
import { Fieldset, RadioGroup } from '..';
import { ExpandableText } from '@entur/expand';

expect.extend(toHaveNoViolations);

test('RadioPanel sets checked value from RadioGroup correctly', () => {
  const spy = jest.fn();

  const { getByDisplayValue, rerender } = render(
    <RadioGroup name="city" label="Velg by" value="Oslo" onChange={spy}>
      <RadioPanel title="Oslo" value="Oslo">
        Oslo
      </RadioPanel>
      <RadioPanel title={<div>Bergen</div>} value="Bergen">
        Bergen
      </RadioPanel>
    </RadioGroup>,
  );

  const firstOption = getByDisplayValue('Oslo');
  const secondOption = getByDisplayValue('Bergen');

  expect(firstOption).toHaveProperty('checked', true);
  expect(secondOption).toHaveProperty('checked', false);

  fireEvent.click(secondOption);

  expect(spy).toHaveBeenCalled();

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

test('RadioPanel and Checkboxpanel shows secondaryLabel', () => {
  const spy = jest.fn();

  const { queryByText: queryRadioPanelByText } = render(
    <RadioGroup name="city" label="Velg by" value="Oslo" onChange={spy}>
      <RadioPanel title="Oslo" value="Oslo" secondaryLabel="99 kroner">
        Oslo
      </RadioPanel>
      <RadioPanel title="Bergen" value="Bergen">
        Bergen
      </RadioPanel>
    </RadioGroup>,
  );

  const { queryByText: queryCheckboxPanelByText } = render(
    <Fieldset>
      <CheckboxPanel title="Voss" value="Voss" secondaryLabel="49 kroner">
        Oslo
      </CheckboxPanel>
      <CheckboxPanel title="Nordfjordeid" value="Nordfjordeid">
        Bergen
      </CheckboxPanel>
    </Fieldset>,
  );

  const secondaryLabelRadio = queryRadioPanelByText('99 kroner');
  expect(secondaryLabelRadio).toBeVisible();
  const secondaryLabelCheckbox = queryCheckboxPanelByText('49 kroner');
  expect(secondaryLabelCheckbox).toBeVisible();
});

test('RadioPanel displays a radiobutton', () => {
  const spy = jest.fn();

  const { container } = render(
    <RadioGroup name="city" label="Velg by" value="Oslo" onChange={spy}>
      <RadioPanel title="Oslo" value="Oslo">
        Oslo
      </RadioPanel>
    </RadioGroup>,
  );

  const radioButton = container.getElementsByClassName(
    'eds-form-component--radio__container',
  );
  expect(radioButton.length).toBe(1);
  expect(radioButton[0]).toBeVisible();
});

test('CheckboxPanel displays a checkbox', () => {
  const { container } = render(
    <Fieldset>
      <CheckboxPanel title="Oslo" value="Oslo">
        Oslo
      </CheckboxPanel>
    </Fieldset>,
  );

  const checkbox = container.getElementsByClassName('eds-checkbox__container');
  expect(checkbox.length).toBe(1);
  expect(checkbox[0]).toBeVisible();
});

test('hideCheckbox correctly hides radiobutton and checkbox', () => {
  const spy = jest.fn();

  const { container: radioContainer } = render(
    <RadioGroup name="city" label="Velg Oslo" value="Oslo" onChange={spy}>
      <RadioPanel hideRadioButton title="Oslo" value="Oslo">
        Oslo
      </RadioPanel>
    </RadioGroup>,
  );

  const { container: checkboxContainer } = render(
    <Fieldset name="city" label="Velg Bergen" value="Bergen" onChange={spy}>
      <CheckboxPanel hideCheckbox title="Bergen" value="Bergen">
        Bergen
      </CheckboxPanel>
    </Fieldset>,
  );

  const radioButton = radioContainer.getElementsByClassName(
    'eds-form-component--radio__container',
  )[0];
  const checkbox = checkboxContainer.getElementsByClassName(
    'eds-checkbox__container',
  )[0];
  expect(radioButton).toBeUndefined();
  expect(checkbox).toBeUndefined();
});

test('RadioPanel and Checkboxpanel shows children content', () => {
  const spy = jest.fn();

  const { queryByText: queryRadioPanelByText } = render(
    <RadioGroup name="city" label="Velg by" value="Oslo" onChange={spy}>
      <RadioPanel title="Oslo" value="Oslo" secondaryLabel="99 kroner">
        Flott by
      </RadioPanel>
      <RadioPanel title="Bergen" value="Bergen">
        <ExpandableText defaultOpen title="Se mer info">
          Mye regn
        </ExpandableText>
      </RadioPanel>
    </RadioGroup>,
  );

  const { queryByText: queryCheckboxPanelByText } = render(
    <Fieldset>
      <CheckboxPanel title="Voss" value="Voss" secondaryLabel="49 kroner">
        Flott tettsted
      </CheckboxPanel>
      <CheckboxPanel title="Nordfjordeid" value="Nordfjordeid">
        <ExpandableText defaultOpen title="Se mer info">
          Fjord og fjell
        </ExpandableText>
      </CheckboxPanel>
    </Fieldset>,
  );

  const stringChildContentRadio = queryRadioPanelByText('Flott by');
  const complexChildContentRadio = queryRadioPanelByText('Mye regn');
  const stringChildContentCheckbox = queryCheckboxPanelByText('Flott tettsted');
  const complexChildContentCheckbox =
    queryCheckboxPanelByText('Fjord og fjell');
  expect(stringChildContentRadio).toBeVisible();
  expect(complexChildContentRadio).toBeVisible();
  expect(stringChildContentCheckbox).toBeVisible();
  expect(complexChildContentCheckbox).toBeVisible();
});

test('RadioPanel and CheckboxPanel content is interactable', async () => {
  const user = userEvent.setup();

  const spy = jest.fn();
  const spyRadio = jest.fn();
  const spyCheckbox = jest.fn();

  const { getByRole } = render(
    <div>
      <RadioGroup name="test" label="test" value="test1" onChange={spy}>
        <RadioPanel title="test1" value="test1">
          <button aria-label="radio-test" onClick={spyRadio}>
            radioPanel button
          </button>
        </RadioPanel>
      </RadioGroup>
      <Fieldset>
        <CheckboxPanel title="Oslo" value="Oslo">
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

  expect(spyRadio).toBeCalled();
  expect(spyCheckbox).toBeCalled();
});

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
