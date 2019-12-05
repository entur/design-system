import React from 'react';
import { BaseAlertBox } from './BaseAlertBox';

export type BannerAlertBoxProps = {
  /** Innholdet i alert-boksen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Skjermleser-label for lukkeknappen, om den vises */
  closeButtonLabel?: string;
  /** Callback som kalles når man lukker boksen */
  onClose?: () => void;
  /** Om denne er true, vil boksen få en lukkeknapp i høyre hjørne
   * @default false
   */
  closable?: boolean;
  /** Tittel på boksen - oppsummer virkning */
  title?: string;
  /** Farge og uttrykk på alert-boksen */
  variant: 'success' | 'info' | 'warning' | 'error';
  [key: string]: any;
};

export const BannerAlertBox: React.FC<BannerAlertBoxProps> = props => (
  <BaseAlertBox {...props} size="banner" />
);
