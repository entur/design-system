import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { useLocation } from '@reach/router';
import classNames from 'classnames';
import { Heading4 } from '@entur/typography';
import { removeTrailingSlash } from '../SideNavigation/utils';
import './TableOfContent.scss';

interface Heading {
  url: string;
  title: string;
  items?: Heading[];
  depth?: number;
}

interface TableOfContentQuery {
  allMdx: {
    nodes: {
      frontmatter: {
        route: string;
        removeToc: boolean;
      };
      tableOfContents: {
        items?: Heading[];
      };
    }[];
  };
}
const flattenHeadings = (
  items: Heading[] = [],
  currentDepth = 1,
): Heading[] => {
  return items.reduce((acc: Heading[], item: Heading) => {
    acc.push({ ...item, depth: currentDepth });
    if (item.items) {
      acc.push(...flattenHeadings(item.items, currentDepth + 1));
    }
    return acc;
  }, []);
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
      rootMargin: '0px 0px -50% 0px',
      threshold: [0.1, 0.5, 1.0],
    });

    const elements = headings.map(heading =>
      document.getElementById(heading.url?.replace('#', '') as string),
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
      setActiveHeading(headings[0].url?.replace('#', '') || null);
    }
  }, [pathname, headings]);

  return activeHeading;
}

const TableOfContent = () => {
  const { pathname } = useLocation();

  const data: TableOfContentQuery = useStaticQuery(graphql`
    query TocNavigationQuery {
      allMdx {
        nodes {
          frontmatter {
            route
            removeToc
          }
          tableOfContents
        }
      }
    }
  `);

  const toc = useMemo(() => {
    if (!data?.allMdx?.nodes) return null;
    const currentDoc = data.allMdx.nodes.find(
      (node: TableOfContentQuery['allMdx']['nodes'][0]) =>
        removeTrailingSlash(node.frontmatter.route) ===
        removeTrailingSlash(pathname),
    );

    if (!currentDoc) {
      console.warn('No matching document found for the current route');
      return null;
    }

    if (!currentDoc || currentDoc.frontmatter.removeToc) return null;
    return currentDoc.tableOfContents || {};
  }, [data, pathname]);

  const headings = useMemo(() => toc?.items || [], [toc]);
  const filteredHeadings = useMemo(
    () => flattenHeadings(headings).filter(heading => heading.depth !== 3),
    [headings],
  );
  const activeHeading = useCurrentActiveHeading(filteredHeadings);

  if (!data?.allMdx?.nodes) {
    console.warn('Invalid data structure returned from GraphQL query');
    return null;
  }

  if (filteredHeadings.length < 2) {
    return null;
  }

  return (
    <nav className="table-of-content-container">
      <Heading4 as="h2" style={{ margin: 0 }}>
        Innhold
      </Heading4>
      <ul className="table-of-content">
        {filteredHeadings.map(heading => {
          const headingId = heading.url?.replace('#', '');
          if (!headingId) return null;

          return (
            <li
              key={headingId}
              className={classNames(
                'table-of-content__item',
                `table-of-content__item--depth-${heading.depth}`,
              )}
            >
              <a
                className={classNames('table-of-content__link', {
                  'table-of-content__link--active': activeHeading === headingId,
                })}
                href={heading.url}
              >
                {heading.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TableOfContent;
