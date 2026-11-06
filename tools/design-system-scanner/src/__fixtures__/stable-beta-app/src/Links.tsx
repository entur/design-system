import * as React from 'react';
import { Link } from '@entur/typography';
import { Link as BetaLink } from '@entur/typography/beta';

export const Links = () => (
  <>
    <Link href="/old">Old</Link>
    <BetaLink href="/new">New</BetaLink>
    <BetaLink href="/newer">Newer</BetaLink>
    <BetaLink href="/newest">Newest</BetaLink>
  </>
);
