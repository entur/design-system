import React, { CSSProperties } from 'react';
import classNames from 'classnames';

import { Heading5 } from '@entur/typography';
import { BaseExpand } from './BaseExpand';
import { ExpandArrow } from './ExpandArrow';

import './BaseExpandablePanel.scss';

type BaseExpandablePanelProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'title' | 'onClick'
> & {
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
  disableAnimation?: boolean;
  /** Avmonter innholdet når det lukkes. Når false (standard), holdes innholdet montert og skjules med CSS.
   * @default false
   */
  unmountOnClose?: boolean;
};
export const BaseExpandablePanel = React.forwardRef<
  HTMLDivElement,
  BaseExpandablePanelProps
>(
  (
    {
      title,
      children,
      className,
      id,
      open,
      onToggle,
      contentStyle,
      disableAnimation,
      unmountOnClose = false,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={classNames('eds-expandable-panel', className, {
          'eds-expandable-panel--disable-animation': disableAnimation,
        })}
      >
        <button
          type="button"
          className="eds-expandable-panel__trigger"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={open || !unmountOnClose ? id : undefined}
          {...rest}
        >
          <span className="eds-expandable-panel__grid">
            <Heading5 margin="none" as="span">
              {title}
            </Heading5>
            <span className="eds-expandable-panel__icon-container">
              <ExpandArrow open={open} />
            </span>
          </span>
        </button>
        <BaseExpand
          className="eds-expandable-panel__content"
          id={id}
          open={open}
          style={contentStyle}
          unmountOnClose={unmountOnClose}
        >
          {children}
        </BaseExpand>
      </div>
    );
  },
);
