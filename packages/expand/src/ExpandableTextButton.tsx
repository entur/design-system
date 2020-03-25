import React from 'react';
import classNames from 'classnames';
import { DownArrowIcon } from '@entur/icons';
import { Heading4 } from '@entur/typography';

export type ExandableTextButtonProps = {
  children: React.ReactNode;
  /** Prop for om innholdet er åpent */
  open?: boolean;
  /** Funksjonen som styrer åpningen av ExpandableTextButton */
  onToggle: () => void;
  [key: string]: any;
};

export const ExpandableTextButton: React.FC<ExandableTextButtonProps> = ({
  children,
  open,
  onToggle,
  ...rest
}) => {
  return (
    <button
      className="eds-expandable-text__trigger"
      aria-expanded={open}
      type="button"
      onClick={onToggle}
      {...rest}
    >
      <Heading4 as="span">{children}</Heading4>
      <DownArrowIcon
        inline
        className={classNames('eds-expandable-text__arrow', {
          'eds-expandable-text__arrow--open': open,
        })}
      />
    </button>
  );
};
