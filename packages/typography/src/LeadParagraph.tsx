import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';

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
  T extends React.ElementType = typeof defaultElement,
> = PolymorphicComponentProps<T, LeadParagraphOwnProps>;

const defaultElement = 'p';

export const LeadParagraph = <
  E extends React.ElementType = typeof defaultElement,
>({
  className,
  margin = 'both',
  as,
  ...rest
}: LeadParagraphProps<E>): JSX.Element => {
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
