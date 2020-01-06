import React from 'react';
import classNames from 'classnames';

export type UnorderedListProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const UnorderedList: React.FC<UnorderedListProps> = ({
  className,
  ...rest
}) => <ul className={classNames('eds-unordered-list', className)} {...rest} />;
