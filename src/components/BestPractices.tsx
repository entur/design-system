import React from 'react';
import { ValidationCheckIcon, ValidationErrorIcon } from '@entur/icons';
import './BestPractices.scss';

export const BestPractices: React.FC = props => (
  <section className="best-practices">{props.children}</section>
);

type BestPracticesExampleProps = {
  src?: string;
  alt?: string;
  type: 'do' | 'dont';
};

export const Example: React.FC<BestPracticesExampleProps> = ({
  alt = '',
  children,
  src,
  type,
}) => {
  const Icon = type === 'do' ? ValidationCheckIcon : ValidationErrorIcon;
  return (
    <article className="best-practices__example">
      <div
        className={`best-practices__heading best-practices__heading--${type}`}
      >
        <Icon inline={true} />{' '}
        <span>{type === 'do' ? 'Innafor' : 'Uttafor'}</span>
        {src && <img src={src} alt={alt} className="best-practices__image" />}
      </div>
      {children && <div className="best-practices__content">{children}</div>}
    </article>
  );
};
