import React from 'react';
import classNames from 'classnames';
import debounce from '~/utils/debounce';
import { useCurrentDoc, Entry } from 'docz';
import './TocNavigation.scss';
import { Heading3 } from '@entur/typography/src';

function useCurrentActiveHeading(headings: Entry['headings']) {
  const [activeHeading, setActiveHeading] = React.useState<string | null>(null);

  React.useEffect(() => {
    const findActiveHeading = debounce(() => {
      for (let nextElement of headingElements) {
        const nextTop = nextElement.getBoundingClientRect().top;
        if (nextTop >= 0) {
          setActiveHeading(nextElement.id);
          break;
        }
      }
    }, 16);
    const headingElements = headings.map(
      heading => document.getElementById(heading.slug) as HTMLElement,
    );
    window.addEventListener('resize', findActiveHeading);
    window.addEventListener('scroll', findActiveHeading);
    findActiveHeading();
    return () => {
      window.removeEventListener('resize', findActiveHeading);
      window.removeEventListener('scroll', findActiveHeading);
    };
  }, [headings]);

  return activeHeading;
}

export const TocNavigation: React.FC = () => {
  const currentDoc = useCurrentDoc() as Entry;
  const headings = currentDoc
    ? currentDoc.headings.filter(
        heading => heading.depth > 1 && heading.depth < 4,
      )
    : [];
  const activeHeading = useCurrentActiveHeading(headings);
  if (headings.length < 2) {
    return null;
  }
  return (
    <nav className="table-of-content-container">
      <Heading3 style={{ margin: 0 }}>Innhold</Heading3>
      <ul className="table-of-content">
        {headings.map(heading => (
          <li
            key={heading.slug}
            className={classNames(
              'table-of-content__item',
              `table-of-content__item--depth-${heading.depth}`,
            )}
          >
            <a
              className={classNames('table-of-content__link', {
                'table-of-content__link--active':
                  activeHeading === heading.slug,
              })}
              href={`#${heading.slug}`}
            >
              {heading.value}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
