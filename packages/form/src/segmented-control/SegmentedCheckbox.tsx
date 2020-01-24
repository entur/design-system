import React from 'react';
export type SegmentedCheckboxProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label for checkboxen, som vises ved høyre side. */
  children?: React.ReactNode;
  checked?: boolean | 'indeterminate';
  [key: string]: any;
};

export const SegmentedCheckbox: React.RefForwardingComponent<
  HTMLInputElement,
  SegmentedCheckboxProps
> = React.forwardRef(
  (
    { checked, className, width, children, style, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    // const isControlled = checked !== undefined;

    return (
      <React.Fragment>
        <input type="checkbox" ref={ref} {...rest} />
        {children}
      </React.Fragment>
    );
  },
);
