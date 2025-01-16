import React from 'react';
import classNames from 'classnames';
import { MoveFocusInside } from 'react-focus-lock';
import { Contrast } from '@entur/layout';
import { CloseIcon } from '@entur/icons';
import { Heading3 } from '@entur/typography';
import { useRandomId } from '@entur/utils';
import { IconButton } from '@entur/button';

import './Drawer.scss';
import { ModalOverlay } from './ModalOverlay';
import { DialogContent } from '@reach/dialog';

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
  const titleId = useRandomId('eds-drawer');

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
  const ContentContainer = overlay ? DialogContent : 'div';
  return (
    <ConditionalWrapper
      condition={overlay}
      wrapper={(children: React.ReactNode) => (
        <ModalOverlay open={open} onDismiss={onDismiss}>
          {children}
        </ModalOverlay>
      )}
    >
      <Wrapper>
        <ContentContainer
          aria-labelledby={titleId}
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
              <Heading3 as="h2" id={titleId}>
                {title}
              </Heading3>
              {children}
            </div>
          </MoveFocusInside>
        </ContentContainer>
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
