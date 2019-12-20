import React from 'react';
import classNames from 'classnames';
import { DownArrowIcon } from '@entur/icons';
import { Heading4 } from '@entur/typography';

export type ExandableTextButtonProps = {
  children: React.ReactNode;
  open?: boolean;
  [key: string]: any;
};

export const ExpandableTextButton: React.FC<ExandableTextButtonProps> = ({
  children,
  open,
  ...rest
}) => {
  return (
    <button
      className="eds-expandable-text__trigger"
      aria-expanded={open}
      type="button"
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
