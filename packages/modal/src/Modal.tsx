import React from 'react';
import { CloseIcon } from '@entur/icons';
import { ModalOverlay } from './ModalOverlay';
import { ModalContent } from './ModalContent';

export type ModalProps = {
  /** Innholdet i modalen */
  children: React.ReactNode;
  /** Skjermleser-label til lukk-knappen */
  closeLabel?: string;
  /** En ref til elementet som skal være fokusert når modalen åpnes. Defaulter til lukkeknappen */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** Flagg som sier om modalen er åpen */
  isOpen?: boolean;
  /** Callback som kalles når brukeren ber om å lukke modalen */
  onDismiss?: () => void;
  /** Størrelsen på modalen */
  size: 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge';
  /** Tittelen som vises i modalen */
  title: string;
  [key: string]: any;
};

export const Modal: React.FC<ModalProps> = ({
  children,
  closeLabel = 'Lukk',
  initialFocusRef,
  isOpen,
  onDismiss,
  size,
  ...rest
}) => {
  const showCloseButton = ['medium', 'large', 'extraLarge'].includes(size);
  return (
    <ModalOverlay
      isOpen={isOpen}
      onDismiss={onDismiss}
      initialFocusRef={initialFocusRef}
    >
      <ModalContent size={size} {...rest}>
        {showCloseButton && (
          <button
            className="eds-modal__close"
            aria-label={closeLabel}
            onClick={onDismiss}
          >
            <CloseIcon />
          </button>
        )}
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};
