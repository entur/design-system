import React, { useRef, useMemo } from 'react';
import classNames from 'classnames';
import { useModalOverlay, OverlayContainer } from '@react-aria/overlays';
import { FocusScope } from '@react-aria/focus';
import type { OverlayTriggerState } from '@react-stately/overlays';

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
  const overlayRef = useRef<HTMLDivElement>(null);

  // OverlayTriggerState interface requires open/toggle/setOpen methods,
  // but we only need close() since open state is controlled externally
  const state = useMemo<OverlayTriggerState>(
    () => ({
      isOpen: !!open,
      close: () => onDismiss?.(),
      open: () => undefined,
      toggle: () => undefined,
      setOpen: () => undefined,
    }),
    [open, onDismiss],
  );

  const { modalProps, underlayProps } = useModalOverlay(
    { isDismissable: !!onDismiss },
    state,
    overlayRef,
  );

  if (!open) return null;

  return (
    <OverlayContainer>
      <div
        className={classNames('eds-modal__overlay', className)}
        {...underlayProps}
        {...rest}
      >
        <FocusScope contain restoreFocus autoFocus={!initialFocusRef}>
          <div {...modalProps} ref={overlayRef}>
            <ModalContext.Provider value={{ initialFocusRef }}>
              {children}
            </ModalContext.Provider>
          </div>
        </FocusScope>
      </div>
    </OverlayContainer>
  );
};
