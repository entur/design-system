import React, { CSSProperties } from 'react';
import { useRandomId } from '@entur/utils';
import { ExpandableTextButton } from './ExpandableTextButton';
import { BaseExpand } from './BaseExpand';
import { Heading5, Paragraph, SubParagraph } from '@entur/typography';
import './ExpandableText.scss';

export type ExpandableTextProps = {
  /** Teksten som skal "vises" */
  title: string;
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
  [key: string]: any;
};

export const ExpandableText: React.FC<ExpandableTextProps> = ({
  title,
  children,
  defaultOpen = false,
  contentStyle,
  titleElement = 'Heading5',
  ...rest
}) => {
  const randomId = useRandomId('eds-expandable-text');
  const [isOpen, setOpen] = React.useState(defaultOpen);

  const Element: React.ElementType = React.useMemo(
    () => GetTypographyComponent(titleElement),
    [titleElement],
  );

  return (
    <>
      <ExpandableTextButton
        aria-controls={randomId}
        open={isOpen}
        onToggle={() => setOpen(prev => !prev)}
        as={Element}
        {...rest}
      >
        {title}
      </ExpandableTextButton>
      <BaseExpand
        className="eds-expandable-text__content"
        id={randomId}
        open={isOpen}
        style={contentStyle}
        {...rest}
      >
        {children}
      </BaseExpand>
    </>
  );
};

function GetTypographyComponent(
  element: 'Heading5' | 'Paragraph' | 'SubParagraph',
) {
  switch (element) {
    case 'Heading5':
      return Heading5;
    case 'Paragraph':
      return Paragraph;
    case 'SubParagraph':
      return SubParagraph;
    default:
      return Heading5;
  }
}
