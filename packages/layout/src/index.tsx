import React from 'react';
import classNames from 'classnames';
import './styles.scss';

type ContrastProps = {
  /** Element to render */
  as?: string | React.ElementType;
  /** Additional class names */
  className?: string;
  [key: string]: any;
};

export const Contrast: React.FC<ContrastProps> = ({
  as: Element = 'div',
  className,
  ...rest
}) => {
  return (
    <Element className={classNames('entur-contrast', className)} {...rest} />
  );
};
