import { sanitizeText } from './utils';

// Depth 2 is a top-level section, 3 and 4 are nested under it.
export const TOC_MIN_DEPTH = 2;
export const TOC_MAX_DEPTH = 4;

export type ExtractedHeading = {
  /** _key of the block the heading came from. */
  key?: string;
  id: string;
  title: string;
  depth: number;
};

export const getBlockText = (block: any): string =>
  block.children?.map((child: any) => child.text || '').join('') || '';

/** The one place heading ids are derived. Rendered headings look theirs up by _key. */
export const extractHeadings = (content: any): ExtractedHeading[] => {
  if (!content) return [];

  const headings: ExtractedHeading[] = [];
  const taken = new Set<string>();

  const addHeading = (
    key: string | undefined,
    title: string,
    depth: number,
  ) => {
    // Counting against every id handed out, not just repeats of this title,
    // so a heading actually called "Steg 2" cannot take steg-2 from the
    // second "Steg".
    const base = sanitizeText(title);
    let id = base;
    for (let suffix = 2; taken.has(id); suffix += 1) id = `${base}-${suffix}`;
    taken.add(id);
    headings.push({ key, id, title, depth });
  };

  const walk = (block: any) => {
    if (!block) return;

    // An empty section renders nothing, so it would be a link to nowhere.
    if (block._type === 'docSection' && block.title && block.items?.length) {
      addHeading(block._key, block.title, TOC_MIN_DEPTH);
    } else if (block._type === 'block' && block.style?.startsWith('h')) {
      const title = getBlockText(block);
      if (title) {
        addHeading(block._key, title, parseInt(block.style.slice(1), 10));
      }
    }

    // Children sit under a different field per block type.
    const nested =
      block.items ?? block._rawItems ?? block.content ?? block.text;
    if (Array.isArray(nested)) nested.forEach(walk);
  };

  const blocks = Array.isArray(content)
    ? content
    : content.items ?? content._rawItems;
  if (Array.isArray(blocks)) blocks.forEach(walk);

  return headings;
};

export const buildHeadingIdMap = (content: any): Map<string, string> => {
  const map = new Map<string, string>();
  extractHeadings(content).forEach(heading => {
    if (heading.key) map.set(heading.key, heading.id);
  });
  return map;
};
