import React, { CSSProperties } from 'react';
import { Paragraph, Label } from '@entur/typography';
import classNames from 'classnames';
import { BaseCard } from './BaseCard';
import { ForwardIcon } from '@entur/icons';
import './MediaCard.scss';
import { PolymorphicComponentProps } from '@entur/utils';

export type MediaCardOwnProps = {
  /** HTML-elementet eller React-komponenten som lager bunnen (under media) av MediaCard
   * @default 'a'
   */
  as?: 'a' | 'button' | React.ElementType;
  /** Tittelen/teksten som står i CardBox */
  title: string;
  /** Teksten under tittelen i MediaCard */
  description?: React.ReactNode;
  /** Kategori (eller lignende) som vises over tittelen */
  category?: string;
  /** Ekstra klassenavn */
  className?: string;
  /** Det du skulle ønske som media (f.eks. bilder eller video) */
  children?: React.ReactNode;
  /** Styling som sendes til komponenten */
  style?: CSSProperties;
  /** Gjør hele kortet til "as"-elementet. Default er kun tekstområdet. Anbefales hvis media er et bilde
   * @default false
   */
  wholeCardAsElement?: boolean;
};

export type MediaCardProps<
  T extends React.ElementType = typeof defaultElement,
> = PolymorphicComponentProps<T, MediaCardOwnProps>;

const defaultElement = 'a';

export const MediaCard = <E extends React.ElementType = typeof defaultElement>({
  title,
  description,
  children,
  className,
  category,
  style,
  as,
  wholeCardAsElement: whole,
  ...rest
}: MediaCardProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  const classList = classNames('eds-base-card', 'eds-media-card', className);

  const wrapperElement = whole ? Element : 'div';
  const wrapperProps = whole ? rest : {};
  const innerProps = whole ? {} : rest;
  const InnerElement = whole ? 'div' : Element;
  return (
    <BaseCard
      as={wrapperElement}
      className={classList}
      style={style}
      {...wrapperProps}
    >
      <div className="eds-media-card__media">{children}</div>
      <InnerElement className="eds-media-card__text" {...innerProps}>
        {category && (
          <Label className="eds-media-card__category">{category}</Label>
        )}
        <div className="eds-media-card__title">{title}</div>
        <Paragraph>{description}</Paragraph>
        <ForwardIcon className="eds-media-card__arrow-icon" />
      </InnerElement>
    </BaseCard>
  );
};

export default MediaCard;
