import React from 'react';
import {
  ValidationCheckIcon,
  ValidationErrorIcon,
  ValidationExclamationIcon,
  ValidationInfoIcon,
} from '@entur/icons';
import { SmallText } from '@entur/typography';
import { VariantType } from './VariantProvider';
import classNames from 'classnames';
import './FeedbackText.scss';

const AlertIcon: React.FC<{ variant: VariantType }> = ({ variant }) => {
  const iconClass = `eds-feedback-text__icon eds-feedback-text__icon--${variant}`;
  switch (variant) {
    case 'success':
      return <ValidationCheckIcon className={iconClass} />;
    case 'error':
      return <ValidationErrorIcon className={iconClass} />;
    case 'info':
      return <ValidationInfoIcon className={iconClass} />;
    case 'warning':
      return <ValidationExclamationIcon className={iconClass} />;
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
    <SmallText className={classNames('eds-feedback-text', className)} {...rest}>
      {!hideIcon && <AlertIcon variant={variant} />}
      {children}
    </SmallText>
  );
};
