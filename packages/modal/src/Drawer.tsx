import React from 'react';
import classNames from 'classnames';
import { MoveFocusInside } from 'react-focus-lock';
import { VisuallyHidden } from '@entur/a11y';
import { Contrast } from '@entur/layout';
import { CloseIcon } from '@entur/icons';
import { Heading3 } from '@entur/typography';
import { useRandomId } from '@entur/utils';
import { IconButton } from '@entur/button';

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
};

export const Drawer: React.FC<DrawerProps> = ({
  children,
  className,
  closeLabel = 'Lukk skuff',
  contrast = false,
  open = true,
  onDismiss,
  title,
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

  return (
    <MoveFocusInside>
      <Wrapper>
        <div
          aria-labelledby={titleId}
          className={classNames('eds-drawer', className)}
          onKeyDown={handleKeyDown}
        >
          <div className="eds-drawer__content">
            <Heading3 as="h2" id={titleId}>
              {title}
            </Heading3>
            {children}
          </div>
          <IconButton
            className="eds-drawer__close-button"
            onClick={onDismiss}
            type="button"
          >
            <CloseIcon aria-hidden />
            <VisuallyHidden>{closeLabel}</VisuallyHidden>
          </IconButton>
        </div>
      </Wrapper>
    </MoveFocusInside>
  );
};
