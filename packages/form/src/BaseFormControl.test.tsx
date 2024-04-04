import React from 'react';
import { render } from '@testing-library/react';
import { BaseFormControl } from './BaseFormControl';

test('renders a nice looking component', () => {
  const { getByTestId } = render(
    <BaseFormControl label="test" labelId="testId">
      <input data-testid="input" />
    </BaseFormControl>,
  );

  expect(getByTestId('input')).toBeInTheDocument();
});

test('renders variants correctly', () => {
  const { getByTestId, rerender } = render(
    <BaseFormControl
      label="test"
      labelId="testId"
      variant="negative"
      data-testid="wrapper"
    >
      <input />
    </BaseFormControl>,
  );

  let wrapper = getByTestId('wrapper');
  expect(wrapper).toHaveClass('eds-form-control-wrapper--negative');
  expect(wrapper).not.toHaveClass('eds-form-control-wrapper--success');

  rerender(
    <BaseFormControl
      label="test"
      labelId="testId"
      variant="success"
      data-testid="wrapper"
    >
      <input />
    </BaseFormControl>,
  );

  wrapper = getByTestId('wrapper');

  expect(wrapper).not.toHaveClass('eds-form-control-wrapper--negative');
  expect(wrapper).toHaveClass('eds-form-control-wrapper--success');

  rerender(
    <BaseFormControl label="test" labelId="testId" data-testid="wrapper">
      <input />
    </BaseFormControl>,
  );

  wrapper = getByTestId('wrapper');

  expect(wrapper).not.toHaveClass('eds-form-control-wrapper--negative');
  expect(wrapper).not.toHaveClass('eds-form-control-wrapper--success');

  rerender(
    <BaseFormControl
      label="test"
      labelId="testId"
      variant="success"
      data-testid="wrapper"
    >
      <input />
    </BaseFormControl>,
  );

  wrapper = getByTestId('wrapper');

  expect(wrapper).not.toHaveClass('eds-form-control-wrapper--negative');
  expect(wrapper).toHaveClass('eds-form-control-wrapper--success');

  rerender(
    <BaseFormControl
      label="test"
      labelId="testId"
      variant="negative"
      data-testid="wrapper"
    >
      <input />
    </BaseFormControl>,
  );

  wrapper = getByTestId('wrapper');

  expect(wrapper).toHaveClass('eds-form-control-wrapper--negative');
  expect(wrapper).not.toHaveClass('eds-form-control-wrapper--success');
});

test('renders prepend- and append-containers', () => {
  const { container, rerender } = render(
    <BaseFormControl label="test" labelId="testId">
      <input />
    </BaseFormControl>,
  );
  expect(
    container.querySelector('.eds-form-control__prepend'),
  ).not.toBeInTheDocument();

  expect(
    container.querySelector('.eds-form-control__append'),
  ).not.toBeInTheDocument();

  rerender(
    <BaseFormControl label="test" labelId="testId" prepend="Fra" append="kr">
      <input />
    </BaseFormControl>,
  );

  expect(
    container.querySelector('.eds-form-control__prepend'),
  ).toBeInTheDocument();

  expect(
    container.querySelector('.eds-form-control__append'),
  ).toBeInTheDocument();
});
