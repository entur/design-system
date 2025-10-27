import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from '@reach/router';
import classNames from 'classnames';
import { Heading } from '@entur/typography/beta';
import { handleHashLinkClick } from '../../../utils/scrollUtils';

import './TableOfContent.scss';

interface Heading {
  id: string;
  title: string;
  depth: number;
}

interface SanityTableOfContentProps {
  content: any; // PortableText content
}

const extractHeadingsFromPortableText = (content: any): Heading[] => {
  if (!content) return [];

  const headings: Heading[] = [];

  const processBlock = (block: any, depth = 1) => {
    if (block._type === 'block' && block.style?.startsWith('h')) {
      const level = parseInt(block.style.replace('h', ''));
      const title =
        block.children?.map((child: any) => child.text || '').join('') || '';

      if (title) {
        // Use the same ID as PortableText component (value._key)
        const id = block._key;

        headings.push({
          id,
          title,
          depth: level,
        });
      }
    }

    // Process nested items
    if (block.items) {
      block.items.forEach((item: any) => processBlock(item, depth + 1));
    }
  };

  // Handle textBlocks structure (has items array)
  if (content.items) {
    content.items.forEach((block: any) => processBlock(block));
  }
  // Handle raw PortableText structure (has _rawItems array)
  else if (content._rawItems) {
    content._rawItems.forEach((block: any) => processBlock(block));
  }

  return headings;
};

function useCurrentActiveHeading(headings: Heading[]) {
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const visibleEntry = entries.find(entry => entry.isIntersecting);
      if (visibleEntry) {
        setActiveHeading(visibleEntry.target.id);
      }
    },
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '0px 0px -70% 0px',
      threshold: [0.1, 0.5, 1.0],
    });

    const elements = headings.map(heading =>
      document.getElementById(heading.id),
    );

    elements.forEach(el => el && observer.observe(el));

    // Cleanup
    return () => {
      elements.forEach(el => el && observer.unobserve(el));
      observer.disconnect();
    };
  }, [headings, observerCallback]);

  const { pathname } = useLocation();
  // Set active heading to the first heading when the pathname changes
  useEffect(() => {
    if (headings.length > 0) {
      setActiveHeading(headings[0].id);
    }
  }, [pathname, headings]);

  return activeHeading;
}

const SanityTableOfContent: React.FC<SanityTableOfContentProps> = ({
  content,
}) => {
  const headings = useMemo(
    () => extractHeadingsFromPortableText(content),
    [content],
  );
  const filteredHeadings = useMemo(
    () => headings.filter(heading => heading.depth >= 2 && heading.depth <= 6),
    [headings],
  );
  const activeHeading = useCurrentActiveHeading(filteredHeadings);

  if (filteredHeadings.length < 2) {
    return null;
  }

  return (
    <nav className="table-of-content-container">
      <Heading as="h2" variant="subtitle-2" spacing="none">
        Innhold
      </Heading>
      <ul className="table-of-content">
        {filteredHeadings.map(heading => {
          return (
            <li
              key={heading.id}
              className={classNames(
                'table-of-content__item',
                `table-of-content__item--depth-${heading.depth}`,
              )}
            >
              <a
                className={classNames('table-of-content__link', {
                  'table-of-content__link--active':
                    activeHeading === heading.id,
                })}
                href={`#${heading.id}`}
                onClick={handleHashLinkClick}
              >
                <span>{heading.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SanityTableOfContent;
