import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SegmentedControl } from '.';
import { SegmentedChoice } from '.';

describe('SegmentedControl', () => {
  it('renders with proper structure', () => {
    const mockOnChange = jest.fn();

    render(
      <SegmentedControl
        label="Test control"
        value="option1"
        onChange={mockOnChange}
      >
        <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
        <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
      </SegmentedControl>,
    );

    expect(screen.getByText('Test control')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  // Legacy API compatibility tests
  it('supports legacy selectedValue prop (deprecated)', () => {
    const mockOnChange = jest.fn();

    render(
      <SegmentedControl
        label="Legacy control"
        selectedValue="option1"
        onChange={mockOnChange}
      >
        <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
        <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
      </SegmentedControl>,
    );

    const option1 = screen.getByText('Option 1').closest('button');
    const option2 = screen.getByText('Option 2').closest('button');
    expect(option1).toHaveAttribute('aria-checked', 'true');
    expect(option2).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(option2!);
    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('supports legacy SegmentedChoice child component', () => {
    const mockOnChange = jest.fn();

    render(
      <SegmentedControl
        label="Legacy child"
        value="option1"
        onChange={mockOnChange}
      >
        <SegmentedChoice value="option1">Option 1</SegmentedChoice>
        <SegmentedChoice value="option2">Option 2</SegmentedChoice>
      </SegmentedControl>,
    );

    const option2 = screen.getByText('Option 2').closest('button');
    fireEvent.click(option2!);
    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('handles selection changes', () => {
    const mockOnChange = jest.fn();

    render(
      <SegmentedControl
        label="Test control"
        value="option1"
        onChange={mockOnChange}
      >
        <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
        <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
      </SegmentedControl>,
    );

    const option2 = screen.getByText('Option 2').closest('button');
    expect(option2).toBeInTheDocument();

    fireEvent.click(option2!);
    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('supports custom elements with as prop', () => {
    const mockOnChange = jest.fn();
    const CustomButton = ({ children, ...props }: any) => (
      <button data-testid="custom-button" {...props}>
        {children}
      </button>
    );

    render(
      <SegmentedControl
        label="Test control"
        value="option1"
        onChange={mockOnChange}
      >
        <SegmentedControl.Item value="option1" as={CustomButton}>
          Option 1
        </SegmentedControl.Item>
        <SegmentedControl.Item value="option2" as={CustomButton}>
          Option 2
        </SegmentedControl.Item>
      </SegmentedControl>,
    );

    const customButtons = screen.getAllByTestId('custom-button');
    expect(customButtons).toHaveLength(2);
  });

  it('supports comprehensive keyboard navigation', () => {
    const mockOnChange = jest.fn();

    render(
      <SegmentedControl
        label="Test control"
        value="option1"
        onChange={mockOnChange}
      >
        <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
        <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
        <SegmentedControl.Item value="option3">Option 3</SegmentedControl.Item>
      </SegmentedControl>,
    );

    const option1 = screen.getByText('Option 1').closest('button');
    const option2 = screen.getByText('Option 2').closest('button');
    const option3 = screen.getByText('Option 3').closest('button');

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
    expect(option3).toBeInTheDocument();

    // Focus first option
    option1!.focus();
    expect(option1).toHaveFocus();

    // Test right arrow navigation
    fireEvent.keyDown(option1!, { key: 'ArrowRight' });
    expect(option2).toHaveFocus();

    // Test down arrow navigation (same as right)
    fireEvent.keyDown(option2!, { key: 'ArrowDown' });
    expect(option3).toHaveFocus();

    // Test left arrow navigation
    fireEvent.keyDown(option3!, { key: 'ArrowLeft' });
    expect(option2).toHaveFocus();

    // Test up arrow navigation (same as left)
    fireEvent.keyDown(option2!, { key: 'ArrowUp' });
    expect(option1).toHaveFocus();

    // Test Home key
    fireEvent.keyDown(option3!, { key: 'Home' });
    expect(option1).toHaveFocus();

    // Test End key
    fireEvent.keyDown(option1!, { key: 'End' });
    expect(option3).toHaveFocus();

    // Test Space key selection
    fireEvent.keyDown(option2!, { key: ' ' });
    expect(mockOnChange).toHaveBeenCalledWith('option2');

    // Test Enter key selection
    fireEvent.keyDown(option3!, { key: 'Enter' });
    expect(mockOnChange).toHaveBeenCalledWith('option3');

    // Test Escape key (should not change selection)
    fireEvent.keyDown(option1!, { key: 'Escape' });
    expect(mockOnChange).not.toHaveBeenCalledWith('option1');
  });

  it('supports compound component pattern with SegmentedControl.Item', () => {
    const mockOnChange = jest.fn();

    render(
      <SegmentedControl
        label="Test control"
        value="option1"
        onChange={mockOnChange}
      >
        <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
        <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
      </SegmentedControl>,
    );

    expect(screen.getByText('Test control')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();

    // Test that clicking works the same way
    const option2 = screen.getByText('Option 2').closest('button');
    expect(option2).toBeInTheDocument();

    fireEvent.click(option2!);
    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('supports uncontrolled behavior and submits correct value', () => {
    type HandleSubmitMock = jest.Mock<
      void,
      [React.FormEvent<HTMLFormElement>]
    > & {
      data?: Record<string, FormDataEntryValue>;
    };

    const handleSubmit: HandleSubmitMock = jest.fn(e => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleSubmit.data = Object.fromEntries(formData.entries());
    });

    render(
      <form onSubmit={handleSubmit}>
        <SegmentedControl
          label="Uncontrolled control"
          name="segmented"
          defaultValue="option1"
        >
          <SegmentedControl.Item value="option1">
            Option 1
          </SegmentedControl.Item>
          <SegmentedControl.Item value="option2">
            Option 2
          </SegmentedControl.Item>
          <SegmentedControl.Item value="option3">
            Option 3
          </SegmentedControl.Item>
        </SegmentedControl>
        <button type="submit">Submit</button>
      </form>,
    );

    const option1 = screen.getByText('Option 1').closest('button');
    const option2 = screen.getByText('Option 2').closest('button');
    const option3 = screen.getByText('Option 3').closest('button');
    const submitButton = screen.getByText('Submit');

    expect(option1).toHaveAttribute('aria-checked', 'true');
    expect(option2).toHaveAttribute('aria-checked', 'false');
    expect(option3).toHaveAttribute('aria-checked', 'false');

    // Submit with default (option1)
    fireEvent.click(submitButton);
    expect(handleSubmit).toHaveBeenCalled();
    expect(handleSubmit.data).toEqual({ segmented: 'option1' });

    // Click option 2 and submit
    fireEvent.click(option2!);
    expect(option1).toHaveAttribute('aria-checked', 'false');
    expect(option2).toHaveAttribute('aria-checked', 'true');
    expect(option3).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(submitButton);
    expect(handleSubmit.data).toEqual({ segmented: 'option2' });

    // Click option 3 and submit
    fireEvent.click(option3!);
    expect(option1).toHaveAttribute('aria-checked', 'false');
    expect(option2).toHaveAttribute('aria-checked', 'false');
    expect(option3).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(submitButton);
    expect(handleSubmit.data).toEqual({ segmented: 'option3' });
  });
  it('has proper ARIA attributes for accessibility', () => {
    const mockOnChange = jest.fn();

    render(
      <SegmentedControl
        label="Test control"
        value="option1"
        onChange={mockOnChange}
      >
        <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
        <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
      </SegmentedControl>,
    );

    const container = screen.getByRole('radiogroup');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('aria-labelledby');

    const option1 = screen.getByText('Option 1').closest('button');
    const option2 = screen.getByText('Option 2').closest('button');

    expect(option1).toHaveAttribute('role', 'radio');
    expect(option1).toHaveAttribute('aria-checked', 'true');
    expect(option1).toHaveAttribute('tabIndex', '0');

    expect(option2).toHaveAttribute('role', 'radio');
    expect(option2).toHaveAttribute('aria-checked', 'false');
    expect(option2).toHaveAttribute('tabIndex', '-1');
  });

  it('supports roving tabindex correctly', () => {
    const mockOnChange = jest.fn();

    render(
      <SegmentedControl
        label="Test control"
        value="option2"
        onChange={mockOnChange}
      >
        <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
        <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
        <SegmentedControl.Item value="option3">Option 3</SegmentedControl.Item>
      </SegmentedControl>,
    );

    const option1 = screen.getByText('Option 1').closest('button');
    const option2 = screen.getByText('Option 2').closest('button');
    const option3 = screen.getByText('Option 3').closest('button');

    // Selected option should be focusable
    expect(option2).toHaveAttribute('tabIndex', '0');
    // Non-selected options should not be focusable
    expect(option1).toHaveAttribute('tabIndex', '-1');
    expect(option3).toHaveAttribute('tabIndex', '-1');
  });

  it('supports anchor elements with as prop', () => {
    const mockOnChange = jest.fn();

    render(
      <SegmentedControl
        label="Test control"
        value="option1"
        onChange={mockOnChange}
      >
        <SegmentedControl.Item value="option1" as="a" href="/option1">
          Option 1
        </SegmentedControl.Item>
        <SegmentedControl.Item value="option2" as="a" href="/option2">
          Option 2
        </SegmentedControl.Item>
      </SegmentedControl>,
    );

    const option1 = screen.getByText('Option 1').closest('a');
    const option2 = screen.getByText('Option 2').closest('a');

    expect(option1).toHaveAttribute('href', '/option1');
    expect(option2).toHaveAttribute('href', '/option2');
    expect(option1).toHaveAttribute('role', 'radio');
    expect(option2).toHaveAttribute('role', 'radio');
  });

  it('calls onFocus and onBlur callbacks when focused and blurred', () => {
    const mockOnChange = jest.fn();
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    render(
      <SegmentedControl
        label="Test control"
        value="option1"
        onChange={mockOnChange}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
        <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
      </SegmentedControl>,
    );

    const option1 = screen.getByText('Option 1').closest('button');
    expect(option1).toBeInTheDocument();

    fireEvent.focus(option1!);
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(option1!);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
