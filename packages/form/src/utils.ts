// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types -- disabled during Yarn upgrade
export function hasValue(value: any): boolean {
  return value != null && !(Array.isArray(value) && value.length === 0);
}

// Determine if field is empty or filled.
// Response determines if label is presented above field or as placeholder.
//
// @param obj
// @param SSR
// @returns {boolean} False when not present or empty string.
//                    True when any number or string with length.
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types -- disabled during Yarn upgrade
export function isFilled(obj: any, SSR = false): boolean {
  return (
    obj &&
    ((hasValue(obj.value) && obj.value !== '') ||
      (SSR && hasValue(obj.defaultValue) && obj.defaultValue !== ''))
  );
}
