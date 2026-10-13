import React, { useEffect, useRef } from 'react';
import { OverflowMenu, OverflowMenuItem, OverflowMenuLink } from '@entur/linje';

const OpenOnMount = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector('button')?.click();
  }, []);
  return (
    <div ref={ref} style={{ minHeight: 200, minWidth: 240 }}>
      {children}
    </div>
  );
};

export const Default = () => (
  <OpenOnMount>
    <OverflowMenu aria-label="Hjelp og informasjon">
      <OverflowMenuLink href="#">Kundeservice</OverflowMenuLink>
      <OverflowMenuLink href="#">Reisevilkår</OverflowMenuLink>
      <OverflowMenuLink href="#">Personvern</OverflowMenuLink>
    </OverflowMenu>
  </OpenOnMount>
);

export const MixedWithItems = () => (
  <OpenOnMount>
    <OverflowMenu aria-label="Valg for billett">
      <OverflowMenuItem onSelect={() => undefined}>
        Vis billett
      </OverflowMenuItem>
      <OverflowMenuItem onSelect={() => undefined}>Refunder</OverflowMenuItem>
      <OverflowMenuLink href="#">Les kjøpsvilkår</OverflowMenuLink>
      <OverflowMenuLink href="#" disabled>
        Endre billett
      </OverflowMenuLink>
    </OverflowMenu>
  </OpenOnMount>
);
