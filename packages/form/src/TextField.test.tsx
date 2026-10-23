import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('TextField', () => {
  test('TextField is accessible', async () => {
    const { container } = render(<TextField label="testing label" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  describe('Clearable functionality', () => {
    test('shows the clear button after editing and removes it after clearing', async () => {
      const user = userEvent.setup();
      render(<TextField label="Destination" clearable />);
      const input = screen.getByRole('textbox', { name: 'Destination' });
      expect(
        screen.queryByRole('button', { name: 'Tøm felt' }),
      ).not.toBeInTheDocument();
      await user.type(input, 'Oslo');
      expect(input).toHaveValue('Oslo');
      await user.click(screen.getByRole('button', { name: 'Tøm felt' }));
      expect(input).toHaveValue('');
      expect(input).toHaveFocus();
      expect(
        screen.queryByRole('button', { name: 'Tøm felt' }),
      ).not.toBeInTheDocument();
    });

    test('clears an uncontrolled default value without an onChange handler', async () => {
      const user = userEvent.setup();
      render(<TextField label="Destination" clearable defaultValue="Oslo" />);
      const input = screen.getByRole('textbox', { name: 'Destination' });
      expect(input).toHaveValue('Oslo');
      await user.click(screen.getByRole('button', { name: 'Tøm felt' }));
      expect(input).toHaveValue('');
    });

    test('clears controlled state through onChange and calls onClear once', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      const onClear = jest.fn();
      function Destination() {
        const [value, setValue] = React.useState('Oslo');
        return (
          <TextField
            label="Destination"
            value={value}
            onChange={e => {
              onChange(e.target.value);
              setValue(e.target.value);
            }}
            clearable
            onClear={onClear}
          />
        );
      }
      render(<Destination />);
      await user.click(screen.getByRole('button', { name: 'Tøm felt' }));
      expect(screen.getByRole('textbox', { name: 'Destination' })).toHaveValue(
        '',
      );
      expect(onChange.mock.calls).toEqual([['']]);
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    test('does not offer clearing when clearable is false', async () => {
      const user = userEvent.setup();
      render(<TextField label="Destination" clearable={false} />);
      await user.type(
        screen.getByRole('textbox', { name: 'Destination' }),
        'Oslo',
      );
      expect(
        screen.queryByRole('button', { name: 'Tøm felt' }),
      ).not.toBeInTheDocument();
    });

    test.each([true, false])(
      'append action remains usable with clearable=%s',
      async clearable => {
        const user = userEvent.setup();
        const onLookup = jest.fn();
        render(
          <TextField
            label="Destination"
            clearable={clearable}
            defaultValue="Oslo"
            append={
              <button type="button" onClick={onLookup}>
                Look up
              </button>
            }
          />,
        );
        await user.click(screen.getByRole('button', { name: 'Look up' }));
        expect(onLookup).toHaveBeenCalledTimes(1);
        expect(
          screen.getByRole('textbox', { name: 'Destination' }),
        ).toHaveValue('Oslo');
        if (clearable) {
          await user.click(screen.getByRole('button', { name: 'Tøm felt' }));
          expect(
            screen.getByRole('textbox', { name: 'Destination' }),
          ).toHaveValue('');
        }
      },
    );

    test.each(['{Enter}', ' '])(
      'custom-named clear button works with %s without submitting',
      async key => {
        const user = userEvent.setup();
        const onSubmit = jest.fn(e => e.preventDefault());
        render(
          <form onSubmit={onSubmit}>
            <TextField
              label="Destination"
              clearable
              clearButtonAriaLabel="Clear destination"
              defaultValue="Oslo"
            />
          </form>,
        );
        await user.tab();
        expect(
          screen.getByRole('textbox', { name: 'Destination' }),
        ).toHaveFocus();
        await user.tab();
        expect(
          screen.getByRole('button', { name: 'Clear destination' }),
        ).toHaveFocus();
        await user.keyboard(key);
        expect(
          screen.getByRole('textbox', { name: 'Destination' }),
        ).toHaveValue('');
        expect(
          screen.getByRole('textbox', { name: 'Destination' }),
        ).toHaveFocus();
        expect(onSubmit).not.toHaveBeenCalled();
      },
    );
  });

  test('controlled editing supports selection replacement and deletion', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    function Destination() {
      const [value, setValue] = React.useState('Oslo');
      return (
        <TextField
          label="Destination"
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setValue(e.target.value);
          }}
        />
      );
    }
    render(<Destination />);
    const input = screen.getByRole('textbox', { name: 'Destination' });
    await user.tab();
    expect(input).toHaveFocus();
    await user.keyboard('{Control>}a{/Control}Bergen{Backspace}');
    expect(input).toHaveValue('Berge');
    expect(onChange).toHaveBeenLastCalledWith('Berge');
    await user.clear(input);
    expect(input).toHaveValue('');
    expect(onChange).toHaveBeenLastCalledWith('');
  });

  test.each(['disabled', 'readOnly'] as const)(
    '%s prevents editing and clearing',
    async mode => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      const onClear = jest.fn();
      render(
        <>
          <TextField
            label="Destination"
            defaultValue="Oslo"
            clearable
            disabled={mode === 'disabled'}
            readOnly={mode === 'readOnly'}
            onChange={onChange}
            onClear={onClear}
          />
          <button>Continue</button>
        </>,
      );
      const input = screen.getByRole('textbox', { name: /Destination/ });
      await user.tab();
      expect(
        mode === 'disabled'
          ? screen.getByRole('button', { name: 'Continue' })
          : input,
      ).toHaveFocus();
      await user.type(input, 'Bergen');
      expect(input).toHaveValue('Oslo');
      expect(
        screen.queryByRole('button', { name: 'Tøm felt' }),
      ).not.toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
      expect(onClear).not.toHaveBeenCalled();
    },
  );

  // Bug: the feedback text is not linked to the input with aria-describedby.
  test.failing('feedback text describes only its own field', () => {
    render(
      <>
        <TextField
          label="Destination"
          variant="negative"
          feedback="Choose a destination"
        />
        <TextField label="Departure" />
      </>,
    );
    expect(
      screen.getByRole('textbox', { name: 'Destination' }),
    ).toHaveAccessibleDescription('Choose a destination');
    expect(
      screen.getByRole('textbox', { name: 'Departure' }),
    ).toHaveAccessibleDescription('');
  });

  test('forwards className and style to the wrapper and rest props and ref to the input', () => {
    const ref = React.createRef<HTMLInputElement>();
    const { container } = render(
      <TextField
        label="Destination"
        className="consumer-class"
        style={{ marginTop: '7px' }}
        data-consumer="value"
        ref={ref}
      />,
    );
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass('eds-textfield__wrapper', 'consumer-class');
    expect(wrapper).toHaveStyle({ marginTop: '7px' });
    const input = screen.getByRole('textbox', { name: 'Destination' });
    expect(input).toHaveAttribute('data-consumer', 'value');
    expect(ref.current).toBe(input);
  });

  describe('aria-invalid', () => {
    test.each(['negative', 'error'] as const)(
      'is true for %s variant',
      variant => {
        render(<TextField label="Test field" variant={variant} />);
        expect(
          screen.getByRole('textbox', { name: 'Test field' }),
        ).toHaveAttribute('aria-invalid', 'true');
      },
    );

    test.each(['warning', 'success', 'information', undefined] as const)(
      'is false for %s variant',
      variant => {
        render(<TextField label="Test field" variant={variant} />);
        expect(
          screen.getByRole('textbox', { name: 'Test field' }),
        ).toHaveAttribute('aria-invalid', 'false');
      },
    );
  });
});
