import React from 'react';
import classNames from 'classnames';

export type BlockquotePropsBeta = {
  /** Ekstra klassenavn */
  className?: string;
} & React.DetailedHTMLProps<
  React.BlockquoteHTMLAttributes<HTMLElement>,
  HTMLQuoteElement
>;

export const BlockquoteBeta = ({
  className,
  ref,
  ...rest
}: BlockquotePropsBeta) => {
  return (
    <blockquote
      className={classNames('eds-text--blockquote', className)}
      ref={ref}
      {...rest}
    />
  );
};

type BlockquoteFooterPropsBeta = {
  /** Ekstra klassenavn */
  className?: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

export const BlockquoteFooterBeta: React.FunctionComponent<BlockquoteFooterPropsBeta> =
  ({ className, ...rest }) => {
    return (
      <footer
        className={classNames('eds-text--blockquote__footer', className)}
        {...rest}
      />
    );
  };
