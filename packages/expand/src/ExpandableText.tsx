import React, { CSSProperties, useId } from 'react';
import classNames from 'classnames';
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

export type ExpandableTextProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title' | 'onToggle'
> & {
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
  titleElement?:
    | 'Heading2'
    | 'Heading3'
    | 'Heading4'
    | 'Heading5'
    | 'Paragraph'
    | 'SubParagraph';
  /** Deaktiver åpne/lukke-animasjonen */
  disableAnimation?: boolean;
  /** Avmonter innholdet når det lukkes. Når false (standard), holdes innholdet montert og skjules med CSS.
   * @default false
   */
  unmountOnClose?: boolean;
};

export const ExpandableText = React.forwardRef<
  HTMLDivElement,
  ExpandableTextProps
>(
  (
    {
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
    },
    ref,
  ) => {
    const randomId = `eds-expandable-text${useId()}`;
    const [internalOpen, setInternalOpen] =
      React.useState<boolean>(defaultOpen);
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
        ref={ref}
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
  },
);

function GetTypographyComponent(
  element: NonNullable<ExpandableTextProps['titleElement']>,
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
