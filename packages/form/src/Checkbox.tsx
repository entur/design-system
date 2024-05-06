import React, { CSSProperties } from 'react';
import cx from 'classnames';
import { Paragraph } from '@entur/typography';
import { mergeRefs } from '@entur/utils';

import './Checkbox.scss';

export type CheckboxProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label for checkboxen, som vises ved høyre side. */
  children?: React.ReactNode;
  /** Om Checkbox er avmerket, eller om den er i en indeterminate state */
  checked?: 'indeterminate' | boolean;
  /** Callback for Checkbox */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Om checkboxen er disabled eller ikke
   * @default false
   */
  disabled?: boolean;
  /**Ekstra styling til komponenten */
  style?: CSSProperties;
  /** Reduserer klikkflaten for Checkbox'en
   * @default false
   */
  reduceClickArea?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'checked'>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      className,
      children,
      style,
      disabled = false,
      reduceClickArea,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const isIndeterminate = checked === 'indeterminate';
    const isControlled = checked !== undefined;

    React.useEffect(() => {
      if (inputRef && inputRef.current) {
        inputRef.current.indeterminate = isIndeterminate;
      }
    }, [isIndeterminate]);

    return (
      <label
        className={cx('eds-checkbox__container', className, {
          'eds-checkbox--disabled': disabled,
          'eds-checkbox__container--reduced-click-area': reduceClickArea,
        })}
        style={style}
      >
        <input
          type="checkbox"
          ref={mergeRefs(ref, inputRef)}
          checked={isControlled ? checked === true : undefined}
          disabled={disabled}
          {...rest}
        />
        <span
          className={cx('eds-checkbox__icon', {
            'eds-checkbox__icon--disabled': disabled,
            'eds-checkbox__icon--reduced-click-area': reduceClickArea,
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
      aria-hidden={true}
    >
      {indeterminate ? (
        <rect x="10" y="25" width="28" height="5" fill="white" />
      ) : (
        <path d="M14.1 27.2l7.1 7.2 14.6-14.8" fill="none" />
      )}
    </svg>
  );
};
