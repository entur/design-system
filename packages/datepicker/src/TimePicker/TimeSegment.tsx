import React, { useRef } from 'react';
import classNames from 'classnames';
import { useDateSegment } from '@react-aria/datepicker';
import { DateSegment, DateFieldState } from '@react-stately/datepicker';

type TimeSegmentProps = {
  segment: DateSegment;
  state: DateFieldState;
};

export const TimeSegment = ({ segment, state }: TimeSegmentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  const is12HourFormatted = state.segments.some(
    segment => segment.text === 'AM' || segment.text === 'PM',
  );

  const segmentDisplayText = () => {
    if (is12HourFormatted) return segment.text;
    // if number add '0' padding to start when one digit
    if (segment.text.match(/\d+/)) return segment.text.padStart(2, '0');
    return segment.text;
  };

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={classNames('eds-timepicker__segment', {
        'eds-timepicker__segment--placeholder': segment.isPlaceholder,
      })}
    >
      {segmentDisplayText()}
    </div>
  );
};
