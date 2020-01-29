export function debounce(fn: Function, delay: number) {
  let id: any;
  return (...args: any) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), delay);
  };
}
