import React from 'react';
import {
  GridContainer,
  GridItem,
  TextField,
  PrimaryButton,
  ChoiceChipGroup,
  ChoiceChip,
} from '@entur/linje';

const cell: React.CSSProperties = {
  background: 'var(--basecolors-frame-tint, #e5e5e9)',
  border: '1px solid var(--basecolors-stroke-subdued, #d7d7e0)',
  padding: 'var(--space-small, 0.5rem)',
  textAlign: 'center',
  fontSize: '0.875rem',
  borderRadius: 4,
};

export const Columns = () => (
  <div style={{ width: 480 }}>
    <GridContainer spacing="extraSmall">
      <GridItem small={12}>
        <div style={cell}>small=12</div>
      </GridItem>
      <GridItem small={6}>
        <div style={cell}>small=6</div>
      </GridItem>
      <GridItem small={6}>
        <div style={cell}>small=6</div>
      </GridItem>
      <GridItem small={3}>
        <div style={cell}>small=3</div>
      </GridItem>
      <GridItem small={3}>
        <div style={cell}>small=3</div>
      </GridItem>
      <GridItem small={3}>
        <div style={cell}>small=3</div>
      </GridItem>
      <GridItem small={3}>
        <div style={cell}>small=3</div>
      </GridItem>
    </GridContainer>
  </div>
);

export const Spacing = () => (
  <div
    style={{ width: 480, display: 'grid', gap: 'var(--space-large, 1.5rem)' }}
  >
    {(['none', 'small', 'large'] as const).map(s => (
      <GridContainer key={s} spacing={s}>
        <GridItem small={4}>
          <div style={cell}>spacing={s}</div>
        </GridItem>
        <GridItem small={4}>
          <div style={cell}>small=4</div>
        </GridItem>
        <GridItem small={4}>
          <div style={cell}>small=4</div>
        </GridItem>
      </GridContainer>
    ))}
  </div>
);

export const RowSpacing = () => (
  <div style={{ width: 480 }}>
    <GridContainer spacing="extraSmall" rowSpacing="large">
      <GridItem small={6}>
        <div style={cell}>small=6</div>
      </GridItem>
      <GridItem small={6}>
        <div style={cell}>small=6</div>
      </GridItem>
      <GridItem small={4}>
        <div style={cell}>small=4</div>
      </GridItem>
      <GridItem small={4}>
        <div style={cell}>small=4</div>
      </GridItem>
      <GridItem small={4}>
        <div style={cell}>small=4</div>
      </GridItem>
    </GridContainer>
  </div>
);

export const TicketForm = () => {
  const [value, setValue] = React.useState('voksen');
  return (
    <div style={{ width: 520 }}>
      <GridContainer spacing="medium" rowSpacing="large">
        <GridItem small={6}>
          <TextField label="Fra" defaultValue="Oslo S" />
        </GridItem>
        <GridItem small={6}>
          <TextField label="Til" defaultValue="Lillehammer" />
        </GridItem>
        <GridItem small={12}>
          <ChoiceChipGroup
            name="billettype"
            label="Billettype"
            value={value}
            onChange={e => setValue(e.target.value)}
          >
            <ChoiceChip value="barn">Barn</ChoiceChip>
            <ChoiceChip value="voksen">Voksen</ChoiceChip>
            <ChoiceChip value="honnor">Honnør</ChoiceChip>
          </ChoiceChipGroup>
        </GridItem>
        <GridItem small={4}>
          <PrimaryButton width="fluid">Kjøp</PrimaryButton>
        </GridItem>
      </GridContainer>
    </div>
  );
};
