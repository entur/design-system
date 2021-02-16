import React from 'react';
import { Label } from '@entur/typography';
import { SegmentedProvider, SelectedValues } from './SegmentedContext';
import './SegmentedControl.scss';

export type MultipleSegmentedControlProps = {
  /** Navn på input-elementene */
  name?: string;
  /** Beskrivende tekst */
  label?: string;
  /** En eller flere SegmentedChoice-komponenter */
  children: React.ReactNode;
  /** Den eller de valgte verdiene */
  selectedValue: SelectedValues;
  /** Callback for når det gjøres et valg */
  onChange: (value: SelectedValues) => void;
  [key: string]: any;
};

/**This component is not used by anyone, and is therefore deprecated
 * @deprecated
 */
export const MultipleSegmentedControl: React.FC<MultipleSegmentedControlProps> = ({
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
      multiple={true}
      size="medium"
    >
      <Label as="div">{label}</Label>
      <div className="eds-segmented-control" {...rest}>
        {children}
      </div>
    </SegmentedProvider>
  );
};
