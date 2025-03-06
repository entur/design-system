export function pxToRem(pxValue: number | undefined) {
  if (pxValue === undefined) return undefined;
  const rootFontSize = window.getComputedStyle(document.body)?.['font-size'] as
    | string
    | undefined;
  const rootFontNumber = parseInt(
    /(\d+)px$/gm.exec(rootFontSize ?? '')?.[0] ?? '',
  );
  if (isNaN(rootFontNumber)) {
    console.error('Could not get root font size');
    return pxValue / 16;
  }

  const remValue = pxValue / rootFontNumber;
  return remValue;
}
