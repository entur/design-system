import React from 'react';
import { LinkIcon } from '@entur/icons';
import { useHeadingIds } from './HeadingIdContext';
import { sanitizeText } from 'src/utils/utils';
import { handleHashLinkClick } from 'src/utils/scrollUtils';
import './HeadingAnchor.scss';

type HeadingAnchorProps = {
  headingText?: string;
  headingKey?: string;
  headingId?: string;
  children: React.ReactNode;
  HeadingComponent: React.ElementType;
};

/** A heading whose text links to itself, so the section can be linked to (as MDN and Primer do) */
export const HeadingAnchor: React.FC<HeadingAnchorProps> = ({
  headingText,
  headingKey,
  headingId,
  HeadingComponent,
  children,
}) => {
  const headingIds = useHeadingIds();
  // The slug is a fallback for content the extraction does not walk.
  const id =
    headingId ??
    (headingKey ? headingIds?.get(headingKey) : undefined) ??
    (headingText ? sanitizeText(headingText) : '');

  if (!id) return <HeadingComponent>{children}</HeadingComponent>;

  return (
    <HeadingComponent id={id}>
      <a
        href={`#${id}`}
        className="heading-anchor"
        // One scroll to below the navigation, instead of a jump and a correction
        onClick={handleHashLinkClick}
      >
        {children}
        <LinkIcon aria-hidden="true" className="heading-anchor__icon" />
      </a>
    </HeadingComponent>
  );
};
