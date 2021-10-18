import React from 'react';
import classNames from 'classnames';
import { BaseAlertBox } from './BaseAlertBox';

export type SmallAlertBoxProps = {
  /** Innholdet i alert-boksen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Skjermleser-label for lukkeknappen, om den vises */
  closeButtonLabel?: string;
  /** Om denne er true, vil boksen få en lukkeknapp i høyre hjørne
   * @default false
   */
  closable?: boolean;
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
  onClose,
  closeable = false,
  closeButtonLabel,
  ...rest
}) => (
  <BaseAlertBox
    className={classNames(className, {
      'eds-alert-box--fit-content': width === 'fit-content',
    })}
    {...rest}
    onClose={onClose}
    closeable={closeable}
    closeButtonLabel={closeButtonLabel}
    size="small"
  />
);
