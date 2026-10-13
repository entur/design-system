import React from 'react';
import { Button, ButtonGroup } from '@entur/linje';
import { AddIcon, ForwardIcon } from '@entur/icons';

export const Variants = () => (
  <ButtonGroup>
    <Button variant="primary">Kjøp billett</Button>
    <Button variant="secondary">Avbryt</Button>
    <Button variant="success">Bekreft</Button>
    <Button variant="negative">Slett</Button>
  </ButtonGroup>
);

export const Sizes = () => (
  <ButtonGroup>
    <Button variant="primary" size="large">
      Stor
    </Button>
    <Button variant="primary">Medium</Button>
    <Button variant="secondary" size="small">
      Liten
    </Button>
  </ButtonGroup>
);

export const WithIcons = () => (
  <ButtonGroup>
    <Button variant="secondary">
      <AddIcon /> Legg til kunde
    </Button>
    <Button variant="success">
      Gå videre <ForwardIcon />
    </Button>
  </ButtonGroup>
);

export const States = () => (
  <ButtonGroup>
    <Button variant="primary" loading>
      Lagrer
    </Button>
    <Button variant="primary" disabled>
      Utilgjengelig
    </Button>
  </ButtonGroup>
);

export const Fluid = () => (
  <div style={{ width: 320 }}>
    <Button variant="primary" width="fluid">
      Til betaling
    </Button>
  </div>
);
