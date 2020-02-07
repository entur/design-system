import React from 'react';
import { Label } from '@entur/typography';
import { SegmentedProvider, SelectedValue } from './SegmentedContext';
import './SegmentedControl.scss';

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
  [key: string]: any;
};

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  children,
  label,
  name,
  onChange,
  selectedValue,
  ...rest
}) => {
  return (
    <SegmentedProvider
      name={name}
      selectedValue={selectedValue}
      onChange={onChange}
      multiple={false}
    >
      <Label as="div">{label}</Label>
      <div className="eds-segmented-control" {...rest}>
        {children}
      </div>
    </SegmentedProvider>
  );
};
