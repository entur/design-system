import React from 'react';
import classNames from 'classnames';
import { DialogOverlay } from '@reach/dialog';

export type ModalOverlayProps = {
  /** Flagg som sier om modalen er åpen */
  open?: boolean;
  /** Callback som kalles når brukeren ber om å lukke modalen */
  onDismiss?: () => void;
  /** Innholdet i modalen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** En ref til elementet som skal være fokusert når modalen åpnes. Defaulter til lukkeknappen */
  initialFocusRef?: React.RefObject<HTMLElement>;
  [key: string]: any;
};

export const ModalOverlay: React.FC<ModalOverlayProps> = ({
  className,
  open,
  ...rest
}) => (
  <DialogOverlay
    className={classNames('eds-modal__overlay', className)}
    isOpen={open}
    {...rest}
  />
);
