import React from 'react';
export type SegmentedRadioProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label for checkboxen, som vises ved høyre side. */
  children?: React.ReactNode;
  checked?: boolean | 'indeterminate';
  [key: string]: any;
};

export const SegmentedRadio: React.RefForwardingComponent<
  HTMLInputElement,
  SegmentedRadioProps
> = React.forwardRef(
  (
    { checked, className, width, children, style, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    // const isControlled = checked !== undefined;

    return (
      <React.Fragment>
        <input type="radio" ref={ref} {...rest} />
        {children}
      </React.Fragment>
    );
  },
);
