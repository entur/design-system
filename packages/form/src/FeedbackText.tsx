import React from 'react';
import {
  ValidationSuccessFilledIcon,
  ValidationErrorFilledIcon,
  ValidationExclamationFilledIcon,
} from '@entur/icons';
import { SubLabel } from '@entur/typography';
import { VariantType } from '@entur/utils';

import classNames from 'classnames';
import './FeedbackText.scss';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

const AlertIcon: React.FC<{
  variant: VariantType | typeof info | typeof error;
}> = ({ variant }) => {
  const iconClass = `eds-feedback-text__icon eds-feedback-text__icon--${variant}`;
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
    case 'information':
      return null;
    case 'warning':
      return (
        <ValidationExclamationFilledIcon
          aria-label="Varselmelding"
          className={iconClass}
        />
      );
    case error:
      return (
        <ValidationErrorFilledIcon
          aria-label="Feilmelding"
          className={iconClass}
        />
      );
    case info:
      return null;
    default:
      return null;
  }
};

export type FeedbackTextProps = {
  /** Teksten som vises */
  children: React.ReactNode;
  /** Skjuler ikonet */
  hideIcon?: boolean;
  /** Feedbackvarianten*/
  variant: VariantType | typeof error | typeof info;
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
        {
          'eds-feedback-text--information':
            variant === info || variant === 'information',
        },
        className,
      )}
      {...rest}
    >
      {!hideIcon && <AlertIcon variant={variant} />}
      <span className="eds-feedback-text__text">{children}</span>
    </SubLabel>
  );
};
