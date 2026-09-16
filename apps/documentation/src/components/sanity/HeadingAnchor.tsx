import React from 'react';
import { useToast } from '@entur/alert';
import { IconButton } from '@entur/button';
import { CopyIcon } from '@entur/icons';
import { useHeadingIds } from './HeadingIdContext';
import { sanitizeText } from 'src/utils/utils';
import './HeadingAnchor.scss';

type HeadingAnchorProps = {
  headingText?: string;
  headingKey?: string;
  headingId?: string;
  children: React.ReactNode;
  HeadingComponent: React.ElementType;
};

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
  const { addToast } = useToast();

  const copyLink = () => {
    if (!id) return;
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    history.replaceState(null, '', `#${id}`);
    navigator.clipboard.writeText(url).then(
      () =>
        addToast({
          title: 'Kopiert!',
          content: 'Lenke kopiert til utklippstavla',
        }),
      () =>
        addToast({
          title: 'Kopiering feilet',
          content: 'Kunne ikke kopiere lenken til utklippstavla',
          variant: 'information',
        }),
    );
  };

  return (
    <div className="heading-anchor">
      <HeadingComponent id={id}>{children}</HeadingComponent>
      {id && (
        <IconButton
          className="heading-anchor__copy-button"
          onClick={copyLink}
          aria-label="Kopier lenke til seksjon"
        >
          <CopyIcon size={16} />
        </IconButton>
      )}
    </div>
  );
};
