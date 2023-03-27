import React, { useRef } from 'react';
import classNames from 'classnames';
import { mergeRefs, useRandomId, useForceUpdate } from '@entur/utils';
import { Checkbox } from '../Checkbox';
import { Radio } from '../Radio';

import './InputPanelBase.scss';

export type InputPanelProps = {
  /** Om det er en radio- eller checkbox-variant */
  type: string;
  /** Verdien til input-panelet */
  value: string;
  /** Om input-panelet skal være valgt eller ikke */
  checked?: boolean;
  /** Hovedtittelen til input-panelet */
  title: React.ReactNode;
  /** Ektstra label som står høyrestilt, til venstre for Checkboxen/Radio-button-en */
  secondaryLabel?: React.ReactNode;
  /** Ekstra informasjon som legges nederst i input-panelet */
  children?: React.ReactNode;
  /** Størrelse på input-panelet
   * @default "medium"
   */
  size?: 'medium' | 'large';
  /**Skjuler checkbox-/radio-button-en i input-panelet
   * @default false
   */
  hideSelectionIndicator?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  /** Om input-panelet er deaktivert eller ikke
   * @default false
   */
  disabled?: boolean;
  /** */
  style?: React.CSSProperties;
} & Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'title' | 'size'
>;

export const InputPanelBase = React.forwardRef<
  HTMLInputElement,
  InputPanelProps
>(
  (
    {
      className,
      children,
      value,
      title,
      secondaryLabel,
      size = 'medium',
      hideSelectionIndicator = false,
      style,
      id,
      disabled = false,
      type = 'radio',
      onChange,
      checked,
      name,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = classNames(
      className,
      'eds-input-panel__container',
      `eds-input-panel--${size}`,
    );

    const inputRef = useRef<HTMLInputElement>(null);

    const defaultId = useRandomId('eds-inputpanel');
    const inputPanelId = id || defaultId;
    const forceUpdate = useForceUpdate();

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange === undefined) forceUpdate();
      onChange?.(e);
    };

    return (
      <label className="eds-input-panel" htmlFor={inputPanelId}>
        <input
          type={type}
          name={name}
          ref={mergeRefs(ref, inputRef)}
          value={value}
          checked={checked}
          onChange={handleOnChange}
          id={inputPanelId}
          disabled={disabled}
          {...rest}
        />
        <div className={classList} style={style}>
          <div className="eds-input-panel__title-wrapper">
            <div className="eds-input-panel__title">{title}</div>
            <div className="eds-input-panel__secondary-label-and-icon-wrapper">
              {secondaryLabel !== undefined && <>{secondaryLabel}</>}
              <span style={{ pointerEvents: 'none' }}>
                {!(disabled || hideSelectionIndicator) &&
                  (type === 'radio' ? (
                    <Radio
                      name=""
                      value=""
                      checked={checked ?? inputRef.current?.checked ?? false}
                      onChange={() => {
                        return;
                      }}
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  ) : (
                    <Checkbox
                      checked={checked ?? inputRef.current?.checked ?? false}
                      onChange={() => null}
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  ))}
              </span>
            </div>
          </div>
          {children && (
            <div className="eds-input-panel__additional-content">
              {children}
            </div>
          )}
        </div>
      </label>
    );
  },
);
