import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Radio, RadioGroup } from './';

test('Radiobuttons renders inside a radiogroup, and state of radiobuttons is handled correctly', () => {
  const groupName = 'radioGroupName';
  const groupLabel = 'radioGroupLabel';
  const spy = jest.fn();
  const spyChange = jest.fn();
  const radioGroupId = 'Gruppe';
  const radio1 = 'radio1';
  const radio2 = 'radio2';
  const { getByTestId, rerender } = render(
    <RadioGroup
      name={groupName}
      label={groupLabel}
      value="Oslo"
      onChange={spyChange}
      data-testid={radioGroupId}
    >
      <Radio label="Oslo" value="Oslo" onClick={spy} data-testid={radio1} />
      <Radio label="Bergen" value="Bergen" data-testid={radio2} />
    </RadioGroup>,
  );

  const radioTest1 = getByTestId(radio1);
  const radioTest2 = getByTestId(radio2);

  fireEvent.click(radioTest1);
  expect(spy).toHaveBeenCalled;
  expect(radioTest1).toHaveProperty('checked', true);

  rerender(
    <RadioGroup
      name={groupName}
      label={groupLabel}
      value="Bergen"
      onChange={spyChange}
      data-testid={radioGroupId}
    >
      <Radio label="Oslo" value="Oslo" onClick={spy} data-testid={radio1} />
      <Radio label="Bergen" value="Bergen" data-testid={radio2} />
    </RadioGroup>,
  );
  fireEvent.click(radioTest2);
  expect(radioTest1).toHaveProperty('checked', false);
  expect(radioTest2).toHaveProperty('checked', true);
});
