import React, { useCallback } from 'react';
import classNames from 'classnames';
import * as Dialog from '@radix-ui/react-dialog';

import { ModalContext } from './ModalContext';

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
  onDismiss,
  initialFocusRef,
  children,
  ...rest
}) => {
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen && onDismiss) {
        onDismiss();
      }
    },
    [onDismiss],
  );

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={classNames('eds-modal__overlay', className)}
          {...rest}
        />
        <ModalContext.Provider value={{ initialFocusRef }}>
          {children}
        </ModalContext.Provider>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
