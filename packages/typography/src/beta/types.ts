export type TypographyHeadingVariant =
  | 'title-1'
  | 'title-2'
  | 'subtitle-1'
  | 'subtitle-2'
  | 'section-1'
  | 'section-2'
  | 'label'
  | 'sublabel';

export type TypographyTextVariant =
  | 'leading'
  | 'quote'
  | 'paragraph'
  | 'subparagraph'
  | 'caption'
  | 'label'
  | 'sublabel'
  | 'overline'
  | 'emphasized'
  | 'code'
  | 'preformatted';

export type TypographySize = 'xs' | 's' | 'm' | 'lg' | 'xl' | '2xl';

export type TypographyWeight = 'medium' | 'bold';

// The unions stay inline so the props table on the docs site lists the values
export type TypographySpacingProps = {
  /**
   * Avstand over og under, fra samme skala som `gap` på Flex og Grid.
   * Én verdi gir lik avstand over og under, `{ top, bottom }` setter dem hver for seg.
   * Uten `spacing` har teksten ingen avstand, med mindre den ligger i en `TextContainer`.
   */
  spacing?:
    | 'none'
    | '2xs'
    | 'xs'
    | 's'
    | 'm'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl'
    | '9xl'
    | '10xl'
    | '11xl'
    | '12xl'
    | '13xl'
    | {
        top?:
          | 'none'
          | '2xs'
          | 'xs'
          | 's'
          | 'm'
          | 'lg'
          | 'xl'
          | '2xl'
          | '3xl'
          | '4xl'
          | '5xl'
          | '6xl'
          | '7xl'
          | '8xl'
          | '9xl'
          | '10xl'
          | '11xl'
          | '12xl'
          | '13xl';
        bottom?:
          | 'none'
          | '2xs'
          | 'xs'
          | 's'
          | 'm'
          | 'lg'
          | 'xl'
          | '2xl'
          | '3xl'
          | '4xl'
          | '5xl'
          | '6xl'
          | '7xl'
          | '8xl'
          | '9xl'
          | '10xl'
          | '11xl'
          | '12xl'
          | '13xl';
      };
};

export type TypographySpacing = NonNullable<TypographySpacingProps['spacing']>;
