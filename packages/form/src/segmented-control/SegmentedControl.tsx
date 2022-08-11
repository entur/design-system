import React from 'react';
import { SegmentedProvider, SelectedValue } from './SegmentedContext';
import { Fieldset } from '../Fieldset';
import classNames from 'classnames';
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
  return (
    <SegmentedProvider
      name={name}
      selectedValue={selectedValue}
      onChange={onChange}
      multiple={false}
      size={size}
    >
      <Fieldset label={label}>
        <div
          className={classNames('eds-segmented-control', className)}
          {...rest}
        >
          {children}
        </div>
      </Fieldset>
    </SegmentedProvider>
  );
};
