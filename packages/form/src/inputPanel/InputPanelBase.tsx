import React, { useId, useRef } from 'react';
import classNames from 'classnames';
import { VisuallyHidden } from '@entur/a11y';
import { mergeRefs, useForceUpdate } from '@entur/utils';
import { Checkbox } from '../Checkbox';
import { Radio } from '../Radio';

import './InputPanelBase.scss';

const isStringable = (node: React.ReactNode): node is string | number =>
  typeof node === 'string' || typeof node === 'number';

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
  /** Om input-panelet er skrivebeskyttet (readonly) eller ikke
   * @default false
   */
  readOnly?: boolean;
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
      readOnly = false,
      type = 'radio',
      onChange,
      checked,
      name,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = classNames('eds-input-panel', {
      'eds-input-panel--readonly': readOnly,
      'eds-input-panel--disabled': disabled,
    });

    const panelClassList = classNames(
      className,
      'eds-input-panel__container',
      `eds-input-panel--${size}`,
    );

    const inputRef = useRef<HTMLInputElement>(null);

    const defaultId = `eds-inputpanel${useId()}`;
    const inputPanelId = id || defaultId;
    const additionalContentId = children
      ? `${inputPanelId}-additional-content`
      : undefined;
    const readOnlyDescriptionId = readOnly
      ? `${inputPanelId}-readonly-description`
      : undefined;
    const describedBy =
      [additionalContentId, readOnlyDescriptionId].filter(Boolean).join(' ') ||
      undefined;
    const forceUpdate = useForceUpdate();

    // Only override the accessible name when title/secondaryLabel are plain
    // text - for a ReactNode title we can't reliably stringify it, so we
    // leave aria-label unset and let the browser compute the name from the
    // label's own content instead (the readOnly state is still announced
    // separately via aria-describedby regardless of this).
    const accessibleLabel = isStringable(title)
      ? [title, isStringable(secondaryLabel) ? secondaryLabel : undefined]
          .filter(label => label !== undefined)
          .join(' ')
      : undefined;

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (readOnly) {
        e.preventDefault();
        return;
      }

      if (onChange === undefined) {
        forceUpdate();
      }

      onChange?.(e);
    };

    const handleOnClick = (e: React.MouseEvent<HTMLInputElement>) => {
      if (readOnly) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (readOnly && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    return (
      <label className={classList} htmlFor={inputPanelId}>
        <input
          type={type}
          name={name}
          ref={mergeRefs(ref, inputRef)}
          value={value}
          checked={checked}
          onChange={handleOnChange}
          onClick={handleOnClick}
          onKeyDown={handleOnKeyDown}
          id={inputPanelId}
          disabled={disabled}
          readOnly={readOnly}
          aria-label={accessibleLabel}
          aria-describedby={describedBy}
          {...rest}
        />
        <div className={panelClassList} style={style}>
          <div className="eds-input-panel__title-wrapper">
            <div className="eds-input-panel__title">{title}</div>
            <div className="eds-input-panel__secondary-label-and-icon-wrapper">
              {secondaryLabel !== undefined && <>{secondaryLabel}</>}
              <span style={{ pointerEvents: 'none' }}>
                {!hideSelectionIndicator &&
                  (type === 'radio' ? (
                    <Radio
                      name=""
                      value=""
                      checked={checked ?? inputRef.current?.checked ?? false}
                      onChange={() => {
                        return;
                      }}
                      disabled={disabled}
                      readOnly={readOnly}
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  ) : (
                    <Checkbox
                      checked={checked ?? inputRef.current?.checked ?? false}
                      onChange={() => null}
                      disabled={disabled}
                      readOnly={readOnly}
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  ))}
              </span>
            </div>
          </div>
          {readOnly && (
            <VisuallyHidden id={readOnlyDescriptionId}>
              Kan ikke endres
            </VisuallyHidden>
          )}
          {children && (
            <div
              id={additionalContentId}
              className="eds-input-panel__additional-content"
            >
              {children}
            </div>
          )}
        </div>
      </label>
    );
  },
);
