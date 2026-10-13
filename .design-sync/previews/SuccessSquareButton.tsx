import React from 'react';
import { SuccessSquareButton } from '@entur/linje';
import { CheckIcon } from '@entur/icons';

const row: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-large, 1.5rem)',
  alignItems: 'center',
  flexWrap: 'wrap',
};

export const IconOnly = () => (
  <SuccessSquareButton aria-label="Lagre">
    <CheckIcon />
  </SuccessSquareButton>
);

export const WithText = () => (
  <div style={row}>
    <SuccessSquareButton>
      Lagre <CheckIcon />
    </SuccessSquareButton>
    <SuccessSquareButton>
      <CheckIcon /> Lagre
    </SuccessSquareButton>
  </div>
);

export const Sizes = () => (
  <div style={row}>
    <SuccessSquareButton size="large">
      Lagre <CheckIcon />
    </SuccessSquareButton>
    <SuccessSquareButton size="medium">
      Lagre <CheckIcon />
    </SuccessSquareButton>
    <SuccessSquareButton size="small">
      Lagre <CheckIcon />
    </SuccessSquareButton>
  </div>
);

export const States = () => (
  <div style={row}>
    <SuccessSquareButton loading aria-label="Lagre">
      <CheckIcon />
    </SuccessSquareButton>
    <SuccessSquareButton disabled>
      Lagre <CheckIcon />
    </SuccessSquareButton>
  </div>
);
