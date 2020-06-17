import React from 'react';
import { Paragraph } from '@entur/typography';
import cx from 'classnames';
import './Checkbox.scss';

export type CheckboxProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label for checkboxen, som vises ved høyre side. */
  children?: React.ReactNode;
  checked?: boolean | 'indeterminate';
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { checked, className, width, children, style, disabled = false, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    // Trick to allow using a ref locally, while still allowing for ref forwarding
    // Read more at https://reactjs.org/docs/hooks-reference.html#useimperativehandle
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current!);

    const isIndeterminate = checked === 'indeterminate';
    const isControlled = checked !== undefined;

    React.useEffect(() => {
      innerRef!.current!.indeterminate = isIndeterminate;
    }, [isIndeterminate]);

    return (
      <label
        className={cx('eds-checkbox__container', className, {
          'eds-checkbox--disabled': disabled,
        })}
        style={style}
      >
        <input
          type="checkbox"
          ref={innerRef}
          checked={isControlled ? checked === true : undefined}
          disabled={disabled}
          {...rest}
        />
        <span
          className={cx('eds-checkbox__icon', {
            'eds-checkbox__icon--disabled': disabled,
          })}
        >
          <CheckboxIcon indeterminate={isIndeterminate} />
        </span>
        {children && (
          <Paragraph className="eds-checkbox__label" margin="none" as="span">
            {children}
          </Paragraph>
        )}
      </label>
    );
  },
);

const CheckboxIcon: React.FC<{ indeterminate: boolean }> = ({
  indeterminate = false,
}) => {
  return (
    <svg
      className="eds-checkbox-icon"
      width="11px"
      height="9px"
      viewBox="6 11 37 33"
    >
      {indeterminate ? (
        <rect x="10" y="25" width="28" height="5" fill="white" />
      ) : (
        <path
          className="eds-checkbox-icon__path"
          d="M14.1 27.2l7.1 7.2 14.6-14.8"
          fill="none"
        />
      )}
    </svg>
  );
};
