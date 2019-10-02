import React from 'react';
import {
  ValidationCheckIcon,
  ValidationErrorIcon,
  ValidationExclamationIcon,
  ValidationInfoIcon,
} from '@entur/icons';
import * as TOKENS from '@entur/tokens';
import { Label, SubLabel } from '@entur/typography';
import './styles.scss';

type variants = 'success' | 'error' | 'warning' | 'info' | 'none';

type FormGroupProviderProps = {
  variant: variants;
  [key: string]: any;
};

const FormGroupContext = React.createContext('none');
function FormGroupProvider({ variant, ...rest }: FormGroupProviderProps) {
  return <FormGroupContext.Provider value={variant} {...rest} />;
}

export function useVariant(): variants {
  const context = React.useContext(FormGroupContext);
  return context;
}

type FormGroupProps = {
  title: string;
  alertLabel?: string;
  alertLevel: variants;
  children: React.ReactNode;
};

export const FormGroup: React.FC<FormGroupProps> = ({
  title,
  alertLabel,
  alertLevel,
  children,
}) => {
  return (
    <FormGroupProvider variant={alertLevel}>
      <Label>
        <span className="entur-form-group-title-wrapper">{title}</span>
        {children}
      </Label>
      {alertLabel && (
        <SubLabel className="entur-form-group-alert-label-wrapper">
          <AlertIcon level={alertLevel} />
          <span className="entur-form-group-sub-label">{alertLabel}</span>
        </SubLabel>
      )}
    </FormGroupProvider>
  );
};

type AlertIconProps = {
  level?: string;
};

const AlertIcon: React.FC<AlertIconProps> = ({ level }) => {
  const iconClass = 'entur-form-group-alert-icon';
  switch (level) {
    case 'success':
      return (
        <ValidationCheckIcon
          className={iconClass}
          color={TOKENS.colors.validation.mint}
        />
      );
    case 'error':
      return (
        <ValidationErrorIcon
          className={iconClass}
          color={TOKENS.colors.validation.lava}
        />
      );
    case 'info':
      return <ValidationInfoIcon className={iconClass} />;
    case 'warning':
      return <ValidationExclamationIcon className={iconClass} />;
    case 'none':
      return null;
    default:
      return null;
  }
};
