import React from 'react';
import classNames from 'classnames';
import { DownArrowIcon } from '@entur/icons';
import './ExpandArrow.scss';

type ExpandArrowProps = {
  /** Om innholdet er åpent eller ikke, som bestemmer retningen på pila
   * @default false
   */
  open?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const ExpandArrow: React.FC<ExpandArrowProps> = ({
  open = false,
  className,
  ...rest
}) => {
  return (
    <DownArrowIcon
      className={classNames(className, 'eds-expandable-arrow', {
        'eds-expandable-arrow--open': open,
      })}
      {...rest}
    />
  );
};
