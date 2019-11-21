import React from 'react';
import classNames from 'classnames';
import { Heading4 } from '@entur/typography';
import './Fieldset.scss';

export type FieldsetProps = {
  /** Innholdet i felt-gruppen. */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Labelen til felt-gruppen. */
  label?: React.ReactNode;
  [key: string]: any;
} & React.HTMLProps<HTMLFieldSetElement>;

export const Fieldset: React.FC<FieldsetProps> = ({
  children,
  className,
  label,
  ...rest
}) => (
  <fieldset className={classNames('eds-fieldset', className)} {...rest}>
    {label && (
      <Heading4 as="legend" className="eds-legend">
        {label}
      </Heading4>
    )}
    {children}
  </fieldset>
);
