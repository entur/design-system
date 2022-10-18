import React, { useRef } from 'react';

import { useButton } from '@react-aria/button';

import { IconButton } from '@entur/button';

type CalendarButtonProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
};

export const CalendarButton = ({
  children,
  className,
  style,
  ...props
}: CalendarButtonProps) => {
  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);

  return (
    <IconButton {...buttonProps} ref={ref} className={className} style={style}>
      {children}
    </IconButton>
  );
};
