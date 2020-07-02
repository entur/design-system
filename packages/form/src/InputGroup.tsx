import React from 'react';
import { Label } from '@entur/typography';
import { QuestionIcon } from '@entur/icons';
import { Tooltip } from '@entur/tooltip';
import classNames from 'classnames';
import { FeedbackText } from './FeedbackText';
import { VariantType, VariantProvider } from './VariantProvider';
import './InputGroup.scss';

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
      <div className={classNames('eds-input-group', className)} {...rest}>
        <Label style={{ display: 'block' }}>
          <span className="eds-input-group__label">
            {label} {required && <span>*</span>}
            {labelTooltip && (
              <Tooltip content={labelTooltip} placement="right">
                <span className="eds-input-group__label-tooltip-icon">
                  <QuestionIcon />
                </span>
              </Tooltip>
            )}
          </span>
          {children}
        </Label>
        {feedback && variant && (
          <FeedbackText variant={variant}>{feedback}</FeedbackText>
        )}
      </div>
    </VariantProvider>
  );
};
