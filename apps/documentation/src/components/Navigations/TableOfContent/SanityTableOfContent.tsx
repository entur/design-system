import React, { useMemo } from 'react';
import TableOfContent, { TocHeading } from './TableOfContent';

interface SanityTableOfContentProps {
  content: any;
}

const extractHeadingsFromPortableText = (content: any): TocHeading[] => {
  if (!content) return [];

  const headings: TocHeading[] = [];

  const processBlock = (block: any) => {
    if (block._type === 'block' && block.style?.startsWith('h')) {
      const level = parseInt(block.style.replace('h', ''));
      const title =
        block.children?.map((child: any) => child.text || '').join('') || '';

      if (title && block._key) {
        headings.push({ id: block._key, title, depth: level });
      }
    }

    if (block.items) {
      block.items.forEach((item: any) => processBlock(item));
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

  return <TableOfContent headings={headings} />;
};

export default SanityTableOfContent;
