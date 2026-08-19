import React from 'react';
import {
  ValidationErrorFilledIcon,
  ValidationExclamationFilledIcon,
  ValidationSuccessFilledIcon,
} from '@entur/icons';
import { SubLabel } from '@entur/typography';
import { VariantType } from '@entur/utils';

import classNames from 'classnames';
import './FeedbackText.scss';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

const AlertIcon = ({
  variant,
}: {
  variant: VariantType | typeof info | typeof error;
}) => {
  const iconClass = `eds-feedback-text__icon eds-feedback-text__icon--${variant}`;
  switch (variant) {
    case 'success':
      return (
        <ValidationSuccessFilledIcon aria-hidden="true" className={iconClass} />
      );
    case 'negative':
      return (
        <ValidationErrorFilledIcon aria-hidden="true" className={iconClass} />
      );
    case 'information':
      return null;
    case 'warning':
      return (
        <ValidationExclamationFilledIcon
          aria-hidden="true"
          className={iconClass}
        />
      );
    case error:
      return (
        <ValidationErrorFilledIcon aria-hidden="true" className={iconClass} />
      );
    case info:
      return null;
    default:
      return null;
  }
};

export type FeedbackTextProps = {
  /** Teksten som vises. Uten tekst rendres en tom (usynlig) container,
   * slik at en aria-live-region kan eksistere i DOM før meldingen settes */
  children?: React.ReactNode;
  /** Skjuler ikonet */
  hideIcon?: boolean;
  /** Feedbackvarianten*/
  variant?: VariantType | typeof error | typeof info;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};
export const FeedbackText = ({
  children,
  hideIcon = false,
  variant,
  className,
  ...rest
}: FeedbackTextProps) => {
  const hasContent = children !== undefined && children !== null;
  return (
    <SubLabel
      className={classNames(
        'eds-feedback-text',
        {
          'eds-feedback-text--information':
            variant === info || variant === 'information',
          'eds-feedback-text--empty': !hasContent,
        },
        className,
      )}
      {...rest}
    >
      {hasContent && !hideIcon && variant && <AlertIcon variant={variant} />}
      {hasContent && (
        <span className="eds-feedback-text__text">{children}</span>
      )}
    </SubLabel>
  );
};
