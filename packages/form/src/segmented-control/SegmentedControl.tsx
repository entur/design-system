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
  /** Størrelsen på SegmentedChoice-komponentene */
  size?: 'medium' | 'large';
  [key: string]: any;
};

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  children,
  label,
  name,
  onChange,
  selectedValue,
  size = 'medium',
  ...rest
}) => {
  return (
    <SegmentedProvider
      name={name}
      selectedValue={selectedValue}
      onChange={onChange}
      multiple={false}
      size={size}
    >
      <Label as="div">{label}</Label>
      <div className="eds-segmented-control" {...rest}>
        {children}
      </div>
    </SegmentedProvider>
  );
};
