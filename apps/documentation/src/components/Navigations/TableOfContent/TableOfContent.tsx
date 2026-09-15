import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from '@reach/router';
import classNames from 'classnames';
import { Heading4 } from '@entur/typography';
import { ExpandablePanel } from '@entur/expand';
import {
  getNavbarHeightPx,
  handleHashLinkClick,
} from '../../../utils/scrollUtils';
import { TOC_MAX_DEPTH, TOC_MIN_DEPTH } from 'src/utils/headingIds';

import './TableOfContent.scss';

export interface TocHeading {
  id: string;
  title: string;
  depth: number;
}

interface TableOfContentProps {
  headings: TocHeading[];
}

// Safari only got scrollend in 18.2, so the click lock needs a timer to fall
// back on or the active marker would stay stuck on the clicked heading.
const CLICK_LOCK_MS = 1000;

function useActiveHeading(
  headings: TocHeading[],
  navRef: React.RefObject<HTMLElement>,
) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );
  const clickedId = useRef<string | null>(null);
  const lockTimeout = useRef<ReturnType<typeof setTimeout>>();
  const releaseLock = useRef<() => void>(() => {});

  useEffect(() => {
    if (headings.length === 0) return;

    // Heading offsets are measured once and reused, so a scroll frame reads
    // one number per heading instead of measuring all of them.
    let offsetPx = 0;
    let measuredHeight = 0;
    let measured: Array<{ id: string; element: HTMLElement; top: number }> = [];

    const measure = () => {
      offsetPx = getNavbarHeightPx() + 2;
      measuredHeight = document.documentElement.scrollHeight;
      measured = headings
        .map(heading => document.getElementById(heading.id))
        .filter((element): element is HTMLElement => element !== null)
        .map(element => ({
          id: element.id,
          element,
          top: element.getBoundingClientRect().top + window.scrollY,
        }));
    };

    // Images and code examples change the height of the page as they settle,
    // and a re-render swaps the heading elements out for new ones.
    const isStale = () =>
      measured.length !== headings.length ||
      document.documentElement.scrollHeight !== measuredHeight ||
      measured.some(({ element }) => !element.isConnected);

    const pick = () => {
      // Sidebar and inline list are swapped by a media query, and the hidden
      // one has nothing to highlight.
      if (navRef.current?.offsetParent === null) return;
      if (isStale()) measure();
      if (clickedId.current) return;
      const line = window.scrollY + offsetPx;
      let current = headings[0].id;
      for (const heading of measured) {
        if (heading.top > line) break;
        current = heading.id;
      }
      setActiveId(current);
    };

    const release = () => {
      clearTimeout(lockTimeout.current);
      clickedId.current = null;
      measure();
      pick();
    };
    releaseLock.current = release;

    measure();
    pick();

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(pick);
    };

    const onScrollEnd = () => {
      if (clickedId.current) release();
    };

    // A viewport change moves the headings and can change the navbar height.
    const onResize = () => {
      measure();
      pick();
    };
    window.addEventListener('resize', onResize, { passive: true });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', onScrollEnd, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', onScrollEnd);
    };
  }, [headings, navRef]);

  const { pathname } = useLocation();
  useEffect(() => {
    if (headings.length > 0) {
      setActiveId(headings[0].id);
    }
  }, [pathname, headings]);

  useEffect(() => () => clearTimeout(lockTimeout.current), []);

  const setClickedHeading = (id: string) => {
    clickedId.current = id;
    setActiveId(id);
    clearTimeout(lockTimeout.current);
    lockTimeout.current = setTimeout(
      () => releaseLock.current(),
      CLICK_LOCK_MS,
    );
  };

  return { activeId, setClickedHeading };
}

const TocList: React.FC<{
  headings: TocHeading[];
  activeId: string | null;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
  animated?: boolean;
}> = ({ headings, activeId, onLinkClick, animated = false }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated || !listRef.current || !indicatorRef.current || !activeId)
      return;
    const list = listRef.current;
    const activeLink = list.querySelector(
      `a[href="#${CSS.escape(activeId)}"]`,
    ) as HTMLElement | null;
    if (!activeLink) return;
    const listRect = list.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    indicatorRef.current.style.transform = `translateY(${
      linkRect.top - listRect.top
    }px)`;
    indicatorRef.current.style.height = `${linkRect.height}px`;
  }, [activeId, animated]);

  return (
    <div className="table-of-content-wrapper" ref={listRef}>
      {animated && (
        <div ref={indicatorRef} className="table-of-content__indicator" />
      )}
      <ul className="table-of-content">
        {headings.map(heading => (
          <li
            key={heading.id}
            className={classNames(
              'table-of-content__item',
              `table-of-content__item--depth-${heading.depth}`,
            )}
          >
            <a
              className={classNames('table-of-content__link', {
                'table-of-content__link--active': activeId === heading.id,
              })}
              href={`#${heading.id}`}
              onClick={e => onLinkClick(e, heading.id)}
            >
              <span>{heading.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const filterTocHeadings = (headings: TocHeading[]) =>
  headings.filter(h => h.depth >= TOC_MIN_DEPTH && h.depth <= TOC_MAX_DEPTH);

/** Fewer than two entries is a list of one link, which is not worth showing. */
export const hasEnoughHeadings = (headings: TocHeading[]) =>
  filterTocHeadings(headings).length >= 2;

const useFilteredHeadings = (headings: TocHeading[]) =>
  useMemo(() => filterTocHeadings(headings), [headings]);

const TableOfContentSidebar: React.FC<TableOfContentProps> = ({ headings }) => {
  const navRef = useRef<HTMLElement>(null);
  const filteredHeadings = useFilteredHeadings(headings);
  const { activeId, setClickedHeading } = useActiveHeading(
    filteredHeadings,
    navRef,
  );

  if (filteredHeadings.length < 2) return null;

  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setClickedHeading(id);
    handleHashLinkClick(e);
  };

  return (
    <nav className="table-of-content-sidebar" aria-label="Innhold" ref={navRef}>
      <Heading4 as="h2" style={{ margin: 0, marginBlockEnd: '1rem' }}>
        Innhold
      </Heading4>
      <TocList
        headings={filteredHeadings}
        activeId={activeId}
        onLinkClick={onLinkClick}
        animated
      />
    </nav>
  );
};

const TableOfContentInline: React.FC<TableOfContentProps> = ({ headings }) => {
  const navRef = useRef<HTMLElement>(null);
  const filteredHeadings = useFilteredHeadings(headings);
  const { activeId, setClickedHeading } = useActiveHeading(
    filteredHeadings,
    navRef,
  );

  if (filteredHeadings.length < 2) return null;

  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setClickedHeading(id);
    handleHashLinkClick(e);
  };

  return (
    <nav className="table-of-content-inline" aria-label="Innhold" ref={navRef}>
      <ExpandablePanel title="Innhold">
        <TocList
          headings={filteredHeadings}
          activeId={activeId}
          onLinkClick={onLinkClick}
        />
      </ExpandablePanel>
    </nav>
  );
};

export { TableOfContentSidebar, TableOfContentInline };
export default TableOfContentInline;
