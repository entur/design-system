import React from 'react';
import classNames from 'classnames';
import { DownArrowIcon } from '@entur/icons';
import { Heading4 } from '@entur/typography';
import { BaseExpand } from './BaseExpand';
import { useExpandableGroup } from './ExpandableGroup';
import { useControllableProp } from './useControllableProp';
import { useRandomId } from './useRandomId';

import './ExpandablePanel.scss';

type ExpandablePanelProps = {
  /** Teksten som skal stå i panelet */
  title: React.ReactNode;
  /** Innholdet som skal vises under panelet */
  children: React.ReactNode;
  /** Hvilken tilstand ExpandablePanel skal ha som default (med mindre den er kontrollert) */
  defaultOpen?: boolean;
  /** Prop for om innholdet er åpent. Brukes hvis du vil kontrollere ExpandablePanel, sammen med onToggle */
  open?: boolean;
  /** Funksjonen som styrer åpningen av ExpandablePanel */
  onToggle?: () => void;
  [key: string]: any;
};
export const ExpandablePanel: React.FC<ExpandablePanelProps> = ({
  title,
  children,
  className,
  open,
  onToggle,
  defaultOpen = false,
  ...rest
}) => {
  const randomId = useRandomId('eds-expandable');
  const groupContext = useExpandableGroup({ id: randomId, defaultOpen });

  const [isOpen, updater] = useControllableProp({
    defaultValue: defaultOpen,
    prop: groupContext ? groupContext.isOpen : open,
    updater: groupContext ? groupContext.toggle : onToggle,
  });

  return (
    <div className={classNames('eds-expandable-panel', className)} {...rest}>
      <button
        type="button"
        className="eds-expandable-panel__trigger"
        onClick={() => updater(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={randomId}
        {...rest}
      >
        <Heading4 as="span">{title}</Heading4>

        <DownArrowIcon
          className={classNames('eds-expandable-panel__arrow', {
            'eds-expandable-panel__arrow--open': isOpen,
          })}
        />
      </button>

      <BaseExpand
        className="eds-expandable-panel__content"
        id={randomId}
        open={isOpen!}
      >
        {children}
      </BaseExpand>
    </div>
  );
};
