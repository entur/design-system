import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('TextField', () => {
  test('TextField is accessible', async () => {
    const { container } = render(<TextField label="testing label" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Clearable functionality', () => {
    test('shows clear button when clearable is true and field has value', async () => {
      const user = userEvent.setup();
      const { container } = render(<TextField label="Test field" clearable />);

      const input = screen.getByLabelText('Test field') as HTMLInputElement;

      // Initially no clear button visible
      expect(
        container.querySelector('.eds-textfield__clear-button'),
      ).not.toBeInTheDocument();

      // Type something
      await user.type(input, 'test value');

      // Clear button should appear
      expect(
        container.querySelector('.eds-textfield__clear-button'),
      ).toBeInTheDocument();
    });

    test('clears uncontrolled field when clear button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <TextField label="Test field" clearable defaultValue="initial value" />,
      );

      const input = screen.getByLabelText('Test field') as HTMLInputElement;
      expect(input.value).toBe('initial value');

      const clearButton = container.querySelector(
        '.eds-textfield__clear-button',
      );
      expect(clearButton).toBeInTheDocument();

      if (!clearButton) {
        throw new Error('Clear button should be in the document');
      }
      await user.click(clearButton);

      expect(input.value).toBe('');
    });

    test('clears controlled field when clear button is clicked with onClear', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('controlled value');

        return (
          <TextField
            label="Test field"
            value={value}
            onChange={e => setValue(e.target.value)}
            clearable
            onClear={() => setValue('')}
          />
        );
      };

      const { container } = render(<TestComponent />);

      const input = screen.getByLabelText('Test field') as HTMLInputElement;
      expect(input.value).toBe('controlled value');

      const clearButton = container.querySelector(
        '.eds-textfield__clear-button',
      );

      if (!clearButton) {
        throw new Error('Clear button should be in the document');
      }
      await user.click(clearButton);

      expect(input.value).toBe('');
    });

    test('uses custom onClear when provided', async () => {
      const user = userEvent.setup();
      const onClearMock = jest.fn();

      const { container } = render(
        <TextField
          label="Test field"
          clearable
          onClear={onClearMock}
          defaultValue="test"
        />,
      );

      const clearButton = container.querySelector(
        '.eds-textfield__clear-button',
      );

      if (!clearButton) {
        throw new Error('Clear button should be in the document');
      }
      await user.click(clearButton);

      expect(onClearMock).toHaveBeenCalledTimes(1);
    });

    test('custom onClear can handle clearing for controlled component', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('initial');
        const [clearCount, setClearCount] = React.useState(0);

        return (
          <div>
            <TextField
              label="Test field"
              value={value}
              onChange={e => setValue(e.target.value)}
              clearable
              onClear={() => {
                setValue('');
                setClearCount(prev => prev + 1);
              }}
            />
            <div data-testid="clear-count">{clearCount}</div>
          </div>
        );
      };

      const { container } = render(<TestComponent />);

      const input = screen.getByLabelText('Test field') as HTMLInputElement;
      const clearButton = container.querySelector(
        '.eds-textfield__clear-button',
      );

      if (!clearButton) {
        throw new Error('Clear button should be in the document');
      }
      await user.click(clearButton);

      expect(input.value).toBe('');
      expect(screen.getByTestId('clear-count').textContent).toBe('1');
    });

    test('does not show clear button when clearable is false', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <TextField label="Test field" clearable={false} />,
      );

      const input = screen.getByLabelText('Test field') as HTMLInputElement;
      await user.type(input, 'test');

      expect(
        container.querySelector('.eds-textfield__clear-button'),
      ).not.toBeInTheDocument();
    });

    test('clearable works with uncontrolled components without onChange', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <TextField label="Test field" clearable defaultValue="test" />,
      );

      const input = screen.getByLabelText('Test field') as HTMLInputElement;
      expect(input.value).toBe('test');

      const clearButton = container.querySelector(
        '.eds-textfield__clear-button',
      );

      if (!clearButton) {
        throw new Error('Clear button should be in the document');
      }
      await user.click(clearButton);

      expect(input.value).toBe('');
    });

    test('append prop works alongside clearable', () => {
      const { container } = render(
        <TextField
          label="Test field"
          clearable
          append={<span data-testid="append-content">Append</span>}
          defaultValue="test"
        />,
      );

      // Both append content and clear button should be present
      expect(screen.getByTestId('append-content')).toBeInTheDocument();
      expect(
        container.querySelector('.eds-textfield__clear-button'),
      ).toBeInTheDocument();
    });

    test('append prop works when clearable is false', () => {
      render(
        <TextField
          label="Test field"
          clearable={false}
          append={<span data-testid="append-content">Append</span>}
        />,
      );

      expect(screen.getByTestId('append-content')).toBeInTheDocument();
    });

    test('clear button has default aria-label', () => {
      render(<TextField label="Test field" clearable defaultValue="test" />);

      const clearButton = screen.getByRole('button', { name: 'Tøm felt' });
      expect(clearButton).toBeInTheDocument();
    });

    test('clear button accepts custom aria-label', () => {
      render(
        <TextField
          label="Test field"
          clearable
          clearButtonAriaLabel="Clear this field"
          defaultValue="test"
        />,
      );

      const clearButton = screen.getByRole('button', {
        name: 'Clear this field',
      });
      expect(clearButton).toBeInTheDocument();
    });

    test('clear button is keyboard accessible', () => {
      const { container } = render(
        <TextField label="Test field" clearable defaultValue="test" />,
      );

      const clearButton = container.querySelector(
        '.eds-textfield__clear-button',
      ) as HTMLButtonElement;

      expect(clearButton).toBeInTheDocument();
      // Verify it doesn't have tabIndex={-1} which would make it inaccessible
      expect(clearButton.tabIndex).not.toBe(-1);
    });
  });

  describe('aria-invalid', () => {
    test.each(['negative', 'error'] as const)(
      'is true for %s variant',
      variant => {
        render(<TextField label="Test field" variant={variant} />);

        expect(screen.getByLabelText('Test field')).toHaveAttribute(
          'aria-invalid',
          'true',
        );
      },
    );

    test.each(['warning', 'success', 'information', undefined] as const)(
      'is false for %s variant',
      variant => {
        render(<TextField label="Test field" variant={variant} />);

        expect(screen.getByLabelText('Test field')).toHaveAttribute(
          'aria-invalid',
          'false',
        );
      },
    );
  });
});
