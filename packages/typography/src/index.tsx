import React from 'react';
import classNames from 'classnames';
import './styles.scss';

type Props = {
  /** Element to render */
  as?: string | React.ElementType;
  /** Additional class names */
  className?: string;
};

export const Heading1: React.FC<Props> = ({
  as: Element = 'h1',
  className,
  ...rest
}) => <Element className={classNames('entur-h1', className)} {...rest} />;

export const Heading2: React.FC<Props> = ({
  as: Element = 'h2',
  className,
  ...rest
}) => <Element className={classNames('entur-h2', className)} {...rest} />;

export const Heading3: React.FC<Props> = ({
  as: Element = 'h3',
  className,
  ...rest
}) => <Element className={classNames('entur-h3', className)} {...rest} />;

export const Heading4: React.FC<Props> = ({
  as: Element = 'h4',
  className,
  ...rest
}) => <Element className={classNames('entur-h4', className)} {...rest} />;

export const Heading5: React.FC<Props> = ({
  as: Element = 'h5',
  className,
  ...rest
}) => <Element className={classNames('entur-h5', className)} {...rest} />;

export const Heading6: React.FC<Props> = ({
  as: Element = 'h6',
  className,
  ...rest
}) => <Element className={classNames('entur-h6', className)} {...rest} />;

export const Paragraph: React.FC<Props> = ({
  as: Element = 'p',
  className,
  ...rest
}) => (
  <Element className={classNames('entur-paragraph', className)} {...rest} />
);

export const LeadParagraph: React.FC<Props> = ({
  as: Element = 'p',
  className,
  ...rest
}) => (
  <Element
    className={classNames('entur-lead-paragraph', className)}
    {...rest}
  />
);

export const SubParagraph: React.FC<Props> = ({
  as: Element = 'p',
  className,
  ...rest
}) => (
  <Element className={classNames('entur-sub-paragraph', className)} {...rest} />
);

export const Link: React.FC<Props> = ({
  as: Element = 'a',
  className,
  ...rest
}) => <Element className={classNames('entur-link', className)} {...rest} />;

export const Label: React.FC<Props> = ({
  as: Element = 'label',
  className,
  ...rest
}) => <Element className={classNames('entur-label', className)} {...rest} />;

export const SubLabel: React.FC<Props> = ({
  as: Element = 'span',
  className,
  ...rest
}) => (
  <Element className={classNames('entur-sub-label', className)} {...rest} />
);

export const StrongText: React.FC<Props> = ({
  as: Element = 'strong',
  className,
  ...rest
}) => (
  <Element className={classNames('entur-strong-text', className)} {...rest} />
);

export const EmphasizedText: React.FC<Props> = ({
  as: Element = 'em',
  className,
  ...rest
}) => (
  <Element
    className={classNames('entur-emphasized-text', className)}
    {...rest}
  />
);

export const PreformattedText: React.FC<Props> = ({
  as: Element = 'pre',
  className,
  ...rest
}) => (
  <Element
    className={classNames('entur-preformatted-text', className)}
    {...rest}
  />
);
