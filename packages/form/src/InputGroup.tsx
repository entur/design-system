import React from 'react';
import { Label } from '@entur/typography';
import classNames from 'classnames';
import { FeedbackText } from './FeedbackText';
import { VariantType, VariantProvider } from './VariantProvider';
import './InputGroup.scss';

export type InputGroupProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Tekst/label over en form-komponent */
  label?: string;
  /** Varselmelding, som vil komme under form-komponenten */
  feedback?: string;
  /** Hvilken variant varselmeldingen skal ha */
  variant?: VariantType;
  /** En form-komponent */
  children: React.ReactNode;
  [key: string]: any;
};

export const InputGroup: React.FC<InputGroupProps> = ({
  className,
  label,
  feedback,
  variant,
  children,
  ...rest
}) => {
  return (
    <VariantProvider variant={variant}>
      <div className={classNames('eds-input-group', className)} {...rest}>
        <Label style={{ display: 'block' }}>
          <span className="eds-input-group__label">{label}</span>
          {children}
        </Label>
        {feedback && variant && (
          <FeedbackText variant={variant}>{feedback}</FeedbackText>
        )}
      </div>
    </VariantProvider>
  );
};
