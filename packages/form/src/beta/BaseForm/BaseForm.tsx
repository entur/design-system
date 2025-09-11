import React from 'react';
import classNames from 'classnames';
import { Placement } from '@entur/tooltip';
import { useFormField, useFormFieldState } from '../hooks';
import { FormFieldProvider } from './FormFieldContext';
import { FormLabel } from './FormLabel';
import { FormDescription } from './FormDescription';
import { FormFeedback } from './FormFeedback';
import { FormFieldVariant } from '../types';

// Simplified props - only the essentials
export interface BaseFormProps {
  /** The form field content */
  children: React.ReactNode;
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
  /** Feedback message (error, success, etc.) */
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
}

export const BaseForm = React.forwardRef<HTMLDivElement, BaseFormProps>(
  (
    {
      id,
      label,
      labelIcon,
      visuallyHiddenLabel = false,
      labelPlacement = 'top',
      labelWidth,
      tooltip,
      tooltipPlacement,
      tooltipAriaLabel,
      description,
      feedback,
      variant = 'default',
      disabled = false,
      readOnly = false,
      required = false,
      requiredIndicator,
      requiredIndicatorPlacement = 'label',
      size = 'medium',
      className,
      style,
      ariaAlertOnFeedback = false,
      children,
      ...rest
    },
    ref,
  ) => {
    // Generate IDs and accessibility attributes
    const fieldIds = useFormField({
      id,
      variant,
      required,
    });

    // Manage form field state
    const fieldState = useFormFieldState();

    // Create context value
    const contextValue = {
      ...fieldIds,
      variant,
      disabled,
      readOnly,
      required,
      size,
      ...fieldState,
    };

    // Warn if description is provided with left label placement
    if (
      process.env.NODE_ENV !== 'production' &&
      description &&
      labelPlacement === 'left'
    ) {
      console.warn(
        'BaseForm: description is not displayed when labelPlacement is "left". Consider using tooltip or feedback instead.',
      );
    }

    return (
      <FormFieldProvider value={contextValue}>
        <div
          ref={ref}
          className={classNames(
            'eds-form-field',
            `eds-form-field--size-${size}`,
            `eds-form-field--label-${labelPlacement}`,
            {
              [`eds-form-field--${variant}`]: variant !== 'default',
              'eds-form-field--disabled': disabled,
              'eds-form-field--readonly': readOnly,
              'eds-form-field--filled': fieldState.isFilled,
              'eds-form-field--focused': fieldState.isFocused,
            },
            className,
          )}
          style={{
            ...style,
            ...(labelPlacement === 'left' && labelWidth
              ? ({ '--form-label-width': labelWidth } as React.CSSProperties)
              : {}),
          }}
          {...rest}
        >
          <div className="eds-form-field__container">
            {label && (
              <FormLabel
                icon={labelIcon}
                visuallyHidden={visuallyHiddenLabel}
                tooltip={tooltip}
                tooltipPlacement={tooltipPlacement}
                tooltipAriaLabel={tooltipAriaLabel}
                requiredIndicator={
                  requiredIndicatorPlacement === 'label'
                    ? requiredIndicator
                    : undefined
                }
              >
                {label}
              </FormLabel>
            )}

            <div className="eds-form-field__input-wrapper">
              {description && labelPlacement === 'top' && (
                <FormDescription
                  requiredIndicator={
                    requiredIndicatorPlacement === 'description'
                      ? requiredIndicator
                      : undefined
                  }
                >
                  {description}
                </FormDescription>
              )}

              {children}

              {feedback && (
                <FormFeedback
                  variant={variant}
                  role={ariaAlertOnFeedback ? 'alert' : 'status'}
                >
                  {feedback}
                </FormFeedback>
              )}
            </div>
          </div>
        </div>
      </FormFieldProvider>
    );
  },
);

BaseForm.displayName = 'BaseForm';
