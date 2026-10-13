import React from 'react';
import { Tooltip, PrimaryButton, IconButton, TextField } from '@entur/linje';
import { ValidationInfoFilledIcon } from '@entur/icons';

// isOpen renders the tooltip statically (normally opened on hover/focus).
const Room = ({
  children,
  align = 'center',
}: {
  children: React.ReactNode;
  align?: string;
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: align,
      alignItems: 'center',
      minHeight: 160,
      padding: 'var(--space-large)',
    }}
  >
    {children}
  </div>
);

export const Top = () => (
  <Room>
    <Tooltip
      content="Billetten må aktiveres før du går om bord"
      placement="top"
      isOpen
      showCloseButton={false}
    >
      <PrimaryButton>Aktiver billett</PrimaryButton>
    </Tooltip>
  </Room>
);

export const Right = () => (
  <Room align="flex-start">
    <Tooltip
      content="Honnør gjelder fra fylte 67 år"
      placement="right"
      isOpen
      showCloseButton={false}
    >
      <IconButton aria-label="Mer informasjon">
        <ValidationInfoFilledIcon />
      </IconButton>
    </Tooltip>
  </Room>
);

export const WithCloseButton = () => (
  <Room>
    <Tooltip content="Nytt: lagre favorittreiser her" placement="bottom" isOpen>
      <PrimaryButton>Mine reiser</PrimaryButton>
    </Tooltip>
  </Room>
);

export const Negative = () => (
  <Room>
    <div style={{ width: 280 }}>
      <Tooltip
        content="Ugyldig mobilnummer"
        placement="top"
        isOpen
        showCloseButton={false}
        variant="negative"
      >
        <TextField label="Mobilnummer" defaultValue="12 34" />
      </Tooltip>
    </div>
  </Room>
);
