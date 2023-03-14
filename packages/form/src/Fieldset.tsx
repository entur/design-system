import React from 'react';
import classNames from 'classnames';
import { Heading5 } from '@entur/typography';
import './Fieldset.scss';

export type FieldsetProps = {
  /** Innholdet i felt-gruppen. */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Labelen til felt-gruppen. */
  label?: React.ReactNode;
  [key: string]: any;
};

export const Fieldset: React.FC<FieldsetProps> = ({
  children,
  className,
  label,
  ...rest
}) => (
  <fieldset className={classNames('eds-fieldset', className)} {...rest}>
    {label && <Heading5 as="legend">{label}</Heading5>}
    {children}
  </fieldset>
);
