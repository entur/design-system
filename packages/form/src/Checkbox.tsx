import React from 'react';
import { Paragraph } from '@entur/typography';
import cx from 'classnames';
import './Checkbox.scss';

export type CheckboxProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label for checkboxen, som vises ved høyre side. */
  children?: React.ReactNode;
  [key: string]: any;
};

export const Checkbox: React.RefForwardingComponent<
  HTMLInputElement,
  CheckboxProps
> = React.forwardRef(
  (
    { className, width, children, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    return (
      <label
        className={cx('eds-form-component--checkbox__container', className)}
      >
        <input type="checkbox" ref={ref} {...rest} />
        <span className="eds-form-component--checkbox__icon">
          <CheckboxIcon />
        </span>
        {children && <Paragraph as="span">{children}</Paragraph>}
      </label>
    );
  },
);

function CheckboxIcon() {
  return (
    <svg
      width="11px"
      height="9px"
      viewBox="6 11 37 33"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path id="path-1" d="M14.1 27.2l7.1 7.2 14.6-14.8" fill="none"></path>
    </svg>
  );
}
