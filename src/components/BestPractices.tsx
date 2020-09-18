import React from 'react';
import { ValidationCheckIcon, ValidationErrorIcon } from '@entur/icons';
import classNames from 'classnames';
import './BestPractices.scss';

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
};

export const Example: React.FC<BestPracticesExampleProps> = ({
  alt = '',
  children,
  src,
  type,
  subText,
  className,
}) => {
  const Icon = type === 'do' ? ValidationCheckIcon : ValidationErrorIcon;
  return (
    <article className={classNames('best-practices__example', className)}>
      <div
        className={`best-practices__heading best-practices__heading--${type}`}
      >
        <Icon inline={true} />{' '}
        <span>{type === 'do' ? 'Innafor' : 'Uttafor'}</span>
        {src && <img src={src} alt={alt} className="best-practices__image" />}
      </div>
      {children && <div className="best-practices__content">{children}</div>}
      {subText && subText}
    </article>
  );
};
