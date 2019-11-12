import React from 'react';
import classNames from 'classnames';
import { BaseAlertBox } from './BaseAlertBox';

type SmallAlertBoxProps = {
  /** Innholdet i alert-boksen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Skjermleser-label for lukkeknappen, om den vises */
  closeButtonLabel?: string;
  /** Callback som kalles når man lukker boksen */
  onClose?: () => void;
  /** Tittel på boksen - oppsummer virkning */
  title?: string;
  /** Bredden på boksen - fullbredde eller tilpasset innholdet */
  width?: 'fluid' | 'fit-content';
  /** Farge og uttrykk på alert-boksen */
  variant: 'success' | 'info' | 'warning' | 'error';
  [key: string]: any;
};

export const SmallAlertBox: React.FC<SmallAlertBoxProps> = ({
  className,
  width,
  ...rest
}) => (
  <BaseAlertBox
    className={classNames(className, {
      'eds-alert-box--fit-content': width === 'fit-content',
    })}
    {...rest}
    closable={false}
    size="small"
  />
);
