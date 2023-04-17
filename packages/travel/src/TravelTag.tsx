import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import {
  CloseSmallIcon,
  ValidationInfoIcon,
  ValidationErrorIcon,
  ValidationExclamationIcon,
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
  const {
    Icon,
    contrastBackgroundColor,
    contrastTextColor,
    backgroundColor,
    textColor,
    ariaLabel,
  } = getTransportStyle(transport);

  useEffect(() => {
    if (transportIsSet) {
      tagRef.current?.style.setProperty(
        '--background-color',
        isContrast ? contrastBackgroundColor : backgroundColor,
      );
      tagRef.current?.style.setProperty(
        '--text-color',
        isContrast ? contrastTextColor : textColor,
      );
    }
  }, [tagRef.current, backgroundColor, textColor]);

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
      {...rest}
      aria-label={
        rest['aria-label'] ?? ariaLabel + (alertIsSet ? ` ${alert}` : '')
      }
      role="img"
    >
      <Icon aria-hidden />
      {children}
      {isClosable && (
        <button onClick={onClose} className="eds-travel-tag__close-button">
          <CloseSmallIcon inline />
        </button>
      )}
      {alertIsSet && (
        <span className="eds-travel-tag__alert">
          {alert === 'info' && (
            <ValidationInfoIcon
              aria-hidden
              className="eds-travel-tag__alert-info-icon"
            />
          )}
          {alert === 'error' && (
            <ValidationErrorIcon
              aria-hidden
              className="eds-travel-tag__alert-error-icon"
            />
          )}
          {alert === 'warning' && (
            <ValidationExclamationIcon
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
