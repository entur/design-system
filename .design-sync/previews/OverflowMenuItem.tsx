import React, { useEffect, useRef } from 'react';
import { OverflowMenu, OverflowMenuItem } from '@entur/linje';
import { EditIcon, DeleteIcon, DownloadIcon } from '@entur/icons';

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
    <OverflowMenu aria-label="Valg for avgang">
      <OverflowMenuItem onSelect={() => undefined}>
        Se avgangstider
      </OverflowMenuItem>
      <OverflowMenuItem onSelect={() => undefined}>
        Legg til favoritt
      </OverflowMenuItem>
      <OverflowMenuItem onSelect={() => undefined}>Del reise</OverflowMenuItem>
    </OverflowMenu>
  </OpenOnMount>
);

export const WithIconsAndDisabled = () => (
  <OpenOnMount>
    <OverflowMenu aria-label="Valg for billett">
      <OverflowMenuItem onSelect={() => undefined}>
        <DownloadIcon inline aria-hidden /> Last ned kvittering
      </OverflowMenuItem>
      <OverflowMenuItem onSelect={() => undefined}>
        <EditIcon inline aria-hidden /> Endre reisende
      </OverflowMenuItem>
      <OverflowMenuItem disabled>
        <DeleteIcon inline aria-hidden /> Refunder (utløpt)
      </OverflowMenuItem>
    </OverflowMenu>
  </OpenOnMount>
);
