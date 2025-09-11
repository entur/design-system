import React from 'react';
import classNames from 'classnames';
import {
  ValidationSuccessFilledIcon,
  ValidationErrorFilledIcon,
  ValidationExclamationFilledIcon,
} from '@entur/icons';
import { useFormFieldContext } from './FormFieldContext';
import { FormFieldVariant } from '../types';

const AlertIcon: React.FC<{
  variant: FormFieldVariant;
}> = ({ variant }) => {
  const iconClass = `eds-form-field__feedback-icon eds-form-field__feedback-icon--${variant}`;
  switch (variant) {
    case 'success':
      return (
        <ValidationSuccessFilledIcon
          aria-label="Suksessmelding"
          className={iconClass}
        />
      );
    case 'negative':
      return (
        <ValidationErrorFilledIcon
          aria-label="Feilmelding"
          className={iconClass}
        />
      );
    case 'info':
      return null;
    case 'warning':
      return (
        <ValidationExclamationFilledIcon
          aria-label="Varselmelding"
          className={iconClass}
        />
      );
    default:
      return null;
  }
};

export interface FormFeedbackProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Feedback message content */
  children: React.ReactNode;
  /** Feedback variant */
  variant?: FormFieldVariant;
  /** Whether to show as alert for screen readers */
  role?: 'alert' | 'status';
  /** Whether to hide the icon */
  hideIcon?: boolean;
  /** Custom className */
  className?: string;
}

export const FormFeedback = React.forwardRef<HTMLDivElement, FormFeedbackProps>(
  ({ children, variant, role, hideIcon = false, className, ...rest }, ref) => {
    const { feedbackId, variant: contextVariant } = useFormFieldContext();
    const currentVariant = variant || contextVariant;

    if (!children) {
      return null;
    }

    return (
      <div
        ref={ref}
        id={feedbackId}
        role={role}
        className={classNames(
          'eds-form-field__feedback',
          {
            [`eds-form-field__feedback--${currentVariant}`]: currentVariant,
          },
          className,
        )}
        {...rest}
      >
        {!hideIcon && currentVariant && <AlertIcon variant={currentVariant} />}
        <span className="eds-form-field__feedback-text">{children}</span>
      </div>
    );
  },
);

FormFeedback.displayName = 'FormFeedback';
