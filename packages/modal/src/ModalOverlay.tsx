import React, { useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';

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

let scrollLockCount = 0;

export const ModalOverlay: React.FC<ModalOverlayProps> = ({
  className,
  open,
  onDismiss,
  initialFocusRef,
  children,
  ...rest
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previouslyFocusedRef = useRef<Element | null>(null);

  // Open/close dialog and manage focus
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    previouslyFocusedRef.current = document.activeElement;

    if (!dialog.open) {
      dialog.showModal();
    }
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
      if (previouslyFocusedRef.current instanceof HTMLElement) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [open, initialFocusRef]);

  // Prevent native dialog close on Escape — native addEventListener
  // is used instead of onCancel JSX prop for React 16/17 compatibility
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    scrollLockCount++;
    if (scrollLockCount === 1) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      scrollLockCount--;
      if (scrollLockCount === 0) {
        document.body.style.overflow = '';
      }
    };
  }, [open]);

  // Handle Escape key — stopPropagation prevents nested modals from
  // both closing when Escape is pressed
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
      if (e.target === dialogRef.current) {
        onDismiss?.();
      }
    },
    [onDismiss],
  );

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className={classNames('eds-modal__overlay', className)}
      {...rest}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      {children}
    </dialog>
  );
};
