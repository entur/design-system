import React, { useMemo } from 'react';
import { TableOfContentInline } from './TableOfContent';
import { extractHeadings } from 'src/utils/headingIds';

interface SanityTableOfContentProps {
  content: any;
}

const SanityTableOfContent: React.FC<SanityTableOfContentProps> = ({
  content,
}) => {
  const headings = useMemo(() => extractHeadings(content), [content]);

  return <TableOfContentInline headings={headings} />;
};

export default SanityTableOfContent;
