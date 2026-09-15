import { sanitizeText } from './utils';

export type ExtractedHeading = {
  /** Sanity _key of the block the heading came from, when it has one. */
  key?: string;
  id: string;
  title: string;
  depth: number;
};

const getBlockText = (block: any): string =>
  block.children?.map((child: any) => child.text || '').join('') || '';

/**
 * Single source of truth for heading ids: one pure walk over the Portable Text
 * tree, used both by the table of contents and by the rendered headings (which
 * look their id up by _key). Nothing derives an id any other way.
 */
export const extractHeadings = (content: any): ExtractedHeading[] => {
  if (!content) return [];

  const headings: ExtractedHeading[] = [];
  const seen = new Map<string, number>();

  const addHeading = (
    key: string | undefined,
    title: string,
    depth: number,
  ) => {
    const base = sanitizeText(title);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    headings.push({
      key,
      id: count === 0 ? base : `${base}-${count + 1}`,
      title,
      depth,
    });
  };

  const walk = (block: any) => {
    if (!block) return;

    if (block._type === 'docSection' && block.title) {
      addHeading(block._key, block.title, 2);
    } else if (block._type === 'block' && block.style?.startsWith('h')) {
      const title = getBlockText(block);
      if (title) {
        addHeading(block._key, title, parseInt(block.style.slice(1), 10));
      }
    }

    // Nested blocks live under different fields per type: docSection/textBlocks
    // use items (_rawItems when the field came from GraphQL rather than _raw),
    // group uses content, guideline/imageAndText use text.
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
