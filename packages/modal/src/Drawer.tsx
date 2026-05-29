import React, { useEffect, useId, useRef } from 'react';
import classNames from 'classnames';
import { MoveFocusInside } from 'react-focus-lock';
import { Contrast } from '@entur/layout';
import { CloseIcon } from '@entur/icons';
import { Heading3 } from '@entur/typography';
import { IconButton } from '@entur/button';

import './Drawer.scss';
import { ModalOverlay } from './ModalOverlay';

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

export const Drawer: React.FC<DrawerProps> = ({
  children,
  className,
  closeLabel = 'Lukk skuff',
  contrast = false,
  open = true,
  onDismiss,
  title,
  style,
  overlay = false,
}) => {
  const titleId = useId();
  const previouslyFocusedRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open || overlay) return;
    previouslyFocusedRef.current = document.activeElement;
    return () => {
      if (previouslyFocusedRef.current instanceof HTMLElement) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [open, overlay]);

  if (!open) {
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onDismiss();
    }
  };

  const Wrapper = contrast ? Contrast : React.Fragment;
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
      <Wrapper>
        <div
          {...(!overlay && nonModalDialogProps)}
          className={classNames('eds-drawer', className)}
          onKeyDown={handleKeyDown}
          style={style}
        >
          <MoveFocusInside>
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
          </MoveFocusInside>
        </div>
      </Wrapper>
    </ConditionalWrapper>
  );
};

const ConditionalWrapper: React.FC<{
  condition: boolean;
  wrapper: (child: JSX.Element) => JSX.Element;
  children: React.ReactElement;
}> = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;
