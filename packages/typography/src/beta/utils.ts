export function getHeadingVariantFromSemanticType(
  semanticType: string | React.ElementType,
) {
  if (typeof semanticType !== 'string') return undefined;
  switch (semanticType) {
    case 'h1':
      return 'title-1';
    case 'h2':
      return 'title-2';
    case 'h3':
      return 'subtitle-1';
    case 'h4':
      return 'subtitle-2';
    case 'p':
      return 'paragraph';
    default:
      return undefined;
  }
}
