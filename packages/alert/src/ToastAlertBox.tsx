import React from 'react';
import { BaseAlertBox } from './BaseAlertBox';

export type ToastAlertBoxProps = {
  /** Innholdet i toasten */
  children?: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Skjermleser-label for lukkeknappen, om den vises */
  closeButtonLabel?: string;
  /** Callback som kalles når man lukker boksen */
  onClose?: () => void;
  /** Om denne er true, vil boksen få en lukkeknapp i høyre hjørne */
  closable?: boolean;
  /** Tittel på boksen - oppsummer virkning */
  title?: string;
  /** Farge og uttrykk på toasten */
  variant: 'success' | 'info';
  [key: string]: any;
};

export const ToastAlertBox: React.FC<ToastAlertBoxProps> = props => (
  <BaseAlertBox {...props} size="toast" role="status" />
);
