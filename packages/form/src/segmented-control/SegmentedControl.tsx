import React from 'react';
import { SegmentedProvider, SelectedValue } from './SegmentedContext';
import classNames from 'classnames';
import './SegmentedControl.scss';
import { Label } from '@entur/typography';
import { useRandomId } from '@entur/utils';

export type SegmentedControlProps = {
  /** Navn på input-elementene */
  name?: string;
  /** Beskrivende tekst */
  label?: string;
  /** En eller flere SegmentedChoice-komponenter */
  children: React.ReactNode;
  /** Den valgte verdien */
  selectedValue: SelectedValue;
  /** Callback for når det gjøres et valg */
  onChange: (value: SelectedValue) => void;
  /** Størrelsen på SegmentedChoice-komponentene */
  size?: 'medium' | 'large';
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  children,
  label,
  name,
  onChange,
  selectedValue,
  size = 'medium',
  className,
  ...rest
}) => {
  const id = useRandomId('eds-segmented-control');
  return (
    <SegmentedProvider
      name={name}
      selectedValue={selectedValue}
      onChange={onChange}
      multiple={false}
      size={size}
    >
      <div
        className={classNames('eds-segmented-control', className)}
        role="radiogroup"
        {...rest}
      >
        {label !== undefined && <Label htmlFor={id}>{label}</Label>}
        <input
          name={rest.name ?? 'segmented-control'}
          value={selectedValue ?? undefined}
          type="hidden"
          id={id}
        />
        <div className="eds-segmented-control__choices">{children}</div>
      </div>
    </SegmentedProvider>
  );
};
