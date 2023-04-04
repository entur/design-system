export const mergeRefs = <T extends HTMLElement>(
  ...refs: (React.MutableRefObject<T> | React.ForwardedRef<T> | undefined)[]
) => {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) ref.current = node;
    }
  };
};
