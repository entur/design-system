import React from 'react';
import {
  ValidationCheckIcon,
  ValidationErrorIcon,
  ValidationExclamationIcon,
  ValidationInfoIcon,
} from '@entur/icons';
import { Label, SubLabel } from '@entur/typography';
import { VariantType } from './variants';
import './FormGroup.scss';

type FormGroupProviderProps = {
  variant: VariantType;
  [key: string]: any;
};

const FormGroupContext = React.createContext<VariantType>('none');
function FormGroupProvider({ variant, ...rest }: FormGroupProviderProps) {
  return <FormGroupContext.Provider value={variant} {...rest} />;
}

export function useVariant(): VariantType {
  const context = React.useContext(FormGroupContext);
  return context;
}

type FormGroupProps = {
  label: string;
  feedback?: string;
  variant: VariantType;
  children: React.ReactNode;
};

export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  feedback,
  variant,
  children,
}) => {
  return (
    <FormGroupProvider variant={variant}>
      <Label>
        <span className="entur-form-group__label">{label}</span>
        {children}
      </Label>
      {feedback && (
        <SubLabel className="entur-form-group__sub-label--wrapper">
          <AlertIcon level={variant} />
          <span className="entur-form-group__sub-label--feedback">
            {feedback}
          </span>
        </SubLabel>
      )}
    </FormGroupProvider>
  );
};

const AlertIcon: React.FC<{ level: VariantType }> = ({ level }) => {
  const iconClass = `entur-form-group__icon entur-form-group__icon--${level}`;
  switch (level) {
    case 'success':
      return <ValidationCheckIcon className={iconClass} />;
    case 'error':
      return <ValidationErrorIcon className={iconClass} />;
    case 'info':
      return <ValidationInfoIcon className={iconClass} />;
    case 'warning':
      return <ValidationExclamationIcon className={iconClass} />;
    case 'none':
      return null;
  }
};
