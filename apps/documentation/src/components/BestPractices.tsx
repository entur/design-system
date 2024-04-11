import React from 'react';
import {
  ValidationSuccessFilledIcon,
  ValidationErrorFilledIcon,
} from '@entur/icons';
import classNames from 'classnames';
import './BestPractices.scss';
import { Contrast } from '@entur/layout';

export const BestPractices: React.FC<{ className?: string }> = props => (
  <section className={classNames('best-practices', props.className)}>
    {props.children}
  </section>
);

type BestPracticesExampleProps = {
  src?: string;
  alt?: string;
  type: 'do' | 'dont';
  subText?: string;
  className?: string;
  contrast?: boolean;
};

export const Example: React.FC<BestPracticesExampleProps> = ({
  alt = '',
  children,
  src,
  type,
  subText,
  className,
  contrast = false,
}) => {
  const Icon =
    type === 'do' ? ValidationSuccessFilledIcon : ValidationErrorFilledIcon;
  const Element = contrast ? Contrast : 'div';
  return (
    <article className={classNames('best-practices__example', className)}>
      <Element
        className={`best-practices__heading best-practices__heading--${type}`}
      >
        <Icon inline={true} aria-hidden="true" />{' '}
        <span>{type === 'do' ? 'Innafor' : 'Uttafor'}</span>
        {src && <img src={src} alt={alt} className="best-practices__image" />}
      </Element>
      {children && <div className="best-practices__content">{children}</div>}
      {subText && subText}
    </article>
  );
};
