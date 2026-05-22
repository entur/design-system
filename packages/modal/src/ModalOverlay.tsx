import React, { useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import FocusLock from 'react-focus-lock';
import classNames from 'classnames';
import { ContrastContext } from '@entur/layout';

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
  /** Om modalen skal lukkes når man klikker utenfor den
   * @default true
   */
  closeOnClickOutside?: boolean;
} & Omit<React.DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'onClick'>;

export const ModalOverlay: React.FC<ModalOverlayProps> = ({
  className,
  open,
  onDismiss,
  initialFocusRef,
  closeOnClickOutside = true,
  children,
  ...rest
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previouslyFocusedRef = useRef<Element | null>(null);

  // `data-autofocus` is what react-focus-lock targets on activation.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    previouslyFocusedRef.current = document.activeElement;

    const focusTarget = initialFocusRef?.current;
    focusTarget?.setAttribute('data-autofocus', '');

    if (!dialog.open) {
      dialog.showModal();
    }

    return () => {
      focusTarget?.removeAttribute('data-autofocus');
      if (dialog.open) {
        dialog.close();
      }
      if (previouslyFocusedRef.current instanceof HTMLElement) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [open, initialFocusRef]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [open]);

  // stopPropagation so nested modals don't both close on Escape.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onDismiss?.();
      }
    },
    [onDismiss],
  );

  // Dismiss when clicking the overlay backdrop (not children)
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (!closeOnClickOutside) return;
      if (e.target === dialogRef.current) {
        onDismiss?.();
      }
    },
    [onDismiss, closeOnClickOutside],
  );

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <ContrastContext.Provider value={false}>
      <dialog
        ref={dialogRef}
        className={classNames('eds-modal__overlay', className)}
        aria-modal="true"
        {...rest}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        <FocusLock>{children}</FocusLock>
      </dialog>
    </ContrastContext.Provider>,
    document.body,
  );
};
