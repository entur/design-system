import React from 'react';
import {
  ValidationCheckIcon,
  ValidationErrorIcon,
  ValidationExclamationIcon,
} from '@entur/icons';
import { SubLabel } from '@entur/typography';
import { VariantType } from './VariantProvider';
import classNames from 'classnames';
import './FeedbackText.scss';

const AlertIcon: React.FC<{ variant: VariantType }> = ({ variant }) => {
  const iconClass = `eds-feedback-text__icon eds-feedback-text__icon--${variant}`;
  switch (variant) {
    case 'success':
      return (
        <ValidationCheckIcon
          aria-label="Suksessmelding"
          className={iconClass}
        />
      );
    case 'error':
      return (
        <ValidationErrorIcon aria-label="Feilmelding" className={iconClass} />
      );
    case 'info':
      return null;
    case 'warning':
      return (
        <ValidationExclamationIcon
          aria-label="Varselmelding"
          className={iconClass}
        />
      );
    default:
      return null;
  }
};

export type FeedbackTextProps = {
  /** Teksten som vises */
  children: React.ReactNode;
  /** Skjuler ikonet */
  hideIcon?: boolean;
  /** Feedbackvarianten */
  variant: VariantType;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};
export const FeedbackText: React.FC<FeedbackTextProps> = ({
  children,
  hideIcon = false,
  variant,
  className,
  ...rest
}) => {
  return (
    <SubLabel
      className={classNames(
        'eds-feedback-text',
        { 'eds-feedback-text--info': variant === 'info' },
        className,
      )}
      {...rest}
    >
      {!hideIcon && <AlertIcon variant={variant} />}
      <span className="eds-feedback-text__text">{children}</span>
    </SubLabel>
  );
};
