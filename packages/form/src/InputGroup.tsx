import React from 'react';
import {
  ValidationCheckIcon,
  ValidationErrorIcon,
  ValidationExclamationIcon,
  ValidationInfoIcon,
} from '@entur/icons';
import { Label, SmallText } from '@entur/typography';
import { VariantType } from './variants';
import './InputGroup.scss';

const InputGroupContext = React.createContext<VariantType | null>(null);

export function useVariant(): VariantType | null {
  const context = React.useContext(InputGroupContext);
  return context;
}

type InputGroupProps = {
  /** Tekst/label over en form-komponent */
  label?: string;
  /** Varselmelding, som vil komme under form-komponenten */
  feedback?: string;
  /** Hvilken variant varselmeldingen skal ha */
  variant?: VariantType;
  /** En form-komponent */
  children: React.ReactNode;
};

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  feedback,
  variant = null,
  children,
}) => {
  return (
    <InputGroupContext.Provider value={variant}>
      <div className="entur-input-group">
        <Label style={{ display: 'block' }}>
          <span className="entur-input-group__label">{label}</span>
          {children}
        </Label>
        {feedback && variant && (
          <SmallText className="entur-input-group__feedback-wrapper">
            <AlertIcon level={variant} />
            <span className="entur-input-group__feedback">{feedback}</span>
          </SmallText>
        )}
      </div>
    </InputGroupContext.Provider>
  );
};

const AlertIcon: React.FC<{ level: VariantType }> = ({ level }) => {
  const iconClass = `entur-input-group__icon entur-input-group__icon--${level}`;
  switch (level) {
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
