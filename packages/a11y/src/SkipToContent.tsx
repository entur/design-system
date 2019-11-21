import React from 'react';
import { Link } from '@entur/typography';
import './SkipToContent.scss';

export type SkipToContentProps = {
  /** Lenketeksten */
  children: React.ReactNode;
  /** IDen til hovedinnholdsområdet */
  mainId?: string;
};

export const SkipToContent: React.FC<SkipToContentProps> = ({
  children,
  mainId = 'main-content',
}) => (
  <div className="eds-skip-to-content">
    <Link href={`#${mainId}`}>{children}</Link>
  </div>
);
