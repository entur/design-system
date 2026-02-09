export const getNextWithDataValue = (
  el: HTMLElement | null,
): HTMLElement | null => {
  let current = el?.nextElementSibling as HTMLElement | null;
  while (current) {
    if (current.hasAttribute('data-value')) return current;
    current = current.nextElementSibling as HTMLElement | null;
  }
  return null;
};

export const getPrevWithDataValue = (
  el: HTMLElement | null,
): HTMLElement | null => {
  let current = el?.previousElementSibling as HTMLElement | null;
  while (current) {
    if (current.hasAttribute('data-value')) return current;
    current = current.previousElementSibling as HTMLElement | null;
  }
  return null;
};

export const getFirstWithDataValue = (
  parent: HTMLElement | null,
): HTMLElement | null => {
  let current = parent?.firstElementChild as HTMLElement | null;
  while (current) {
    if (current.hasAttribute('data-value')) return current;
    current = current.nextElementSibling as HTMLElement | null;
  }
  return null;
};

export const getLastWithDataValue = (
  parent: HTMLElement | null,
): HTMLElement | null => {
  let current = parent?.lastElementChild as HTMLElement | null;
  while (current) {
    if (current.hasAttribute('data-value')) return current;
    current = current.previousElementSibling as HTMLElement | null;
  }
  return null;
};
