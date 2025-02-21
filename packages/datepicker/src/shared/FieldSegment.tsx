import React, { useRef } from 'react';
import classNames from 'classnames';
import { useDateSegment } from '@react-aria/datepicker';
import { DateSegment, DateFieldState } from '@react-stately/datepicker';

import './FieldSegment.scss';

type TimeSegmentProps = {
  segment: DateSegment;
  state: DateFieldState;
  'aria-describedby'?: string;
};

export const FieldSegment = ({ segment, state, ...rest }: TimeSegmentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={classNames('eds-date-and-time-field__segment', {
        'eds-date-and-time-field__segment--placeholder': segment.isPlaceholder,
        'eds-date-and-time-field__segment--dot-separator':
          segment.text === '.' || segment.text === ':',
      })}
      tabIndex={state.isDisabled ? -1 : segmentProps.tabIndex}
      {...rest}
    >
      {segment.text}
    </div>
  );
};
