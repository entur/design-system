import React from 'react';
import classNames from 'classnames';
import { PolymorphicPropsWithoutRef } from '@entur/utils';

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
  E extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithoutRef<LeadParagraphOwnProps, E>;

const defaultElement = 'p';

export const LeadParagraph = <
  E extends React.ElementType = typeof defaultElement
>({
  className,
  margin = 'both',
  as,
  ...rest
}: LeadParagraphProps<E>) => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <Element
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
};
