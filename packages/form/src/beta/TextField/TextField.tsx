import React from 'react';
import classNames from 'classnames';
import { CloseFilledIcon, ClosedLockIcon } from '@entur/icons';
import { mergeRefs } from '@entur/utils';
import { Placement } from '@entur/tooltip';
import { BaseForm } from '../BaseForm';
import { useFormFieldContext } from '../BaseForm/FormFieldContext';
import { FormFieldVariant } from '../types';

export interface TextFieldProps {
  /** Unique identifier for the field */
  id?: string;
  /** Label for the field */
  label?: React.ReactNode;
  /** Icon to display next to the label */
  labelIcon?: React.ReactNode;
  /** Visually hide the label but keep it accessible to screen readers */
  visuallyHiddenLabel?: boolean;
  /** Label placement: 'top' (default, vertical) or 'left' (horizontal). Note: description is not shown when labelPlacement is 'left' */
  labelPlacement?: 'top' | 'left';
  /** Label width when labelPlacement is 'left' (default: '150px') */
  labelWidth?: string;
  /** Tooltip content for additional help */
  tooltip?: React.ReactNode;
  /** Tooltip placement */
  tooltipPlacement?: Placement;
  /** Aria label for tooltip button */
  tooltipAriaLabel?: string;
  /** Description text below the label (only shown when labelPlacement is 'top') */
  description?: React.ReactNode;
  /** Feedback message (negative, success, etc.) */
  feedback?: string;
  /** Field variant state */
  variant?: FormFieldVariant;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is read-only */
  readOnly?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Custom required indicator (e.g., chip, tag, or custom text) */
  requiredIndicator?: React.ReactNode;
  /** Where to place the required indicator: 'label' (after label) or 'description' (under description) */
  requiredIndicatorPlacement?: 'label' | 'description';
  /** Field size */
  size?: 'small' | 'medium' | 'large';
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Whether to show feedback as alert for screen readers */
  ariaAlertOnFeedback?: boolean;
  /**
   * Input value for controlled component.
   * Use this when you need to control the value programmatically.
   * Must be used together with `onChange` to update the value.
   * @example
   * const [value, setValue] = useState('');
   * <TextField value={value} onChange={e => setValue(e.target.value)} />
   */
  value?: string;
  /**
   * Default value for uncontrolled component.
   * Use this when you only need an initial value and let the input manage its own state.
   * Cannot be used together with `value`.
   * @example
   * <TextField defaultValue="Initial value" />
   */
  defaultValue?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  /** Content to prepend to the field (e.g., currency symbol, protocol) */
  prepend?: React.ReactNode;
  /** Content to append to the field (e.g., domain, unit) */
  append?: React.ReactNode;
  /**
   * Whether to show a clear button when the field has a value.
   * For uncontrolled components, clearing works automatically.
   * For controlled components, you must provide `onClear` to update your state.
   * @default false
   */
  clearable?: boolean;
  /**
   * Callback when clear button is clicked.
   * Required for controlled components when using `clearable`.
   * @example
   * const [value, setValue] = useState('test');
   * <TextField value={value} clearable onClear={() => setValue('')} />
   */
  onClear?: () => void;
  /** Callback when input value changes */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Callback when input is focused */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Callback when input loses focus */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Additional input props */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      value,
      defaultValue,
      placeholder,
      type = 'text',
      prepend,
      append,
      clearable = false,
      onClear,
      onChange,
      onFocus,
      onBlur,
      inputProps,
      ...baseFormProps
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = mergeRefs(ref, inputRef);
    const [internalValue, setInternalValue] = React.useState(
      defaultValue || '',
    );

    // Track internal value for uncontrolled components
    const currentValue = value !== undefined ? value : internalValue;

    // Handle clear functionality
    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        // For controlled components, call onChange
        const syntheticEvent = {
          target: { value: '' },
          currentTarget: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      } else if (inputRef.current) {
        // For uncontrolled components, set value and update state
        inputRef.current.value = '';
        setInternalValue('');
      }
    };

    // Wrap onChange to track internal value for uncontrolled components
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(event.target.value);
      }
      onChange?.(event);
    };

    return (
      <BaseForm {...baseFormProps}>
        <TextFieldContent
          prepend={prepend}
          append={append}
          clearable={clearable}
          currentValue={currentValue}
          onClear={handleClear}
          mergedRef={mergedRef}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          type={type}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          inputProps={inputProps}
        />
      </BaseForm>
    );
  },
);

TextField.displayName = 'TextField';

// Internal TextFieldContent component that can access form context
interface TextFieldContentProps {
  prepend?: React.ReactNode;
  append?: React.ReactNode;
  clearable: boolean;
  currentValue: string;
  onClear: () => void;
  mergedRef: React.Ref<HTMLInputElement>;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const TextFieldContent: React.FC<TextFieldContentProps> = ({
  prepend,
  append,
  clearable,
  currentValue,
  onClear,
  mergedRef,
  value,
  defaultValue,
  placeholder,
  type,
  onChange,
  onFocus,
  onBlur,
  inputProps,
}) => {
  const { readOnly } = useFormFieldContext();

  // Combine prepend with lock icon if readOnly
  const finalPrepend = React.useMemo(() => {
    if (!readOnly) return prepend;

    const lockIcon = (
      <ClosedLockIcon className="eds-textfield__prepend-readonly" />
    );

    if (prepend) {
      // If user provided prepend, combine it with lock icon
      return (
        <>
          {lockIcon}
          {prepend}
        </>
      );
    }

    // If no user prepend, just show lock icon
    return lockIcon;
  }, [prepend, readOnly]);

  return (
    <div className="eds-textfield__input-container">
      {finalPrepend && (
        <div className="eds-textfield__prepend">{finalPrepend}</div>
      )}

      <div className="eds-textfield__input-wrapper">
        <TextFieldInput
          ref={mergedRef}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          type={type}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          {...inputProps}
        />
        {clearable && currentValue && (
          <button
            type="button"
            className="eds-textfield__clear-button"
            onClick={onClear}
            aria-label="Clear input"
          >
            <CloseFilledIcon />
          </button>
        )}
      </div>

      {append && <div className="eds-textfield__append">{append}</div>}
    </div>
  );
};

// Internal TextFieldInput component that uses the form field context
interface TextFieldInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: FormFieldVariant;
}

const TextFieldInput = React.forwardRef<HTMLInputElement, TextFieldInputProps>(
  ({ variant, className, onFocus, onBlur, onChange, ...rest }, ref) => {
    const {
      fieldId,
      ariaDescribedBy,
      ariaInvalid,
      ariaRequired,
      disabled,
      readOnly,
      size,
      isFilled,
      setIsFilled,
      handleFocus,
      handleBlur,
    } = useFormFieldContext();

    const handleFocusInternal = (event: React.FocusEvent<HTMLInputElement>) => {
      handleFocus?.();
      onFocus?.(event);
    };

    const handleBlurInternal = (event: React.FocusEvent<HTMLInputElement>) => {
      handleBlur?.();
      onBlur?.(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const hasValue = Boolean(event.target.value.trim());
      setIsFilled?.(hasValue);
      onChange?.(event);
    };

    return (
      <input
        ref={ref}
        id={fieldId}
        className={classNames(
          'eds-textfield__input',
          `eds-textfield__input--size-${size}`,
          {
            [`eds-textfield__input--${variant}`]:
              variant && variant !== 'default',
            'eds-textfield__input--disabled': disabled,
            'eds-textfield__input--readonly': readOnly,
            'eds-textfield__input--filled': isFilled,
          },
          className,
        )}
        disabled={disabled}
        readOnly={readOnly}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        aria-required={ariaRequired}
        onFocus={handleFocusInternal}
        onBlur={handleBlurInternal}
        onChange={handleChange}
        {...rest}
      />
    );
  },
);

TextFieldInput.displayName = 'TextFieldInput';
