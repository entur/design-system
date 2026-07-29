import React, { useId } from 'react';

import { CloseIcon } from '@entur/icons';
import { IconButton } from '@entur/button';
import { Heading2 } from '@entur/typography';

import { ModalOverlay } from './ModalOverlay';
import { ModalContent, headingsMap } from './ModalContent';

import './Modal.scss';

export type ModalProps = {
  /** Innholdet i modalen */
  children: React.ReactNode;
  /** Skjermleser-label til lukk-knappen */
  closeLabel?: string;
  /** En ref til elementet som skal være fokusert når modalen åpnes. Defaulter til tittelen, ellers første interaktive element */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** Styrer om modalen er synlig */
  open?: boolean;
  /** Callback som kalles når brukeren ber om å lukke modalen. Påkrevd: Esc og klikk utenfor lukker alltid (nettleserens innebygde atferd for native dialog) */
  onDismiss: () => void;
  /** Om lukkeknappen skal vises i øvre høyre hjørne
   * @default true
   */
  showCloseButton?: boolean;
  /** Størrelsen på modalen */
  size: 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge';
  /** Hvordan innholdet skal plasseres i modalen
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end';
  /** Tittelen som vises i modalen */
  title?: React.ReactNode;
  /** Tilgjengelig navn for modalen når title ikke er satt */
  'aria-label'?: string;
  /** Om modalen skal lukkes når man klikker på utsiden av den
   * @default true
   */
  closeOnClickOutside?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'aria-label'>;

export const Modal = ({
  children,
  closeLabel = 'Lukk',
  initialFocusRef,
  open,
  onDismiss,
  size,
  align = 'start',
  title,
  closeOnClickOutside = true,
  showCloseButton = true,
  'aria-label': ariaLabel,
  ...rest
}: ModalProps) => {
  const randomId = useId();
  const Heading: React.ElementType = headingsMap[size] || Heading2;

  return (
    <ModalOverlay
      open={open}
      onDismiss={onDismiss}
      closeOnClickOutside={closeOnClickOutside}
      initialFocusRef={initialFocusRef}
      className={`eds-modal__overlay--size-${size}`}
      aria-labelledby={title ? randomId : undefined}
      aria-label={!title ? ariaLabel : undefined}
    >
      {showCloseButton && (
        <IconButton
          className="eds-modal__close"
          aria-label={closeLabel}
          onClick={onDismiss}
          type="button"
        >
          <CloseIcon />
        </IconButton>
      )}
      <ModalContent size={size} align={align} {...rest}>
        {title && (
          <Heading
            margin="bottom"
            as="h2"
            id={randomId}
            tabIndex={-1}
            data-autofocus={initialFocusRef ? undefined : ''}
          >
            {title}
          </Heading>
        )}
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};
