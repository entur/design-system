import React from 'react';
import classNames from 'classnames';
import { Link as LinkText } from '@entur/typography';
import { RightArrowIcon } from '@entur/icons';
import './Breadcrumbs.scss';

export type BreadcrumbsProps = {
  /** Liste med objekter, hver med en label og en link. Siste i listen er den gjendende siden */
  links: {
    label: string;
    link: string;
  }[];
  /** Lenke-elementet som rendres for hver brødsmule
   * @default 'a'
   */
  as?: 'a' | React.ComponentType<{ to: string; className?: string }>;
  /** Label for brødsmulestien.
   * @default 'Brødsmulesti'
   */
  'aria-label'?: string;
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  'aria-label': ariaLabel = 'Brødsmulesti',
  as: Link = 'a',
  links,
}) => {
  return (
    <nav aria-label={ariaLabel}>
      <ol className="eds-breadcrumbs">
        {links.map((link, index) => {
          const isCurrent = links.length === index + 1;
          const linkClassNames = classNames('eds-breadcrumbs__link', {
            'eds-breadcrumbs__link--current': isCurrent,
          });
          return (
            <li className="eds-breadcrumbs__item" key={link.link}>
              {Link === 'a' ? (
                <LinkText
                  href={link.link}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={linkClassNames}
                >
                  {link.label}
                </LinkText>
              ) : (
                <LinkText
                  as={Link}
                  to={link.link}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={linkClassNames}
                >
                  {link.label}
                </LinkText>
              )}
              {!isCurrent && (
                <RightArrowIcon
                  className="eds-breadcrumbs__separator"
                  inline
                  role="presentation"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
