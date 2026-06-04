import React, { useEffect, useId, useRef } from 'react';
import classNames from 'classnames';
import { Contrast } from '@entur/layout';
import { CloseIcon } from '@entur/icons';
import { Heading3 } from '@entur/typography';
import { IconButton } from '@entur/button';
import { ConditionalWrapper } from '@entur/utils';
import { ModalOverlay } from './ModalOverlay';

import './Drawer.scss';

export type DrawerProps = {
  /** Innholdet. Typisk tekst, lenker eller knapper */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Tekst som beskriver lukkeknappen for skjermlesere
   * @default 'Lukk skuff'
   */
  closeLabel?: string;
  /** Om draweren skal vises i mørk variant
   * @default false
   */
  contrast?: boolean;
  /** Callback som kalles når brukeren ønsker å lukke draweren */
  onDismiss: () => void;
  /** Om draweren er åpen eller ikke
   * @default true
   */
  open?: boolean;
  /** Tittel på toppen av draweren */
  title: string;
  /** Styling som sendes til Drawer */
  style?: React.CSSProperties;
  /** Legger på et overlay over resten av siden */
  overlay?: boolean;
};

export const Drawer = ({
  children,
  className,
  closeLabel = 'Lukk skuff',
  contrast = false,
  open = true,
  onDismiss,
  title,
  style,
  overlay = false,
}: DrawerProps) => {
  const titleId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<Element | null>(null);

  useEffect(
    function handleFocus() {
      if (!open || overlay) return;
      previouslyFocusedRef.current = document.activeElement;
      drawerRef.current
        ?.querySelector<HTMLElement>('[data-autofocus]')
        ?.focus();

      return () => {
        if (previouslyFocusedRef.current instanceof HTMLElement) {
          previouslyFocusedRef.current.focus();
        }
      };
    },
    [open, overlay],
  );

  const shouldRemoveFromDOM = !open && !overlay;
  if (shouldRemoveFromDOM) return null;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onDismiss();
    }
  }

  const Wrapper = contrast ? Contrast : 'div';
  const nonModalDialogProps = {
    role: 'dialog' as const,
    'aria-modal': false,
    'aria-labelledby': titleId,
  };

  return (
    <ConditionalWrapper
      condition={overlay}
      wrapper={(children: React.ReactNode) => (
        <ModalOverlay
          open={open}
          onDismiss={onDismiss}
          aria-labelledby={titleId}
        >
          {children}
        </ModalOverlay>
      )}
    >
      <Wrapper
        ref={drawerRef}
        {...(!overlay && nonModalDialogProps)}
        className={classNames('eds-drawer', className)}
        onKeyDown={handleKeyDown}
        style={style}
      >
        <IconButton
          className="eds-drawer__close-button"
          onClick={onDismiss}
          type="button"
          aria-label={closeLabel}
        >
          <CloseIcon aria-hidden />
        </IconButton>
        <div className="eds-drawer__content">
          <Heading3 as="h2" id={titleId} tabIndex={-1} data-autofocus="">
            {title}
          </Heading3>
          {children}
        </div>
      </Wrapper>
    </ConditionalWrapper>
  );
};
