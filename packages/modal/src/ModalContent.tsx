import React from 'react';
import classNames from 'classnames';
import { DialogContent } from '@reach/dialog';
import { Heading4, Heading3, Heading2 } from '@entur/typography';
import { useRandomId } from '@entur/utils';

export type ModalContentProps = {
  /** Innholdet i modalen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Størrelsen på modalen */
  size: 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge';
  /** Tittelen som vises i modalen */
  title?: string;
  /** Hvordan innholdet skal plasseres i modalen
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end';
  [key: string]: any;
};

export const headingsMap = {
  extraSmall: Heading4,
  small: Heading3,
  medium: Heading2,
  large: Heading2,
  extraLarge: Heading2,
};

export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  className,
  size,
  title,
  align = 'start',
  ...rest
}) => {
  const Heading: React.ElementType = headingsMap[size] || Heading2;
  const randomId = useRandomId('eds-modal');
  return (
    <DialogContent
      className={classNames(
        'eds-modal__content',
        `eds-modal__content--size-${size}`,
        `eds-modal__content--align-${align}`,
        className,
      )}
      aria-labelledby={randomId}
      {...rest}
    >
      {title && (
        <Heading margin="bottom" as="h2" id={randomId}>
          {title}
        </Heading>
      )}
      {children}
    </DialogContent>
  );
};
