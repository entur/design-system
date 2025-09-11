import React from 'react';
import classNames from 'classnames';
import { QuestionIcon } from '@entur/icons';
import { IconButton } from '@entur/button';
import { Tooltip, Placement } from '@entur/tooltip';
import { useFormFieldContext } from './FormFieldContext';
import { Text } from '@entur/typography/beta';
export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Label content */
  children: React.ReactNode;
  /** Icon to display next to the label text */
  icon?: React.ReactNode;
  /** Tooltip content for additional help */
  tooltip?: React.ReactNode;
  /** Tooltip placement */
  tooltipPlacement?: Placement;
  /** Aria label for tooltip button */
  tooltipAriaLabel?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Custom required indicator to display after the label */
  requiredIndicator?: React.ReactNode;
  /** Visually hide the label but keep it accessible to screen readers */
  visuallyHidden?: boolean;
  /** Custom className */
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  icon,
  tooltip,
  tooltipPlacement = 'top',
  tooltipAriaLabel,
  requiredIndicator,
  visuallyHidden = false,
  className,
  ...rest
}) => {
  const { fieldId, labelId, disabled } = useFormFieldContext();

  return (
    <Text
      as="label"
      variant="label"
      id={labelId}
      htmlFor={fieldId}
      className={classNames(
        'eds-form-field__label',
        {
          'eds-form-field__label--disabled': disabled,
          'eds-visually-hidden': visuallyHidden,
        },
        className,
      )}
      {...rest}
    >
      <span className="eds-form-field__label-content">
        {icon && (
          <span className="eds-form-field__label-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="eds-form-field__label-text">
          {children}
          {requiredIndicator && (
            <span className="eds-form-field__label-required">
              {requiredIndicator}
            </span>
          )}
        </span>
      </span>
      {tooltip && (
        <Tooltip
          content={tooltip}
          placement={tooltipPlacement}
          showCloseButton={false}
          disableFocusListener={false}
          disableHoverListener={false}
          disableClickListner={false}
          disableKeyboardListener={false}
        >
          <IconButton
            as="span"
            tabIndex={0}
            role="button"
            className="eds-form-field__label-tooltip"
            aria-label={tooltipAriaLabel || `Help for ${children}`}
            disabled={disabled}
          >
            <QuestionIcon
              className="eds-form-field__label-tooltip-icon"
              aria-hidden="true"
            />
          </IconButton>
        </Tooltip>
      )}
    </Text>
  );
};
