import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { BaseFormControl } from './BaseFormControl';
import { FormGroup } from './FormGroup';

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
      <input data-testid="input" />
    </BaseFormControl>,
  );

  const wrapper = getByTestId('wrapper');
  expect(wrapper).toHaveClass('entur-form-control-wrapper--error');
  expect(wrapper).not.toHaveClass('entur-form-control-wrapper--success');

  rerender(
    <BaseFormControl variant="success">
      <input data-testid="input" />
    </BaseFormControl>,
  );

  expect(wrapper).not.toHaveClass('entur-form-control-wrapper--error');
  expect(wrapper).toHaveClass('entur-form-control-wrapper--success');

  rerender(
    <BaseFormControl>
      <input data-testid="input" />
    </BaseFormControl>,
  );

  expect(wrapper).not.toHaveClass('entur-form-control-wrapper--error');
  expect(wrapper).not.toHaveClass('entur-form-control-wrapper--success');

  rerender(
    <FormGroup variant="success">
      <BaseFormControl>
        <input data-testid="input" />
      </BaseFormControl>
    </FormGroup>,
  );

  expect(wrapper).toHaveClass('entur-form-control-wrapper--error');
  expect(wrapper).not.toHaveClass('entur-form-control-wrapper--success');

  rerender(
    <FormGroup variant="success">
      <BaseFormControl variant="error">
        <input data-testid="input" />
      </BaseFormControl>
    </FormGroup>,
  );
});

test('renders prepend- and append-containers', () => {
  const { container, rerender } = render(
    <BaseFormControl>
      <input />
    </BaseFormControl>,
  );
  expect(
    container.querySelector('.entur-form-control__prepend'),
  ).not.toBeInTheDocument();

  expect(
    container.querySelector('.entur-form-control__append'),
  ).not.toBeInTheDocument();

  rerender(
    <BaseFormControl prepend="Fra" append="kr">
      <input />
    </BaseFormControl>,
  );

  expect(
    container.querySelector('.entur-form-control__prepend'),
  ).toBeInTheDocument();

  expect(
    container.querySelector('.entur-form-control__append'),
  ).toBeInTheDocument();
});
