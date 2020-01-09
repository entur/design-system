import React from 'react';
import classNames from 'classnames';
import { CloseIcon } from '@entur/icons';
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
  [key: string]: any;
};

export const TravelTag: React.FC<TravelTagProps> = ({
  onClose = undefined,
  children,
  className,
  ...rest
}) => {
  let isClosable = onClose ? true : false;
  return (
    <div
      className={classNames('eds-travel-tag', {
        'eds-travel-tag--closable': isClosable,
      })}
      {...rest}
    >
      {children}
      {isClosable && (
        <button
          role="button"
          onClick={onClose}
          className="eds-travel-tag__close-button"
        >
          <CloseIcon inline />
        </button>
      )}
    </div>
  );
};
