import React, { useMemo } from 'react';
import { TableOfContentInline } from './TableOfContent';
import type { TocHeading } from './TableOfContent';
import { getUniqueId } from '@components/sanity/HeadingIdContext';

interface SanityTableOfContentProps {
  content: any;
}

export const extractHeadingsFromPortableText = (content: any): TocHeading[] => {
  if (!content) return [];

  const headings: TocHeading[] = [];
  const seen = new Map<string, number>();

  const processBlock = (block: any) => {
    if (block._type === 'docSection' && block.title) {
      headings.push({
        id: getUniqueId(block.title, seen),
        title: block.title,
        depth: 2,
      });
    }

    if (block._type === 'block' && block.style?.startsWith('h')) {
      const level = parseInt(block.style.replace('h', ''));
      const title =
        block.children?.map((child: any) => child.text || '').join('') || '';

      if (title) {
        headings.push({
          id: getUniqueId(title, seen),
          title,
          depth: level,
        });
      }
    }

    // Nested blocks live under different fields per type: docSection/textBlocks
    // use items, group uses content, guideline/imageAndText use text.
    const nested = block.items ?? block.content ?? block.text;
    if (Array.isArray(nested)) {
      nested.forEach((item: any) => processBlock(item));
    }
  };

  const blocks = Array.isArray(content)
    ? content
    : content.items || content._rawItems;
  if (blocks) {
    blocks.forEach((block: any) => processBlock(block));
  }

  return headings;
};

const SanityTableOfContent: React.FC<SanityTableOfContentProps> = ({
  content,
}) => {
  const headings = useMemo(() => {
    const seen = new Set<string>();
    return extractHeadingsFromPortableText(content).filter(h => {
      if (seen.has(h.id)) return false;
      seen.add(h.id);
      return true;
    });
  }, [content]);

  return <TableOfContentInline headings={headings} />;
};

export default SanityTableOfContent;
