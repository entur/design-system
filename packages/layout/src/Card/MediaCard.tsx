import React, { CSSProperties } from 'react';
import { Paragraph, Label, Heading3, Heading4 } from '@entur/typography';
import classNames from 'classnames';
import { BaseCard } from './BaseCard';
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
  /** Hvilken heading som brukes for tittelen.
   * @default 'h2'
   */
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Størrelsen på MediaCard
   * @default 'medium'
   */
  size?: 'small' | 'medium';
  /** Om MediaCard skal være vertikal */
  vertical?: boolean;
  /** Variant av media
   * @default 'image'
   */
  variant: 'illustration' | 'image';
};

export type MediaCardProps<
  T extends React.ElementType = typeof defaultElement,
> = PolymorphicComponentProps<T, MediaCardOwnProps>;

const defaultElement = 'a';

export const MediaCard = <E extends React.ElementType = typeof defaultElement>({
  title,
  description,
  image,
  children,
  className,
  category,
  style,
  as,
  headingLevel = 'h2',
  size = 'medium',
  vertical = false,
  variant = 'image',
  ...rest
}: MediaCardProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  const classList = classNames('eds-media-card', className, {
    'eds-media-card--small': size === 'small',
    'eds-media-card--vertical': vertical,
    'eds-media-card--illustration': variant == 'illustration',
  });
  const Heading = size === 'small' ? Heading4 : Heading3;

  const media = React.Children.toArray(children).find(
    child =>
      React.isValidElement(child) &&
      (child.type === 'img' ||
        (typeof child.type === 'string' && child.type === 'svg')),
  );

  const actions = React.Children.toArray(children).filter(
    child =>
      React.isValidElement(child) &&
      !(
        child.type === 'img' ||
        (typeof child.type === 'string' && child.type === 'svg')
      ),
  );

  return (
    <BaseCard as={Element} style={style} className={classList} {...rest}>
      {media && (
        <div className={classNames('eds-media-card__media', {})}>{media}</div>
      )}
      <div className="eds-media-card__content">
        <div className="eds-media-card__header">
          {category && (
            <Label className="eds-media-card__header-category">
              {category}
            </Label>
          )}

          <span className="eds-media-card__header-title">
            <Heading as={headingLevel}>{title}</Heading>
          </span>

          <div className="eds-media-card__header-highlight"></div>
        </div>
        {description && <Paragraph>{description}</Paragraph>}
        {actions.length > 0 && (
          <div className="eds-media-card__content-actions  ">{actions}</div>
        )}
      </div>
    </BaseCard>
  );
};

export default MediaCard;
