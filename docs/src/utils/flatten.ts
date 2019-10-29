export const flatten = (
  obj: { [key: string]: any },
  current?: string,
  result: any = {},
): { [key: string]: string } => {
  for (let key in obj) {
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
