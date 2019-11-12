import React from 'react';
import { render } from '@testing-library/react';
import { BaseFormControl } from './BaseFormControl';
import { InputGroup } from './InputGroup';

test('renders a nice looking component', () => {
  const { getByTestId } = render(
    <BaseFormControl>
      <input data-testid="input" />
    </BaseFormControl>,
  );

  expect(getByTestId('input')).toBeInTheDocument();
});

test('renders variants correctly', () => {
  const { getByTestId, rerender } = render(
    <BaseFormControl variant="error" data-testid="wrapper">
      <input />
    </BaseFormControl>,
  );

  let wrapper = getByTestId('wrapper');
  expect(wrapper).toHaveClass('eds-form-control-wrapper--error');
  expect(wrapper).not.toHaveClass('eds-form-control-wrapper--success');

  rerender(
    <BaseFormControl variant="success" data-testid="wrapper">
      <input />
    </BaseFormControl>,
  );

  wrapper = getByTestId('wrapper');

  expect(wrapper).not.toHaveClass('eds-form-control-wrapper--error');
  expect(wrapper).toHaveClass('eds-form-control-wrapper--success');

  rerender(
    <BaseFormControl data-testid="wrapper">
      <input />
    </BaseFormControl>,
  );

  wrapper = getByTestId('wrapper');

  expect(wrapper).not.toHaveClass('eds-form-control-wrapper--error');
  expect(wrapper).not.toHaveClass('eds-form-control-wrapper--success');

  rerender(
    <InputGroup variant="success">
      <BaseFormControl data-testid="wrapper">
        <input />
      </BaseFormControl>
    </InputGroup>,
  );

  wrapper = getByTestId('wrapper');

  expect(wrapper).not.toHaveClass('eds-form-control-wrapper--error');
  expect(wrapper).toHaveClass('eds-form-control-wrapper--success');

  rerender(
    <InputGroup variant="success">
      <BaseFormControl variant="error" data-testid="wrapper">
        <input />
      </BaseFormControl>
    </InputGroup>,
  );

  wrapper = getByTestId('wrapper');

  expect(wrapper).toHaveClass('eds-form-control-wrapper--error');
  expect(wrapper).not.toHaveClass('eds-form-control-wrapper--success');
});

test('renders prepend- and append-containers', () => {
  const { container, rerender } = render(
    <BaseFormControl>
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
    <BaseFormControl prepend="Fra" append="kr">
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
