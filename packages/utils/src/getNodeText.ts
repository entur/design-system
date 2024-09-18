// with inspiration from https://stackoverflow.com/questions/50428910/get-text-content-from-node-in-react
export const getNodeText = (
  node: React.ReactNode | string | number | string[] | number[],
): string => {
  if (node === null || node === undefined) return '';
  if (['string', 'number'].includes(typeof node)) return node.toString();
  if (node instanceof Array) return node.map(getNodeText).join('').trim();
  if (typeof node === 'object')
    // @ts-expect-error props does exist for react nodes
    return getNodeText(node.props?.children ?? '').trim();
  return 'unknown';
};
