import React from 'react';
import { render, screen } from '@testing-library/react';
import { BaseFormControl } from './BaseFormControl';

test('forwards className and style to the outer container', () => {
  const { container } = render(
    <BaseFormControl
      label="test"
      labelId="testId"
      className="consumer-class"
      style={{ marginTop: '7px' }}
    >
      <input />
    </BaseFormControl>,
  );
  const outer = container.firstElementChild;
  expect(outer).toHaveClass(
    'eds-form-control__field-and-feedback-text',
    'consumer-class',
  );
  expect(outer).toHaveStyle({ marginTop: '7px' });
});

test('forwards rest props and ref to the control wrapper', () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <BaseFormControl
      label="test"
      labelId="testId"
      data-testid="wrapper"
      ref={ref}
    >
      <input />
    </BaseFormControl>,
  );
  const wrapper = screen.getByTestId('wrapper');
  expect(wrapper).toHaveClass('eds-form-control-wrapper');
  expect(ref.current).toBe(wrapper);
});

test.each([
  ['negative', 'eds-form-control-wrapper--negative'],
  ['error', 'eds-form-control-wrapper--negative'],
  ['success', 'eds-form-control-wrapper--success'],
] as const)('variant %s sets the %s modifier', (variant, modifier) => {
  render(
    <BaseFormControl
      label="test"
      labelId="testId"
      variant={variant}
      data-testid="wrapper"
    >
      <input />
    </BaseFormControl>,
  );
  const wrapper = screen.getByTestId('wrapper');
  expect(wrapper).toHaveClass(modifier);
  expect(wrapper).not.toHaveClass(
    modifier === 'eds-form-control-wrapper--negative'
      ? 'eds-form-control-wrapper--success'
      : 'eds-form-control-wrapper--negative',
  );
});

test('sets size, disabled, readOnly and isFilled modifiers', () => {
  const { rerender } = render(
    <BaseFormControl label="test" labelId="testId" data-testid="wrapper">
      <input />
    </BaseFormControl>,
  );
  const wrapper = screen.getByTestId('wrapper');
  expect(wrapper).toHaveClass('eds-form-control-wrapper--size-medium');
  expect(wrapper).not.toHaveClass(
    'eds-form-control-wrapper--negative',
    'eds-form-control-wrapper--success',
    'eds-form-control-wrapper--disabled',
    'eds-form-control-wrapper--readonly',
    'eds-form-control-wrapper--is-filled',
  );

  rerender(
    <BaseFormControl
      label="test"
      labelId="testId"
      data-testid="wrapper"
      size="large"
      disabled
      readOnly
      isFilled
    >
      <input />
    </BaseFormControl>,
  );
  expect(wrapper).toHaveClass(
    'eds-form-control-wrapper--size-large',
    'eds-form-control-wrapper--disabled',
    'eds-form-control-wrapper--readonly',
    'eds-form-control-wrapper--is-filled',
  );
});

test('renders prepend and append content only when given', () => {
  const { rerender } = render(
    <BaseFormControl label="test" labelId="testId">
      <input />
    </BaseFormControl>,
  );
  expect(screen.queryByText('Fra')).not.toBeInTheDocument();
  expect(screen.queryByText('kr')).not.toBeInTheDocument();

  rerender(
    <BaseFormControl label="test" labelId="testId" prepend="Fra" append="kr">
      <input />
    </BaseFormControl>,
  );
  expect(screen.getByText('Fra')).toHaveClass('eds-form-control__prepend');
  expect(screen.getByText('kr')).toHaveClass('eds-form-control__append');
});

test('renders live region in DOM before feedback exists', () => {
  const { rerender } = render(
    <BaseFormControl label="test" labelId="testId">
      <input />
    </BaseFormControl>,
  );

  const region = screen.getByRole('status');
  expect(region).not.toHaveAttribute('aria-live');
  expect(region).toBeEmptyDOMElement();

  rerender(
    <BaseFormControl
      label="test"
      labelId="testId"
      variant="negative"
      feedback="Feltet er påkrevd"
    >
      <input />
    </BaseFormControl>,
  );

  expect(screen.getByRole('status')).toBe(region);
  expect(region).toHaveTextContent('Feltet er påkrevd');

  rerender(
    <BaseFormControl label="test" labelId="testId">
      <input />
    </BaseFormControl>,
  );
  expect(screen.getByRole('status')).toBe(region);
  expect(region).toBeEmptyDOMElement();
});

test.each(['negative', 'warning', 'success', 'information'] as const)(
  'uses status role by default for %s variant',
  (variant: 'negative' | 'warning' | 'success' | 'information') => {
    render(
      <BaseFormControl
        label="test"
        labelId="testId"
        variant={variant}
        feedback="Melding"
      >
        <input />
      </BaseFormControl>,
    );

    const region = screen.getByRole('status');
    expect(region).not.toHaveAttribute('aria-live');
    expect(region).toHaveTextContent('Melding');
  },
);

test('uses alert role when ariaAlertOnFeedback is alert', () => {
  const { rerender } = render(
    <BaseFormControl label="test" labelId="testId" ariaAlertOnFeedback="alert">
      <input />
    </BaseFormControl>,
  );

  const region = screen.getByRole('alert');
  expect(region).not.toHaveAttribute('aria-live');
  expect(region).toBeEmptyDOMElement();

  rerender(
    <BaseFormControl
      label="test"
      labelId="testId"
      ariaAlertOnFeedback="alert"
      variant="negative"
      feedback="Feltet er påkrevd"
    >
      <input />
    </BaseFormControl>,
  );

  expect(screen.getByRole('alert')).toBe(region);
  expect(region).toHaveTextContent('Feltet er påkrevd');
});

test('uses alert role when ariaAlertOnFeedback is true', () => {
  render(
    <BaseFormControl
      label="test"
      labelId="testId"
      ariaAlertOnFeedback
      variant="negative"
      feedback="Feltet er påkrevd"
    >
      <input />
    </BaseFormControl>,
  );

  expect(screen.getByRole('alert')).toHaveTextContent('Feltet er påkrevd');
});

test('renders no live region when ariaAlertOnFeedback is false', () => {
  const { container, rerender } = render(
    <BaseFormControl label="test" labelId="testId" ariaAlertOnFeedback={false}>
      <input />
    </BaseFormControl>,
  );

  expect(container.querySelector('.eds-feedback-text')).not.toBeInTheDocument();

  rerender(
    <BaseFormControl
      label="test"
      labelId="testId"
      ariaAlertOnFeedback={false}
      variant="negative"
      feedback="Feltet er påkrevd"
    >
      <input />
    </BaseFormControl>,
  );

  const feedbackText = container.querySelector('.eds-feedback-text');
  expect(feedbackText).toHaveTextContent('Feltet er påkrevd');
  expect(feedbackText).not.toHaveAttribute('aria-live');
  expect(feedbackText).not.toHaveAttribute('role');
});

test('role from feedbackProps overrides the aria props', () => {
  render(
    <BaseFormControl
      label="test"
      labelId="testId"
      ariaAlertOnFeedback="alert"
      feedbackProps={{ role: 'status' }}
      variant="negative"
      feedback="Feltet er påkrevd"
    >
      <input />
    </BaseFormControl>,
  );

  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Feltet er påkrevd');
});

test('aria-live from feedbackProps replaces the implicit role', () => {
  const { container } = render(
    <BaseFormControl
      label="test"
      labelId="testId"
      feedbackProps={{ 'aria-live': 'off' }}
    >
      <input />
    </BaseFormControl>,
  );

  const region = container.querySelector('.eds-feedback-text');
  expect(region).toBeInTheDocument();
  expect(region).toHaveAttribute('aria-live', 'off');
  expect(region).not.toHaveAttribute('role');
});

test('passes other feedbackProps on to the feedback text', () => {
  render(
    <BaseFormControl
      label="test"
      labelId="testId"
      feedbackProps={
        {
          id: 'feedbackId',
          className: 'custom-feedback',
          'data-consumer': 'value',
        } as React.HTMLAttributes<HTMLElement>
      }
      variant="negative"
      feedback="Feltet er påkrevd"
    >
      <input />
    </BaseFormControl>,
  );

  const region = screen.getByRole('status');
  expect(region).toHaveAttribute('id', 'feedbackId');
  expect(region).toHaveAttribute('data-consumer', 'value');
  expect(region).toHaveClass('eds-feedback-text', 'custom-feedback');
});
