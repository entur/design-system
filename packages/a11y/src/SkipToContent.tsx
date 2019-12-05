import React from 'react';
import './SkipToContent.scss';

export type SkipToContentProps = {
  /** Lenketeksten */
  children: React.ReactNode;
  /** IDen til hovedinnholdsområdet
   * @default "main-content"
   */
  mainId?: string;
};

export const SkipToContent: React.FC<SkipToContentProps> = ({
  children,
  mainId = 'main-content',
}) => (
  <a className="eds-skip-to-content" href={`#${mainId}`}>
    {children}
  </a>
);
