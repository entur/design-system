import React from 'react';
import classNames from 'classnames';
import {
  CloseIcon,
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
  [key: string]: any;
};

export const TravelTag: React.FC<TravelTagProps> = ({
  onClose = undefined,
  children,
  className,
  alert = 'none',
  transport,
  ...rest
}) => {
  let isClosable = onClose ? true : false;
  const numberOfChildren = React.Children.count(children);

  return (
    <div
      className={classNames('eds-travel-tag', {
        'eds-travel-tag--closable': isClosable,
        'eds-travel-tag--alert': alert !== 'none',
        'eds-travel-tag--icon-and-text': numberOfChildren > 1,
        [`eds-travel-tag--transport-${transport}`]: transport,
      })}
      {...rest}
    >
      {children}
      {isClosable && (
        <button onClick={onClose} className="eds-travel-tag__close-button">
          <CloseIcon inline />
        </button>
      )}
      {alert !== 'none' && (
        <span className="eds-travel-tag__alert">
          {alert === 'info' && (
            <ValidationInfoIcon className="eds-travel-tag__alert-info-icon" />
          )}
          {alert === 'error' && (
            <ValidationExclamationIcon className="eds-travel-tag__alert-exclamation-icon" />
          )}
          {alert === 'warning' && (
            <ValidationErrorIcon className="eds-travel-tag__alert-error-icon" />
          )}
        </span>
      )}
    </div>
  );
};
