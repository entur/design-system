import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import { Heading5 } from '@entur/typography';
import { BaseExpand } from './BaseExpand';

import './BaseExpandablePanel.scss';
import { ExpandArrow } from './ExpandArrow';

type BaseExpandablePanelProps = {
  /** Teksten som skal stå i panelet */
  title: React.ReactNode;
  /** Innholdet som skal vises under panelet */
  children: React.ReactNode;
  /** IDen til expand-panelet */
  id: string;
  /** Prop for om innholdet er åpent */
  open: boolean;
  /** Funksjonen som styrer åpningen av BaseExpandablePanel */
  onToggle: () => void;
  /** Styling som sendes til innholdet av BaseExpandablePanel */
  contentStyle?: CSSProperties;
  [key: string]: any;
};
export const BaseExpandablePanel: React.FC<BaseExpandablePanelProps> = ({
  title,
  children,
  className,
  id,
  open,
  onToggle,
  contentStyle,
  ...rest
}) => {
  return (
    <div className={classNames('eds-expandable-panel', className)}>
      <button
        type="button"
        className="eds-expandable-panel__trigger"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        {...rest}
      >
        <div className="eds-expandable-panel__grid">
          <Heading5 margin="none" as="div">
            {title}
          </Heading5>
          <div className="eds-expandable-panel__icon-container">
            <ExpandArrow open={open} />
          </div>
        </div>
      </button>
      <BaseExpand
        className="eds-expandable-panel__content"
        id={id}
        open={open}
        style={contentStyle}
      >
        {children}
      </BaseExpand>
    </div>
  );
};
