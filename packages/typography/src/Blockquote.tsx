import React from 'react';
import classNames from 'classnames';

type BlockquoteProps = {
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const Blockquote: React.FC<BlockquoteProps> = ({
  className,
  ...rest
}) => {
  return (
    <blockquote className={classNames('eds-blockquote', className)} {...rest} />
  );
};

type BlockquoteFooterProps = {
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const BlockquoteFooter: React.FC<BlockquoteFooterProps> = ({
  className,
  ...rest
}) => {
  return (
    <footer
      className={classNames('eds-blockquote__footer', className)}
      {...rest}
    />
  );
};
