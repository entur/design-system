import React from 'react';
import classNames from 'classnames';
import { DownArrowIcon } from '@entur/icons';
import { Heading4 } from '@entur/typography';
import { BaseExpand } from './BaseExpand';

import './BaseExpandablePanel.scss';

type BaseExpandablePanelProps = {
  /** Teksten som skal stå i panelet */
  title: React.ReactNode;
  /** Innholdet som skal vises under panelet */
  children: React.ReactNode;
  /** IDen til expand-panelet */
  id: string;
  /** Prop for om innholdet er åpent */
  open: boolean;
  /** Funksjonen som styrer åpningen av ExpandablePanel */
  onToggle: () => void;
  [key: string]: any;
};
export const BaseExpandablePanel: React.FC<BaseExpandablePanelProps> = ({
  title,
  children,
  className,
  id,
  open,
  onToggle,
  ...rest
}) => {
  return (
    <div className={classNames('eds-expandable-panel', className)}>
      <button
        type="button"
        className="eds-expandable-panel__trigger"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        {...rest}
      >
        <Heading4 as="span">{title}</Heading4>

        <DownArrowIcon
          className={classNames('eds-expandable-panel__arrow', {
            'eds-expandable-panel__arrow--open': open,
          })}
        />
      </button>

      <BaseExpand className="eds-expandable-panel__content" id={id} open={open}>
        {children}
      </BaseExpand>
    </div>
  );
};
