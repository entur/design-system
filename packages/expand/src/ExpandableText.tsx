import React, { CSSProperties } from 'react';
import classNames from 'classnames';

import { useRandomId } from '@entur/utils';
import { ExpandableTextButton } from './ExpandableTextButton';
import { BaseExpand } from './BaseExpand';
import {
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Paragraph,
  SubParagraph,
} from '@entur/typography';

import './ExpandableText.scss';

export type ExpandableTextProps = {
  /** Teksten som skal "vises" */
  title: React.ReactNode;
  /** Innholdet som skal vises under linken */
  children: React.ReactNode;
  /** Hvilken tilstand ExpandableText skal ha som default (med mindre den er kontrollert)
   * @default false
   */
  defaultOpen?: boolean;
  /** Prop for om innholdet er åpent. Brukes hvis du vil kontrollere ExpandableText, sammen med onToggle */
  open?: boolean;
  /** Funksjonen som styrer åpningen av ExpandableText */
  onToggle?: () => void;
  /**Styling som sendes til innholdet av ExpandableText */
  contentStyle?: CSSProperties;
  /** Hvilket typografisk element tittelen er
   * @default "Heading5"
   */
  titleElement?: 'Heading5' | 'Paragraph' | 'SubParagraph';
  disableAnimation?: boolean;
  /** Avmonter innholdet når det lukkes. Når false (standard), holdes innholdet montert og skjules med CSS.
   * @default false
   */
  unmountOnClose?: boolean;
  [key: string]: any;
};

export const ExpandableText: React.FC<ExpandableTextProps> = ({
  title,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  contentStyle,
  titleElement = 'Heading5',
  disableAnimation,
  unmountOnClose = false,
  className,
  ...rest
}) => {
  const randomId = useRandomId('eds-expandable-text');
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleToggle = () => {
    if (!isControlled) {
      setInternalOpen(prev => !prev);
    }
    onToggle?.();
  };

  const Element: React.ElementType = React.useMemo(
    () => GetTypographyComponent(titleElement),
    [titleElement],
  );

  return (
    <div
      className={classNames('eds-expandable-text', className, {
        'eds-expandable-text--disable-animation': disableAnimation,
      })}
      {...rest}
    >
      <ExpandableTextButton
        open={isOpen}
        onToggle={handleToggle}
        aria-controls={isOpen || !unmountOnClose ? randomId : undefined}
        as={Element}
      >
        {title}
      </ExpandableTextButton>
      <BaseExpand
        className="eds-expandable-text__content"
        id={randomId}
        open={isOpen}
        style={contentStyle}
        unmountOnClose={unmountOnClose}
      >
        {children}
      </BaseExpand>
    </div>
  );
};

function GetTypographyComponent(
  element:
    | 'Heading5'
    | 'Heading4'
    | 'Heading3'
    | 'Heading2'
    | 'Paragraph'
    | 'SubParagraph',
) {
  switch (element) {
    case 'Heading5':
      return Heading5;
    case 'Heading4':
      return Heading4;
    case 'Heading3':
      return Heading3;
    case 'Heading2':
      return Heading2;
    case 'Paragraph':
      return Paragraph;
    case 'SubParagraph':
      return SubParagraph;
    default:
      return Heading5;
  }
}
