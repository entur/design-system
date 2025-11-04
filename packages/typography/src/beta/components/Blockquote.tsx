import React from 'react';
import classNames from 'classnames';

import './text.scss';

export type BlockquoteProps = {
  /** Ekstra klassenavn */
  className?: string;
} & React.DetailedHTMLProps<
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
  HTMLQuoteElement
>;

export const Blockquote = ({ className, ...rest }: BlockquoteProps) => {
  return (
    <blockquote
      className={classNames('eds-text', 'eds-text--blockquote', className)}
      {...rest}
    />
  );
};

type BlockquoteFooterProps = {
  /** Ekstra klassenavn */
  className?: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

export const BlockquoteFooter = ({
  className,
  ...rest
}: BlockquoteFooterProps) => {
  return (
    <footer
      className={classNames(
        'eds-text',
        'eds-text--blockquote__footer',
        className,
      )}
      {...rest}
    />
  );
};
