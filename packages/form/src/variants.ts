/** Denne filen er deprecated. Bruk VariantType fra @entur/utils istedenfor */

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

export type VariantType =
  | 'success'
  | 'negative'
  | 'warning'
  | 'information'
  | typeof error
  | typeof info;
