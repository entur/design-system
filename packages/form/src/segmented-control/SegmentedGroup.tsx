import React from 'react';
import { Label } from '@entur/typography';
import {
  SegmentedGroupProvider,
  SelectedValue,
  SelectedValues,
} from './SegmentedGroupContext';
import './SegmentedGroup.scss';

export type SegmentedGroupProps = {
  /** Navn på input-elementene, for når multiple: false */
  name?: string;
  /** Beskrivende tekst */
  label?: string;
  /** En eller flere SegmentedControl-funksjoner */
  children: React.ReactNode;
  [key: string]: any;
} & (
  | {
      /** Den eller de valgte verdiene */
      selectedValue: SelectedValue;
      /** Om man skal kunne velge flere valg */
      multiple: false;
      /** Callback for når det gjøres et valg. Om multiple er false */
      onChange: (value: SelectedValue) => void;
    }
  | {
      /** Den eller de valgte verdiene */
      selectedValue: SelectedValues;
      /** Om man skal kunne velge flere valg */
      multiple: true;
      /** Callback for når det gjøres et valg. Om multiple er false */
      onChange: (value: SelectedValues) => void;
    });

export const SegmentedGroup: React.FC<SegmentedGroupProps> = ({
  children,
  label,
  multiple,
  name,
  onChange,
  selectedValue,
  ...rest
}) => {
  return (
    <SegmentedGroupProvider
      name={name}
      selectedValue={selectedValue as any}
      onChange={onChange as any}
      multiple={multiple as any}
    >
      <Label as="div">{label}</Label>
      <div className="eds-segmented-group" {...rest}>
        {children}
      </div>
    </SegmentedGroupProvider>
  );
};

export type SegmentedCheckboxGroupProps = {
  /** Labelenn for gruppen */
  label: string;
  /** SegmentedControl-komponentene */
  children: React.ReactNode;
  onChange: (e: React.ChangeEvent) => void;
};
