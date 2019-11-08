import React from 'react';
import { BaseExpand } from './BaseExpand';
import { DownArrowIcon } from '@entur/icons';
import { Heading4 } from '@entur/typography';
import cx from 'classnames';
import './styles.scss';
import { useExpandableGroup } from './ExpandableGroup';
import { useControllableProp } from './useControllableProp';
import { useRandomId } from './useRandomId';

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
  open,
  onToggle,
  defaultOpen = false,
  ...rest
}) => {
  const randomId = useRandomId('entur-expandable');
  const groupContext = useExpandableGroup({ id: randomId, defaultOpen });

  const [isOpen, updater] = useControllableProp({
    defaultValue: defaultOpen,
    prop: groupContext ? groupContext.isOpen : open,
    updater: groupContext ? groupContext.toggle : onToggle,
  });

  return (
    <div {...rest}>
      <button
        type="button"
        className="entur-expandable-panel"
        onClick={() => updater(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={randomId}
      >
        <Heading4 as="span" className="entur-expandable-panel__title">
          {title}
        </Heading4>

        <DownArrowIcon
          className={cx('entur-expandable-panel__chevron', {
            'entur-expandable-panel__chevron--open': isOpen,
          })}
        />
      </button>

      <BaseExpand
        className="entur-expandable-content"
        id={randomId}
        open={isOpen!}
      >
        {children}
      </BaseExpand>
    </div>
  );
};
