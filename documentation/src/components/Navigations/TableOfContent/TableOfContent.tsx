import React, { useEffect, useMemo, useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import classNames from 'classnames';
import { useDebounce } from '@entur/utils';
import { Heading4 } from '@entur/typography';
import { useLocation } from '@reach/router';
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

function useCurrentActiveHeading(headings: Heading[]) {
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [headingElements, setHeadingElements] = useState<HTMLElement[]>([]);

  const findActiveHeading = useDebounce(() => {
    for (const i in headingElements) {
      if (!headingElements[i]) {
        continue;
      }
      const thisTop = headingElements[i].getBoundingClientRect().top;
      const nextTop =
        headingElements[Number(i) + 1]?.getBoundingClientRect().top;

      if (thisTop + nextTop >= 0 || thisTop >= 0) {
        setActiveHeading(headingElements[i].id);
        break;
      }
    }
  }, 16);

  useEffect(() => {
    const elements = headings
      .map(heading => {
        const id = heading.url?.replace('#', '');
        const element = document.getElementById(id);
        return element;
      })
      .filter(
        (element): element is NonNullable<typeof element> => element !== null,
      );
    setHeadingElements(elements);
  }, [headings]);

  useEffect(() => {
    const articleSection = document.getElementsByClassName('page')?.[0];
    if (articleSection === null) return;

    articleSection.addEventListener('resize', findActiveHeading);
    articleSection.addEventListener('scroll', findActiveHeading);
    findActiveHeading();
    return () => {
      articleSection.removeEventListener('resize', findActiveHeading);
      articleSection.removeEventListener('scroll', findActiveHeading);
    };
  }, [findActiveHeading]);

  return activeHeading;
}

// Function to calculate depth dynamically and flatten headings
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

export const TableOfContent = () => {
  const location = useLocation();
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

  // Match the current document route with location.pathname
  const currentDoc = useMemo(
    () =>
      data.allMdx.nodes.find(
        node =>
          removeTrailingSlash(node.frontmatter.route) ===
          removeTrailingSlash(location.pathname),
      ),
    [data.allMdx.nodes, location.pathname],
  );

  if (!currentDoc || currentDoc.frontmatter.removeToc) return null;

  // Extract headings from tableOfContents
  const toc = currentDoc.tableOfContents || {};
  const headings = toc.items || [];

  // Flatten the headings and calculate depth dynamically
  const filteredHeadings = useMemo(() => flattenHeadings(headings), [headings]);

  if (filteredHeadings.length < 2) return null;

  const activeHeading = useCurrentActiveHeading(filteredHeadings);

  return (
    <nav className="table-of-content-container">
      <Heading4 style={{ margin: 0 }}>Innhold</Heading4>
      <ul className="table-of-content">
        {filteredHeadings.map(heading => (
          <li
            key={heading.url?.replace('#', '')}
            id={heading.url?.replace('#', '')}
            className={classNames(
              'table-of-content__item',
              `table-of-content__item--depth-${heading.depth}`,
            )}
          >
            <a
              className={classNames('table-of-content__link', {
                'table-of-content__link--active':
                  activeHeading === heading.url?.replace('#', ''),
              })}
              href={heading.url}
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContent;
