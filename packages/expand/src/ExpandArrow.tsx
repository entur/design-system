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

export const ExpandArrow = ({
  open = false,
  className,
  ...rest
}: ExpandArrowProps) => {
  return (
    <DownArrowIcon
      className={classNames(className, 'eds-expandable-arrow', {
        'eds-expandable-arrow--open': open,
      })}
      {...rest}
      aria-hidden="true"
    />
  );
};
