import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Radio, RadioGroup } from './';

test('Radio buttons works nicely', () => {
  const spy = jest.fn();

  const { getByLabelText, rerender } = render(
    <RadioGroup name="city" label="Velg by" value="Oslo" onChange={spy}>
      <Radio value="Oslo">Oslo</Radio>
      <Radio value="Bergen">Bergen</Radio>
    </RadioGroup>,
  );

  const firstOption = getByLabelText('Oslo');
  const secondOption = getByLabelText('Bergen');

  expect(firstOption).toHaveProperty('checked', true);
  expect(secondOption).toHaveProperty('checked', false);

  fireEvent.click(secondOption);

  expect(spy).toHaveBeenCalled();

  rerender(
    <RadioGroup name="city" label="Velg by" value="Bergen" onChange={spy}>
      <Radio label="Oslo" value="Oslo">
        Oslo
      </Radio>
      <Radio label="Bergen" value="Bergen">
        Bergen
      </Radio>
    </RadioGroup>,
  );

  expect(firstOption).toHaveProperty('checked', false);
  expect(secondOption).toHaveProperty('checked', true);
});

test('Removes fieldset if label is not set', () => {
  const spy = jest.fn();

  const { getByLabelText, container, rerender } = render(
    <RadioGroup name="city" value="Oslo" onChange={spy}>
      <Radio value="Oslo">Oslo</Radio>
      <Radio value="Bergen">Bergen</Radio>
    </RadioGroup>,
  );
  expect(getByLabelText('Oslo')).toHaveProperty('checked', true);
  expect(container.nodeName).toBe('DIV');
  expect(container.firstChild!.nodeName).toBe('LABEL');
  rerender(
    <RadioGroup name="city" label="Velg by" value="Bergen" onChange={spy}>
      <Radio label="Oslo" value="Oslo">
        Oslo
      </Radio>
      <Radio label="Bergen" value="Bergen">
        Bergen
      </Radio>
    </RadioGroup>,
  );
  expect(container.firstChild!.nodeName).toBe('FIELDSET');
});
