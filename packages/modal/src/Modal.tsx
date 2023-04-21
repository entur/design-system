import React from 'react';

import { CloseIcon } from '@entur/icons';
import { IconButton } from '@entur/button';
import { Heading2 } from '@entur/typography';
import { useRandomId } from '@entur/utils';

import { ModalOverlay } from './ModalOverlay';
import { ModalContent, headingsMap } from './ModalContent';

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
  /** Hvordan innholdet skal plasseres i modalen
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end';
  /** Tittelen som vises i modalen */
  title?: React.ReactNode;
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
  align = 'start',
  title,
  closeOnClickOutside = true,
  ...rest
}) => {
  const randomId = useRandomId('eds-modal');
  const Heading: React.ElementType = headingsMap[size] || Heading2;
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
      <ModalContent size={size} align={align} {...rest}>
        {showCloseButton && (
          <IconButton
            className="eds-modal__close"
            aria-label={closeLabel}
            onClick={onDismiss}
          >
            <CloseIcon />
          </IconButton>
        )}
        {title && (
          <Heading margin="bottom" as="h2" id={randomId}>
            {title}
          </Heading>
        )}
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};
