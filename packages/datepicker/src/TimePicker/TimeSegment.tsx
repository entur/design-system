import React, { useRef } from 'react';
import { useDateSegment } from '@react-aria/datepicker';
import { DateSegment, DateFieldState } from '@react-stately/datepicker';

type TimeSegmentProps = {
  segment: DateSegment;
  state: DateFieldState;
  isAmPm: boolean;
  index: number;
};

export const TimeSegment = ({
  segment,
  state,
  isAmPm,
  index,
}: TimeSegmentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  const segmentDisplayText = () => {
    if (isAmPm) return segment.text;
    if (index === 0 && segment.text.length === 1) return '0' + segment.text;
    return segment.text;
  };

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={`eds-timepicker__segment ${
        segment.isPlaceholder ? 'eds-timepicker__segment--placeholder' : ''
      }`}
    >
      {segmentDisplayText()}
    </div>
  );
};
