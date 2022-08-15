/**
 * Flattens a complex object into a single-level object
 * with dot-notation keys and string values
 *
 * @param obj A complex multi-level object of nested objects
 *
 * @returns object with flattened dot-notation keys and string values
 */
export const flatten = (
  obj: { [key: string]: any },
  current?: string,
  result: any = {},
): { [key: string]: string } => {
  for (const key in obj) {
    const value = obj[key];
    const newKey = current ? `${current}.${key}` : key;
    if (value && typeof value === 'object') {
      flatten(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
};
