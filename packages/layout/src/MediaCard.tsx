import React, { CSSProperties } from 'react';
import { Paragraph, Label } from '@entur/typography';
import classNames from 'classnames';
import { BaseCard } from './BaseCard';
import { ForwardIcon } from '@entur/icons';
import './MediaCard.scss';
import { PolymorphicPropsWithoutRef } from '@entur/utils';

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
};

export type MediaCardProps<
  E extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithoutRef<MediaCardOwnProps, E>;

const defaultElement = 'a';

export const MediaCard = <E extends React.ElementType = typeof defaultElement>({
  title,
  description,
  children,
  className,
  category,
  style,
  as,
  ...rest
}: MediaCardProps<E>) => {
  const Element: React.ElementType = as || defaultElement;
  const classList = classNames('eds-base-card', 'eds-media-card', className);
  return (
    <BaseCard as="div" className={classList} style={style}>
      <div className="eds-media-card__media">{children}</div>
      <Element as={defaultElement} className="eds-media-card__text" {...rest}>
        {category && (
          <Label className="eds-media-card__category">{category}</Label>
        )}
        <div className="eds-media-card__title">{title}</div>
        <Paragraph>{description}</Paragraph>
        <ForwardIcon className="eds-media-card__arrow-icon" />
      </Element>
    </BaseCard>
  );
};

export default MediaCard;
