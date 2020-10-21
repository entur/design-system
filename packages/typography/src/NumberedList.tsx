import React from 'react';
import classNames from 'classnames';

export type NumberedListProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
} & React.OlHTMLAttributes<HTMLOListElement>;

export const NumberedList: React.FC<NumberedListProps> = ({
  className,
  type = '1',
  ...rest
}) => (
  <ol
    className={classNames(
      'eds-numbered-list',
      { [`eds-numbered-list--type-${type}`]: type },
      className,
    )}
    type={type}
    {...rest}
  />
);
