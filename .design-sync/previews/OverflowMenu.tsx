import React, { useEffect, useRef } from 'react';
import {
  OverflowMenu,
  OverflowMenuItem,
  OverflowMenuLink,
  SecondaryButton,
} from '@entur/linje';
import {
  EditIcon,
  DeleteIcon,
  DownloadIcon,
  ShareIcon,
  ValidationInfoFilledIcon,
} from '@entur/icons';

const OpenOnMount = ({
  children,
  height = 240,
}: {
  children: React.ReactNode;
  height?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector('button')?.click();
  }, []);
  return (
    <div ref={ref} style={{ minHeight: height, minWidth: 240 }}>
      {children}
    </div>
  );
};

export const Default = () => (
  <OverflowMenu aria-label="Valg for billett">
    <OverflowMenuItem onSelect={() => undefined}>Vis billett</OverflowMenuItem>
    <OverflowMenuItem onSelect={() => undefined}>
      Endre reisende
    </OverflowMenuItem>
    <OverflowMenuItem onSelect={() => undefined}>Refunder</OverflowMenuItem>
  </OverflowMenu>
);

export const Open = () => (
  <OpenOnMount>
    <OverflowMenu aria-label="Valg for billett">
      <OverflowMenuItem onSelect={() => undefined}>
        Vis billett
      </OverflowMenuItem>
      <OverflowMenuItem onSelect={() => undefined}>
        Endre reisende
      </OverflowMenuItem>
      <OverflowMenuItem onSelect={() => undefined}>Refunder</OverflowMenuItem>
      <OverflowMenuLink href="#">Kjøpsvilkår</OverflowMenuLink>
    </OverflowMenu>
  </OpenOnMount>
);

export const WithIcons = () => (
  <OpenOnMount>
    <OverflowMenu aria-label="Valg for kvittering">
      <OverflowMenuItem onSelect={() => undefined}>
        <ValidationInfoFilledIcon inline aria-hidden /> Detaljer
      </OverflowMenuItem>
      <OverflowMenuItem onSelect={() => undefined}>
        <DownloadIcon inline aria-hidden /> Last ned kvittering
      </OverflowMenuItem>
      <OverflowMenuItem onSelect={() => undefined}>
        <ShareIcon inline aria-hidden /> Del billett
      </OverflowMenuItem>
      <OverflowMenuItem onSelect={() => undefined}>
        <EditIcon inline aria-hidden /> Endre
      </OverflowMenuItem>
      <OverflowMenuItem onSelect={() => undefined}>
        <DeleteIcon inline aria-hidden /> Slett
      </OverflowMenuItem>
    </OverflowMenu>
  </OpenOnMount>
);

export const CustomButton = () => (
  <OpenOnMount height={200}>
    <OverflowMenu
      button={<SecondaryButton size="small">Flere valg</SecondaryButton>}
    >
      <OverflowMenuItem onSelect={() => undefined}>
        Legg til favoritt
      </OverflowMenuItem>
      <OverflowMenuItem onSelect={() => undefined}>
        Kopier lenke
      </OverflowMenuItem>
      <OverflowMenuItem disabled>Endre avgang</OverflowMenuItem>
    </OverflowMenu>
  </OpenOnMount>
);
