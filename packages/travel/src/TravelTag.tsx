import React from 'react';
import classNames from 'classnames';
import {
  CloseSmallIcon,
  ValidationInfoIcon,
  ValidationErrorIcon,
  ValidationExclamationIcon,
} from '@entur/icons';
import './TravelTag.scss';

export type TravelTagProps = {
  /** Callback som kalles for når man skal lukke TravelTagen
   * @default undefined
   */
  onClose?: () => void;
  /** Innholdet til TravelTagen */
  children: React.ReactNode;
  /**Ekstra klassenavn */
  className?: string;
  /** Legger til et Valideringsikon i TravelTagen for å signalisere avvik, informasjon e.l.
   * @default "none"
   */
  alert?: 'none' | 'error' | 'warning' | 'info';
  /** Legger til farger tilpasset valgt transportmiddel */
  transport?:
    | 'bus'
    | 'metro'
    | 'air'
    | 'tram'
    | 'rail'
    | 'water'
    | 'bike'
    | 'scooter'
    | 'foot'
    | 'car';
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
  onClose = undefined,
  children,
  className,
  alert = 'none',
  transport,
  label,
  labelPlacement = 'right',
  ...rest
}) => {
  const isClosable = onClose ? true : false;
  const numberOfChildren = React.Children.count(children);

  const TravelTagWithoutLabel: JSX.Element = (
    <div
      className={classNames('eds-travel-tag', {
        'eds-travel-tag--closable': isClosable,
        'eds-travel-tag--alert': alert !== 'none',
        'eds-travel-tag--alert--error': alert === 'error',
        'eds-travel-tag--icon-and-text': numberOfChildren > 1,
        [`eds-travel-tag--transport-${transport}`]: transport,
        className,
      })}
      {...rest}
    >
      {children}
      {isClosable && (
        <button onClick={onClose} className="eds-travel-tag__close-button">
          <CloseSmallIcon inline />
        </button>
      )}
      {alert !== 'none' && (
        <span className="eds-travel-tag__alert">
          {alert === 'info' && (
            <ValidationInfoIcon className="eds-travel-tag__alert-info-icon" />
          )}
          {alert === 'error' && (
            <ValidationErrorIcon className="eds-travel-tag__alert-error-icon" />
          )}
          {alert === 'warning' && (
            <ValidationExclamationIcon className="eds-travel-tag__alert-exclamation-icon" />
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
          label && alert !== 'none',
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
