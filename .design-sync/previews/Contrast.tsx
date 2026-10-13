import React from 'react';
import {
  Contrast,
  Heading2,
  Paragraph,
  Button,
  ButtonGroup,
  TextField,
  Link,
  Tag,
} from '@entur/linje';
import { DestinationIcon } from '@entur/icons';

export const Default = () => (
  <Contrast style={{ padding: 'var(--space-extra-large)', maxWidth: 480 }}>
    <Heading2>Planlegg reisen din</Heading2>
    <Paragraph>
      Finn avganger med buss, tog, trikk og båt i hele Norge – samlet på ett
      sted. <Link href="#">Les mer om reiseplanleggeren</Link>
    </Paragraph>
    <ButtonGroup>
      <Button variant="primary">Søk etter reise</Button>
      <Button variant="secondary">Mine billetter</Button>
    </ButtonGroup>
  </Contrast>
);

export const SideBySide = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    <div style={{ padding: 'var(--space-large)', width: 260 }}>
      <Paragraph margin="bottom">Standard flate</Paragraph>
      <ButtonGroup>
        <Button variant="primary">Kjøp</Button>
        <Button variant="secondary">Avbryt</Button>
      </ButtonGroup>
    </div>
    <Contrast style={{ padding: 'var(--space-large)', width: 260 }}>
      <Paragraph margin="bottom">Kontrastflate</Paragraph>
      <ButtonGroup>
        <Button variant="primary">Kjøp</Button>
        <Button variant="secondary">Avbryt</Button>
      </ButtonGroup>
    </Contrast>
  </div>
);

export const WithForm = () => (
  <Contrast style={{ padding: 'var(--space-extra-large)', width: 360 }}>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-default)',
      }}
    >
      <TextField label="Fra" defaultValue="Oslo S" />
      <TextField
        label="Til"
        defaultValue="Bergen stasjon"
        prepend={<DestinationIcon />}
      />
      <div style={{ display: 'flex', gap: 'var(--space-small)' }}>
        <Tag variant="information">Direkte</Tag>
        <Tag>6 t 45 min</Tag>
      </div>
      <Button variant="primary" width="fluid">
        Finn reise
      </Button>
    </div>
  </Contrast>
);
