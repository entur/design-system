import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps, Box } from '@entur/utils';

export type LeadParagraphOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "p"
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Hvor du vil ha marginer
   * @default "both"
   */
  margin?: 'top' | 'bottom' | 'both' | 'none';
};

export type LeadParagraphProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, LeadParagraphOwnProps>;

const defaultElement = 'p';

export const LeadParagraph = <
  E extends React.ElementType = typeof defaultElement
>({
  className,
  margin = 'both',
  ...rest
}: LeadParagraphProps<E>): JSX.Element => (
  <Box
    as={defaultElement}
    className={classNames(
      'eds-lead-paragraph',
      {
        [`eds-lead-paragraph--margin-top`]: margin === 'top',
        [`eds-lead-paragraph--margin-bottom`]: margin === 'bottom',
        [`eds-lead-paragraph--margin-none`]: margin === 'none',
      },
      className,
    )}
    {...rest}
  />
);
