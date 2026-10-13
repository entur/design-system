import React from 'react';
import { IconButton } from '@entur/linje';
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  CloseIcon,
  MenuIcon,
  ShareIcon,
} from '@entur/icons';

const row: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-small, 0.5rem)',
  alignItems: 'center',
};

export const Default = () => (
  <div style={row}>
    <IconButton aria-label="Legg til reise">
      <AddIcon />
    </IconButton>
    <IconButton aria-label="Meny">
      <MenuIcon />
    </IconButton>
    <IconButton aria-label="Rediger reise">
      <EditIcon />
    </IconButton>
    <IconButton aria-label="Lukk">
      <CloseIcon />
    </IconButton>
  </div>
);

export const Sizes = () => (
  <div style={row}>
    <IconButton aria-label="Del reise">
      <ShareIcon />
    </IconButton>
    <IconButton aria-label="Del reise" size="small">
      <ShareIcon />
    </IconButton>
  </div>
);

export const States = () => (
  <div style={row}>
    <IconButton aria-label="Lagrer endringer" loading>
      <EditIcon />
    </IconButton>
    <IconButton aria-label="Slett reise" disabled>
      <DeleteIcon />
    </IconButton>
  </div>
);

export const InTripRow = () => (
  <div
    style={{
      ...row,
      justifyContent: 'space-between',
      width: 380,
      padding: 'var(--space-small, 0.5rem) var(--space-default, 1rem)',
      border: '1px solid var(--basecolors-stroke-subdued, #d7d7e0)',
      borderRadius: 4,
    }}
  >
    <span>Oslo S → Lillehammer, 08.02</span>
    <span style={row}>
      <IconButton aria-label="Rediger reise">
        <EditIcon />
      </IconButton>
      <IconButton aria-label="Slett reise">
        <DeleteIcon />
      </IconButton>
    </span>
  </div>
);
