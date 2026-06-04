import React, { useId } from 'react';
import classNames from 'classnames';
import { Heading4, Heading3, Heading2 } from '@entur/typography';

export type ModalContentProps = {
  /** Innholdet i modalen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Størrelsen på modalen */
  size: 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge';
  /** Tittelen som vises i modalen */
  title?: React.ReactNode;
  /** Hvordan innholdet skal plasseres i modalen
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end';
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>;

export const headingsMap = {
  extraSmall: Heading4,
  small: Heading3,
  medium: Heading2,
  large: Heading2,
  extraLarge: Heading2,
};

export const ModalContent = ({
  children,
  className,
  size,
  title,
  align = 'start',
  ...rest
}: ModalContentProps) => {
  const Heading: React.ElementType = headingsMap[size] || Heading2;
  const randomId = useId();
  return (
    <div
      className={classNames(
        'eds-modal__content',
        `eds-modal__content--size-${size}`,
        `eds-modal__content--align-${align}`,
        className,
      )}
      aria-labelledby={title ? randomId : undefined}
      {...rest}
    >
      {title && (
        <Heading margin="bottom" as="h2" id={randomId}>
          {title}
        </Heading>
      )}
      {children}
    </div>
  );
};
