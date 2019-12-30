import React from 'react';
import classNames from 'classnames';
import { StrongText } from './StrongText';

export type ListItemProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Tittel */
  title?: React.ReactNode;
  [key: string]: any;
};

export const ListItem: React.FC<ListItemProps> = ({
  children,
  className,
  title,
  ...rest
}) => (
  <li className={classNames('eds-list-item', className)} {...rest}>
    {title && <StrongText className="eds-list-item__title">{title}</StrongText>}
    {children}
  </li>
);
