import React, { cloneElement } from 'react';
import classNames from 'classnames';
import {
  CloseSmallIcon,
  ValidationErrorFilledIcon,
  ValidationExclamationCircleFilledIcon,
  ValidationInfoFilledIcon,
} from '@entur/icons';
import { useContrast } from '@entur/layout';

import { getTransportStyle } from './utils';

import type { CSSVars, Transport } from './utils';

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
  /** Ekstrainnhold for tilleggsvisning i en separat boks.
   * @example Brukes ofte for å vise et tog/avgangsnummer
   */
  details?: React.ReactNode;
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
  details,
  style,
  ...rest
}) => {
  const isContrast = useContrast();
  const isClosable = Boolean(onClose);
  const transportIsSet = transport !== 'none';
  const alertIsSet = alert !== 'none';
  const hasDetails = details !== undefined;
  const numberOfChildren = React.Children.count(children);
  const { Icon, ariaLabel: ariaLabelForTranportIcon } =
    getTransportStyle(transport);
  const transportLower = transport.toLowerCase();
  const IconWithAriaHidden = cloneElement(<Icon />, { 'aria-hidden': 'true' });

  const colorTheme = isContrast ? 'contrast' : 'standard';
  const colorModifier = alert === 'error' ? 'cancelled' : undefined;
  const shouldModifyTextColor = alert === 'error' || transport === 'walk';

  const defaultBackground = `var(--basecolors-shape-disabled)`;
  const defaultTextColor = `var(--basecolors-shape-disabled)`;

  const dynamicCssVars: React.CSSProperties & CSSVars = {
    '--background-color': `var(--components-travel-traveltag-${colorTheme}-fill-${transportLower}${
      colorModifier ? `-${colorModifier}` : ''
    }, ${defaultBackground})`,
    ...(shouldModifyTextColor && {
      '--text-color': `var(--components-travel-traveltag-${colorTheme}-text-line-${transportLower}${
        colorModifier ? `-${colorModifier}` : ''
      }, ${defaultTextColor})`,
    }),
  };

  const TravelTagWithoutLabel: JSX.Element = (
    <div
      className={classNames(className, 'eds-travel-tag', {
        'eds-travel-tag--closable': isClosable,
        'eds-travel-tag--alert': alertIsSet,
        'eds-travel-tag--alert--error': alert === 'error',
        'eds-travel-tag--transport': transportIsSet,
        'eds-travel-tag--icon-and-text':
          numberOfChildren > 1 || (transportIsSet && numberOfChildren > 0),
      })}
      style={{ ...dynamicCssVars, ...style }}
      aria-label={[ariaLabelForTranportIcon, children, alertIsSet ? alert : '']
        .filter(Boolean)
        .join(' ')}
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
      {hasDetails && <div className="eds-travel-tag__details">{details}</div>}
      {alertIsSet && (
        <span className="eds-travel-tag__alert">
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
            <ValidationExclamationCircleFilledIcon
              aria-hidden
              className="eds-travel-tag__alert-exclamation-icon"
            />
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
