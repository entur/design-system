import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextArea } from './TextArea';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
test('TextArea is accessible', async () => {
  const { container } = render(<TextArea label="testing label" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('edits controlled multiline content and clears the value', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  function Message() {
    const [value, setValue] = React.useState('');
    return (
      <TextArea
        label="Message"
        value={value}
        onChange={e => {
          onChange(e.target.value);
          setValue(e.target.value);
        }}
      />
    );
  }
  render(<Message />);
  const input = screen.getByRole('textbox', { name: 'Message' });
  await user.tab();
  expect(input).toHaveFocus();
  await user.keyboard('First line{Enter}Second line{Backspace}');
  expect(input).toHaveValue('First line\nSecond lin');
  expect(onChange).toHaveBeenLastCalledWith('First line\nSecond lin');
  await user.clear(input);
  expect(input).toHaveValue('');
  expect(onChange).toHaveBeenLastCalledWith('');
});

test('edits an uncontrolled default value', async () => {
  const user = userEvent.setup();
  render(<TextArea label="Message" defaultValue="Draft" />);
  const input = screen.getByRole('textbox', { name: 'Message' });
  await user.type(input, '{End}{Enter}Ready');
  expect(input).toHaveValue('Draft\nReady');
});

test.each(['disabled', 'readOnly'] as const)(
  '%s prevents editing with the expected tab behavior',
  async mode => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <>
        <TextArea
          label="Message"
          defaultValue="Saved"
          disabled={mode === 'disabled'}
          readOnly={mode === 'readOnly'}
          onChange={onChange}
        />
        <button>Continue</button>
      </>,
    );
    const input = screen.getByRole('textbox', { name: /Message/ });
    await user.tab();
    expect(
      mode === 'disabled'
        ? screen.getByRole('button', { name: 'Continue' })
        : input,
    ).toHaveFocus();
    await user.type(input, 'Changes');
    expect(input).toHaveValue('Saved');
    expect(onChange).not.toHaveBeenCalled();
  },
);

// Bug: the feedback text is not linked to the textarea with aria-describedby.
test.failing(
  'feedback text describes the textarea and updates with validation',
  () => {
    const { rerender } = render(
      <TextArea
        label="Message"
        variant="negative"
        feedback="Write a message"
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Message' });
    expect(input).toHaveAccessibleDescription('Write a message');
    rerender(<TextArea label="Message" />);
    expect(input).toHaveAccessibleDescription('');
  },
);

test.each(['vertical', 'none'] as const)(
  'resize=%s sets inline resize on the textarea',
  resize => {
    render(<TextArea label="Message" resize={resize} />);
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveStyle({
      resize,
    });
  },
);

test('leaves resize to the stylesheet when no resize prop is set', () => {
  render(<TextArea label="Message" />);
  expect(screen.getByRole('textbox', { name: 'Message' }).style.resize).toBe(
    '',
  );
});

test('forwards className and style to the wrapper and rest props and ref to the textarea', () => {
  const ref = React.createRef<HTMLTextAreaElement>();
  const { container } = render(
    <TextArea
      label="Message"
      className="consumer-class"
      style={{ marginTop: '7px' }}
      data-consumer="value"
      ref={ref}
    />,
  );
  const wrapper = container.firstElementChild;
  expect(wrapper).toHaveClass('eds-textarea__wrapper', 'consumer-class');
  expect(wrapper).toHaveStyle({ marginTop: '7px' });
  const textarea = screen.getByRole('textbox', { name: 'Message' });
  expect(textarea).toHaveAttribute('data-consumer', 'value');
  expect(ref.current).toBe(textarea);
});

describe('aria-invalid', () => {
  test.each(['negative', 'error'] as const)(
    'is true for %s variant',
    variant => {
      const { container } = render(
        <TextArea label="testing label" variant={variant} />,
      );
      expect(container.querySelector('textarea')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    },
  );

  test.each(['warning', 'success', 'information', undefined] as const)(
    'is false for %s variant',
    variant => {
      const { container } = render(
        <TextArea label="testing label" variant={variant} />,
      );
      expect(container.querySelector('textarea')).toHaveAttribute(
        'aria-invalid',
        'false',
      );
    },
  );
});
