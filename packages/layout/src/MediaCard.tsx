import React, { CSSProperties } from 'react';
import { Paragraph, Label } from '@entur/typography';
import classNames from 'classnames';
import { BaseCard } from './BaseCard';
import { ForwardIcon } from '@entur/icons';
import './MediaCard.scss';
import { ConditionalWrapper, PolymorphicComponentProps } from '@entur/utils';

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
   *  Blir kun satt hvis description også er satt.
   * @default 'h2'
   */
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Skjul pil-ikonet nederst til høyre
   * @default false
   */
  hideArrow?: boolean;
  /** Props som sendes til wrapper-elementet i stedet for lenke-elementet */
  wrapperProps?: React.HTMLAttributes<HTMLElement>;
  /** @deprecated Denne prop-en har ikke lenger en funksjon.
   *  Hvis du trenger å legge til props på wrapper-elementet, bruk 'wrapperProps'-prop-en
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
  headingLevel = 'h2',
  wholeCardAsElement: whole,
  hideArrow,
  wrapperProps,
  ...rest
}: MediaCardProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  const Heading = headingLevel;

  const _wrapperProps = whole
    ? { ...wrapperProps, ...rest }
    : { ...wrapperProps };
  return (
    <BaseCard
      className={classNames('eds-base-card', 'eds-media-card', className)}
      style={style}
      {..._wrapperProps}
    >
      <div className="eds-media-card__media">{children}</div>
      <div className="eds-media-card__text">
        {category && (
          <Label className="eds-media-card__text__category">{category}</Label>
        )}
        {/* we only want a heading wrapper when we also have description text */}
        <ConditionalWrapper
          condition={description !== undefined}
          wrapper={(children: React.ReactNode) => (
            <Heading className="eds-media-card__text__title">
              {children}
            </Heading>
          )}
        >
          <Element
            tabIndex={0}
            className="eds-media-card__text__title-link"
            {...rest}
          >
            {title}
          </Element>
        </ConditionalWrapper>
        {description !== undefined && <Paragraph>{description}</Paragraph>}
        <ForwardIcon
          className="eds-media-card__text__arrow-icon"
          aria-hidden="true"
        />
      </div>
    </BaseCard>
  );
};

export default MediaCard;
