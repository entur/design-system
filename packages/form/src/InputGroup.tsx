import { Label } from '@entur/typography';
import classNames from 'classnames';
import React from 'react';
import { FeedbackText } from './FeedbackText';
import { InputGroupContextProvider } from './InputGroupContext';
import { VariantProvider, VariantType } from './VariantProvider';

export type InputGroupProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Tekst/label over en form-komponent */
  label?: string;
  /** Tooltip for labelen */
  labelTooltip?: string;
  /** Varselmelding, som vil komme under form-komponenten */
  feedback?: string;
  /** Hvilken variant varselmeldingen skal ha */
  variant?: VariantType;
  /** En form-komponent */
  children: React.ReactNode;
  /** Om feltet er påkrevd
   * @default false
   */
  required?: boolean;
  [key: string]: any;
};

/** @deprecated Bruk inputkomponenter direkte, med props label, variant og feedback */
export const InputGroup: React.FC<InputGroupProps> = ({
  className,
  label,
  labelTooltip,
  feedback,
  variant,
  children,
  required = false,
  ...rest
}) => {
  return (
    <VariantProvider variant={variant}>
      <InputGroupContextProvider>
        <div className={classNames('eds-input-group', className)} {...rest}>
          <Label style={{ display: 'block' }}>{children}</Label>
          {feedback && variant && (
            <FeedbackText variant={variant}>{feedback}</FeedbackText>
          )}
        </div>
      </InputGroupContextProvider>
    </VariantProvider>
  );
};
