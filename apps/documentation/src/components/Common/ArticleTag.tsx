import React from 'react';
import { Tag } from '@entur/layout';
import { isBetaTag } from 'src/utils/utils';

// «Beta» sier at komponenten ennå ikke ligger fast, ikke at den er ny, så den
// har sin egen kategorifarge. «Ny» er en nøytral opplysning og bruker
// information. Teksten skiller dem uansett, slik at fargen aldri er eneste
// signal.
export function ArticleTag({ tag }: { tag: string }) {
  return (
    <Tag variant={isBetaTag(tag) ? 'mystic' : 'information'}>
      {tag.charAt(0).toUpperCase() + tag.slice(1)}
    </Tag>
  );
}
