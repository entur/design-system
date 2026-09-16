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

export const filterTocHeadings = (headings: TocHeading[]) =>
  headings.filter(h => h.depth >= TOC_MIN_DEPTH && h.depth <= TOC_MAX_DEPTH);

// Older Safari never fires scrollend, so the lock a click puts on the marker
// has to expire on its own.
const CLICK_LOCK_MS = 1000;

function useActiveHeading(
  headings: TocHeading[],
  navRef: React.RefObject<HTMLElement>,
) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );
  const lockedUntil = useRef(0);

  useEffect(() => {
    if (headings.length === 0) return;

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

    // Offsets are measured once so scrolling only compares numbers. Loading
    // images move the headings, and a re-render replaces their elements.
    const isStale = () =>
      measured.length !== headings.length ||
      document.documentElement.scrollHeight !== measuredHeight ||
      measured.some(({ element }) => !element.isConnected);

    const pick = () => {
      // The variant the media query hides has nothing to highlight.
      if (navRef.current?.offsetParent === null) return;
      if (isStale()) measure();
      if (Date.now() < lockedUntil.current) return;

      const line = window.scrollY + offsetPx;
      let current = headings[0].id;
      for (const heading of measured) {
        if (heading.top > line) break;
        current = heading.id;
      }
      setActiveId(current);
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(pick);
    };
    const onScrollEnd = () => {
      lockedUntil.current = 0;
      pick();
    };
    const onResize = () => {
      measure();
      pick();
    };

    measure();
    pick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', onScrollEnd, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('resize', onResize);
    };
  }, [headings, navRef]);

  const { pathname } = useLocation();
  useEffect(() => {
    if (headings.length > 0) setActiveId(headings[0].id);
  }, [pathname, headings]);

  // Hold the clicked heading until the scroll it starts has settled.
  const setClickedHeading = (id: string) => {
    lockedUntil.current = Date.now() + CLICK_LOCK_MS;
    setActiveId(id);
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

/**
 * Sidebar and inline disclosure show the same list; a media query decides
 * which of the two is visible.
 */
export const TableOfContent: React.FC<{
  headings: TocHeading[];
  variant: 'sidebar' | 'inline';
}> = ({ headings, variant }) => {
  const navRef = useRef<HTMLElement>(null);
  const filteredHeadings = useMemo(
    () => filterTocHeadings(headings),
    [headings],
  );
  const { activeId, setClickedHeading } = useActiveHeading(
    filteredHeadings,
    navRef,
  );

  // A single link is not a table of contents.
  if (filteredHeadings.length < 2) return null;

  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setClickedHeading(id);
    handleHashLinkClick(e);
  };

  const list = (
    <TocList
      headings={filteredHeadings}
      activeId={activeId}
      onLinkClick={onLinkClick}
      animated={variant === 'sidebar'}
    />
  );

  if (variant === 'inline') {
    return (
      <nav
        className="table-of-content-inline"
        aria-label="Innhold"
        ref={navRef}
      >
        <ExpandablePanel title="Innhold">{list}</ExpandablePanel>
      </nav>
    );
  }

  return (
    <nav className="table-of-content-sidebar" aria-label="Innhold" ref={navRef}>
      <Heading4 as="h2" style={{ margin: 0, marginBlockEnd: '1rem' }}>
        Innhold
      </Heading4>
      {list}
    </nav>
  );
};
