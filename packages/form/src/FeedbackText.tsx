import React from 'react';
import {
  ValidationCheckIcon,
  ValidationErrorIcon,
  ValidationExclamationIcon,
  ValidationInfoIcon,
} from '@entur/icons';
import { SmallText } from '@entur/typography';
import { VariantType } from './VariantProvider';
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
  children: React.ReactNode;
  hideIcon?: boolean;
  variant: VariantType;
};
export const FeedbackText: React.FC<FeedbackTextProps> = ({
  children,
  hideIcon = false,
  variant,
}) => {
  return (
    <SmallText className="eds-feedback-text">
      {!hideIcon && <AlertIcon variant={variant} />}
      {children}
    </SmallText>
  );
};
