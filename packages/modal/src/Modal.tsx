import React from 'react';
import { CloseIcon } from '@entur/icons';
import { ModalOverlay } from './ModalOverlay';
import { ModalContent } from './ModalContent';
import { IconButton } from '@entur/button';
import './Modal.scss';

export type ModalProps = {
  /** Innholdet i modalen */
  children: React.ReactNode;
  /** Skjermleser-label til lukk-knappen */
  closeLabel?: string;
  /** En ref til elementet som skal være fokusert når modalen åpnes. Defaulter til lukkeknappen */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** Flagg som sier om modalen er åpen */
  open?: boolean;
  /** Callback som kalles når brukeren ber om å lukke modalen */
  onDismiss?: () => void;
  /** Størrelsen på modalen */
  size: 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge';
  /** Tittelen som vises i modalen */
  title: string;
  /** Om modalen skal lukkes når man klikker på utsiden av den
   * @default true
   */
  closeOnClickOutside?: boolean;
  [key: string]: any;
};

export const Modal: React.FC<ModalProps> = ({
  children,
  closeLabel = 'Lukk',
  initialFocusRef,
  open,
  onDismiss,
  size,
  closeOnClickOutside = true,
  ...rest
}) => {
  const showCloseButton = ['medium', 'large', 'extraLarge'].includes(size);

  let handleOnDismiss;
  if (onDismiss && closeOnClickOutside) {
    handleOnDismiss = onDismiss;
  }
  return (
    <ModalOverlay
      open={open}
      onDismiss={handleOnDismiss}
      initialFocusRef={initialFocusRef}
    >
      <ModalContent size={size} {...rest}>
        {showCloseButton && (
          <IconButton
            className="eds-modal__close"
            aria-label={closeLabel}
            onClick={onDismiss}
          >
            <CloseIcon />
          </IconButton>
        )}
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};
