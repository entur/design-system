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
  | 'link'
  | 'label'
  | 'sublabel'
  | 'overline'
  | 'emphasized'
  | 'code-text'
  | 'preformatted-text';

export type TypographySize = 'xs' | 's' | 'm' | 'lg' | 'xl' | '2xl';

/** `regular`, `semibold`, `400`, `500` og `600` er utdaterte – bruk `medium` eller `bold` */
export type TypographyWeight =
  | 'medium'
  | 'bold'
  | 'regular'
  | 'semibold'
  | '400'
  | '500'
  | '600';

export type TypographySpacing =
  | 'none'
  | 'xs2'
  | 'xs2-top'
  | 'xs2-bottom'
  | 'xs'
  | 'xs-top'
  | 'xs-bottom'
  | 'sm'
  | 'sm-top'
  | 'sm-bottom'
  | 'md'
  | 'md-top'
  | 'md-bottom'
  | 'lg'
  | 'lg-top'
  | 'lg-bottom'
  | 'xl'
  | 'xl-top'
  | 'xl-bottom';
