import React, { useMemo } from 'react';
import { useToast } from '@entur/alert';
import { IconButton } from '@entur/button';
import { CopyIcon } from '@entur/icons';
import { useHeadingId } from './HeadingIdContext';
import './HeadingAnchor.scss';

type HeadingAnchorProps = {
  headingText?: string;
  headingId?: string;
  children: React.ReactNode;
  HeadingComponent: React.ElementType;
};

export const HeadingAnchor: React.FC<HeadingAnchorProps> = ({
  headingText,
  headingId,
  HeadingComponent,
  children,
}) => {
  const { getId } = useHeadingId();
  const generatedId = useMemo(
    () => (headingText ? getId(headingText) : ''),
    [getId, headingText],
  );
  const id = headingId ?? generatedId;
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
