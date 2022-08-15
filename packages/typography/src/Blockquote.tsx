import React from 'react';
import classNames from 'classnames';

type BlockquoteProps = {
  /** Ekstra klassenavn */
  className?: string;
} & React.DetailedHTMLProps<
  React.BlockquoteHTMLAttributes<HTMLElement>,
  HTMLElement
>;

export const Blockquote: React.FunctionComponent<BlockquoteProps> = ({
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
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

export const BlockquoteFooter: React.FunctionComponent<BlockquoteFooterProps> =
  ({ className, ...rest }) => {
    return (
      <footer
        className={classNames('eds-blockquote__footer', className)}
        {...rest}
      />
    );
  };
