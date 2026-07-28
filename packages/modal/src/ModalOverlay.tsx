import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

export const ModalOverlay = ({
  className,
  open,
  onDismiss,
  initialFocusRef,
  closeOnClickOutside = true,
  children,
  ...rest
}: ModalOverlayProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // The portal can only render after hydration — server and first client render
  // must match, and the server has no <dialog> to hydrate against.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  // Toggle native dialog open state. Always stays in DOM so the browser can
  // manage initial focus storage + restore on close.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      const target =
        initialFocusRef?.current ??
        dialog.querySelector<HTMLElement>('[data-autofocus]') ??
        dialog;
      target.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, initialFocusRef, isMounted]);

  // Esc fires cancel — preventDefault so we route through onDismiss + state,
  // which triggers the effect above to call close() (native restore runs).
  useEffect(
    function syncCancelEvent() {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const handleCancel = (e: Event) => {
        e.preventDefault();
        onDismiss?.();
      };
      dialog.addEventListener('cancel', handleCancel);
      return () => dialog.removeEventListener('cancel', handleCancel);
    },
    [onDismiss, isMounted],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (!closeOnClickOutside) return;
      if (e.target === dialogRef.current) onDismiss?.();
    },
    [onDismiss, closeOnClickOutside],
  );

  if (!isMounted) return null;

  return createPortal(
    <ContrastContext.Provider value={false}>
      <dialog
        ref={dialogRef}
        className={classNames('eds-modal__overlay', className)}
        {...rest}
        onClick={handleClick}
      >
        {open && children}
      </dialog>
    </ContrastContext.Provider>,
    document.body,
  );
};
