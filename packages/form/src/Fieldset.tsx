import React from 'react';
import classNames from 'classnames';
import { Label } from '@entur/typography';
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
    {label && (
      <Label as="legend" className="eds-legend">
        {label}
      </Label>
    )}
    {children}
  </fieldset>
);
