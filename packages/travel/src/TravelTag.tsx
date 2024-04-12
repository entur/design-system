import React, { cloneElement, useEffect, useRef } from 'react';
import classNames from 'classnames';
import {
  CloseSmallIcon,
  ValidationInfoFilledIcon,
  ValidationErrorFilledIcon,
  ValidationExclamationFilledIcon,
} from '@entur/icons';
import { useContrast } from '@entur/layout';

import { getTransportStyle } from './utils';

import type { Transport } from './utils';

import './TravelTag.scss';

export type TravelTagProps = {
  /** Callback som kalles for når man skal lukke TravelTag-en
   * @default undefined
   */
  onClose?: () => void;
  /** Innholdet inne i TravelTag-en */
  children?: React.ReactNode;
  /**Ekstra klassenavn */
  className?: string;
  /** Legger til et Valideringsikon i TravelTagen for å signalisere avvik, informasjon e.l.
   * @default "none"
   */
  alert?: 'none' | 'error' | 'warning' | 'info';
  /** Legger til farge og ikon tilpasset valgt transportmiddel */
  transport?: Transport;
  /** Element ved siden av eller under TravelTag.  */
  label?: React.ReactNode;
  /** Posisjonen til label-en i forhold til TravelTag-en
   * @default "right"
   */
  labelPlacement?: 'bottom' | 'right';
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const TravelTag: React.FC<TravelTagProps> = ({
  children,
  className,
  alert = 'none',
  transport = 'none',
  label,
  labelPlacement = 'right',
  onClose = undefined,
  ...rest
}) => {
  const isContrast = useContrast();
  const isClosable = onClose ? true : false;
  const transportIsSet = transport !== 'none';
  const alertIsSet = alert !== 'none';
  const tagRef = useRef<HTMLDivElement>(null);
  const numberOfChildren = React.Children.count(children);
  const { Icon, ariaLabel: ariaLabelForTranportIcon } =
    getTransportStyle(transport);
  const deCapitalizeTransport = transport.toLowerCase();
  const IconWithAriaHidden = cloneElement(<Icon />, { 'aria-hidden': 'true' });

  const backgroundColor =
    'var(--components-travel-traveltag-standard-tagfill-' +
    deCapitalizeTransport +
    ')';
  const contrastBackgroundColor =
    'var(--components-travel-traveltag-contrast-tagfill-' +
    deCapitalizeTransport +
    ')';
  // Error colors
  const errorBackgroundColor =
    'var(--components-travel-traveltag-standard-tagfill-' +
    deCapitalizeTransport +
    '-cancled)';
  const errorContrastBackgroundColor =
    'var(--components-travel-traveltag-contrast-tagfill-' +
    deCapitalizeTransport +
    '-cancled)';
  const errorContrastTextColor =
    'var(--components-travel-traveltag-contrast-text-line-' +
    deCapitalizeTransport +
    '-cancled)';
  const errorTextColor =
    'var(--components-travel-traveltag-standard-text-line-' +
    deCapitalizeTransport +
    '-cancled)';

  useEffect(() => {
    if (transportIsSet) {
      let colorToSet;
      let textColorToSet;
      // Walk has another icon/text color then the other transports
      if (transport === 'walk') {
        tagRef.current?.style.setProperty(
          '--text-color',
          'var(--components-travel-traveltag-standard-icon-walk)',
        );
      }
      // Error
      if (alert === 'error') {
        colorToSet = isContrast
          ? errorContrastBackgroundColor
          : errorBackgroundColor;
        textColorToSet = isContrast ? errorContrastTextColor : errorTextColor;
        tagRef.current?.style.setProperty('--text-color', `${textColorToSet}`);
      } else {
        colorToSet = isContrast ? contrastBackgroundColor : backgroundColor;
      }
      tagRef.current?.style.setProperty('--background-color', `${colorToSet}`);
    }
  }, [
    transportIsSet,
    isContrast,
    backgroundColor,
    contrastBackgroundColor,
    errorBackgroundColor,
    alert,
  ]);

  const TravelTagWithoutLabel: JSX.Element = (
    <div
      className={classNames('eds-travel-tag', {
        'eds-travel-tag--closable': isClosable,
        'eds-travel-tag--alert': alertIsSet,
        'eds-travel-tag--alert--error': alert === 'error',
        'eds-travel-tag--transport': transportIsSet,
        'eds-travel-tag--icon-and-text':
          numberOfChildren > 1 || (transportIsSet && numberOfChildren > 0),
        className,
      })}
      ref={tagRef}
      aria-label={`${ariaLabelForTranportIcon} ${children} ${
        alertIsSet ? alert : ''
      }`}
      role="img"
      {...rest}
    >
      {IconWithAriaHidden}
      {children}
      {isClosable && (
        <button
          onClick={onClose}
          type="button"
          className="eds-travel-tag__close-button"
        >
          <CloseSmallIcon inline />
        </button>
      )}
      {alertIsSet && (
        <span
          className={classNames('eds-travel-tag__alert', {
            'eds-travel-tag__alert--warning': alert === 'warning',
          })}
        >
          {alert === 'info' && (
            <ValidationInfoFilledIcon
              aria-hidden
              className="eds-travel-tag__alert-info-icon"
            />
          )}
          {alert === 'error' && (
            <ValidationErrorFilledIcon
              aria-hidden
              className="eds-travel-tag__alert-error-icon"
            />
          )}
          {alert === 'warning' && (
            <>
              <TriangleBorderShape aria-hidden />
              <ValidationExclamationFilledIcon
                className="eds-travel-tag__alert-warning-icon"
                aria-hidden
              />
            </>
          )}
        </span>
      )}
    </div>
  );

  const Label: JSX.Element = (
    <div
      className={classNames('eds-travel-tag__label', {
        [`eds-travel-tag__label--${labelPlacement}`]: label,
        [`eds-travel-tag__label--${labelPlacement}--with-alert`]:
          label && alertIsSet,
      })}
    >
      {label}
    </div>
  );

  if (label) {
    return (
      <div
        className={classNames('eds-travel-tag__wrapper', {
          [`eds-travel-tag__wrapper--label-position-${labelPlacement}`]: label,
        })}
      >
        {TravelTagWithoutLabel}
        {Label}
      </div>
    );
  }

  return TravelTagWithoutLabel;
};

const TriangleBorderShape: React.FC = () => {
  return (
    <svg
      width="20"
      height="17"
      viewBox="0 0 20 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="eds-travel-tag__alert-warning-icon__border"
    >
      <path
        d="M7.74451 1.9216C8.75118 0.192584 11.2489 0.192586 12.2556 1.92161L18.7502 13.0764C19.7633 14.8164 18.5081 16.9996 16.4946 16.9996H3.50547C1.49206 16.9996 0.236853 14.8164 1.24991 13.0764L7.74451 1.9216Z"
        fill="white"
      />
    </svg>
  );
};
