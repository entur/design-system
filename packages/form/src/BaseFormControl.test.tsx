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

test('renders live region in DOM before feedback exists', () => {
  const { container, rerender } = render(
    <BaseFormControl label="test" labelId="testId">
      <input />
    </BaseFormControl>,
  );

  const region = container.querySelector('.eds-feedback-text');
  expect(region).toBeInTheDocument();
  expect(region).toHaveAttribute('role', 'status');
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

  expect(region).toHaveAttribute('role', 'status');
  expect(region).not.toHaveAttribute('aria-live');
  expect(region).toHaveTextContent('Feltet er påkrevd');
});

test.each(['negative', 'warning', 'success', 'information'] as const)(
  'uses status role by default for %s variant',
  (variant: 'negative' | 'warning' | 'success' | 'information') => {
    const { container } = render(
      <BaseFormControl
        label="test"
        labelId="testId"
        variant={variant}
        feedback="Melding"
      >
        <input />
      </BaseFormControl>,
    );

    const region = container.querySelector('.eds-feedback-text');
    expect(region).toHaveAttribute('role', 'status');
    expect(region).not.toHaveAttribute('aria-live');
    expect(region).toHaveTextContent('Melding');
  },
);

test('uses alert role when ariaAlertOnFeedback is alert', () => {
  const { container, rerender } = render(
    <BaseFormControl label="test" labelId="testId" ariaAlertOnFeedback="alert">
      <input />
    </BaseFormControl>,
  );

  const region = container.querySelector('.eds-feedback-text');
  expect(region).toHaveAttribute('role', 'alert');
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

  expect(region).toHaveAttribute('role', 'alert');
  expect(region).toHaveTextContent('Feltet er påkrevd');
});

test('uses alert role when ariaAlertOnFeedback is true', () => {
  const { container } = render(
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

  expect(container.querySelector('.eds-feedback-text')).toHaveAttribute(
    'role',
    'alert',
  );
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
  const { container } = render(
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

  expect(container.querySelector('.eds-feedback-text')).toHaveAttribute(
    'role',
    'status',
  );
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
  const { container } = render(
    <BaseFormControl
      label="test"
      labelId="testId"
      feedbackProps={{ id: 'feedbackId', className: 'custom-feedback' }}
      variant="negative"
      feedback="Feltet er påkrevd"
    >
      <input />
    </BaseFormControl>,
  );

  const region = container.querySelector('.eds-feedback-text');
  expect(region).toHaveAttribute('id', 'feedbackId');
  expect(region).toHaveClass('custom-feedback');
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
