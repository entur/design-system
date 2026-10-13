import React from 'react';
import { ChoiceChip, ChoiceChipGroup } from '@entur/linje';

const Group = ({
  initial,
  label,
  children,
}: {
  initial: string;
  label?: string;
  children: React.ReactNode;
}) => {
  const [value, setValue] = React.useState(initial);
  return (
    <ChoiceChipGroup
      name={label ?? 'kategori'}
      label={label}
      value={value}
      onChange={e => setValue(e.target.value)}
    >
      {children}
    </ChoiceChipGroup>
  );
};

export const Default = () => (
  <Group initial="standard" label="Velg setekategori">
    <ChoiceChip value="standard">Standard</ChoiceChip>
    <ChoiceChip value="premium">Premium</ChoiceChip>
    <ChoiceChip value="familie">Familie</ChoiceChip>
  </Group>
);

export const Sizes = () => (
  <div style={{ display: 'grid', gap: 'var(--space-default, 1rem)' }}>
    <Group initial="voksen" label="Stor">
      <ChoiceChip size="large" value="voksen">
        Voksen
      </ChoiceChip>
      <ChoiceChip size="large" value="barn">
        Barn
      </ChoiceChip>
    </Group>
    <Group initial="voksen" label="Medium">
      <ChoiceChip size="medium" value="voksen">
        Voksen
      </ChoiceChip>
      <ChoiceChip size="medium" value="barn">
        Barn
      </ChoiceChip>
    </Group>
    <Group initial="voksen" label="Liten">
      <ChoiceChip size="small" value="voksen">
        Voksen
      </ChoiceChip>
      <ChoiceChip size="small" value="barn">
        Barn
      </ChoiceChip>
    </Group>
  </div>
);

export const DisabledOption = () => (
  <Group initial="standard" label="Velg setekategori">
    <ChoiceChip value="standard">Standard</ChoiceChip>
    <ChoiceChip value="premium">Premium</ChoiceChip>
    <ChoiceChip value="sove" disabled>
      Sove (utsolgt)
    </ChoiceChip>
  </Group>
);
