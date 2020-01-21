import React from 'react';
import classNames from 'classnames';

export type NumberedListProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const NumberedList: React.FC<NumberedListProps> = ({
  className,
  ...rest
}) => <ol className={classNames('eds-numbered-list', className)} {...rest} />;
