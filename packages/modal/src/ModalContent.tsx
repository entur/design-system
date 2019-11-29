import React from 'react';
import classNames from 'classnames';
import { DialogContent } from '@reach/dialog';
import { Heading4, Heading3, Heading2 } from '@entur/typography';

export type ModalContentProps = {
  /** Innholdet i modalen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Størrelsen på modalen */
  size: 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge';
  /** Tittelen som vises i modalen */
  title: string;
};

const headingsMap = {
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
  ...rest
}) => {
  const Heading = headingsMap[size] || Heading2;
  return (
    <DialogContent
      className={classNames(
        'eds-modal__content',
        `eds-modal__content--size-${size}`,
        className,
      )}
      {...rest}
    >
      <Heading margin="bottom" as="h2">
        {title}
      </Heading>
      {children}
    </DialogContent>
  );
};
