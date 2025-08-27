import React from 'react';
import classNames from 'classnames';

export type BlockquotePropsBeta = {
  /** Ekstra klassenavn */
  className?: string;
} & React.DetailedHTMLProps<
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
  HTMLQuoteElement
>;

export const BlockquoteBeta = ({ className, ...rest }: BlockquotePropsBeta) => {
  return (
    <blockquote
      className={classNames('eds-text--blockquote', className)}
      {...rest}
    />
  );
};

type BlockquoteFooterPropsBeta = {
  /** Ekstra klassenavn */
  className?: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

export const BlockquoteFooterBeta = ({
  className,
  ...rest
}: BlockquoteFooterPropsBeta) => {
  return (
    <footer
      className={classNames('eds-text--blockquote__footer', className)}
      {...rest}
    />
  );
};
