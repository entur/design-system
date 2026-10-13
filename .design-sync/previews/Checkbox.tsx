import React from 'react';
import { Checkbox, Fieldset } from '@entur/linje';

const Controlled = ({
  initial,
  children,
  ...props
}: {
  initial: boolean | 'indeterminate';
  children: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
}) => {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(
    initial,
  );
  return (
    <Checkbox
      checked={checked}
      onChange={e => setChecked(e.target.checked)}
      {...props}
    >
      {children}
    </Checkbox>
  );
};

export const Default = () => (
  <Controlled initial={true}>
    Jeg godtar vilkårene for kjøp av billett
  </Controlled>
);

export const CheckedStates = () => (
  <div style={{ display: 'grid', gap: 'var(--space-small, 0.5rem)' }}>
    <Controlled initial={false}>Ikke valgt</Controlled>
    <Controlled initial={true}>Valgt</Controlled>
    <Controlled initial="indeterminate">Delvis valgt</Controlled>
  </div>
);

export const InFieldset = () => (
  <Fieldset label="Hvilke transportmidler vil du reise med?">
    <Controlled initial="indeterminate">Alle</Controlled>
    <Controlled initial={true}>Buss</Controlled>
    <Controlled initial={true}>Tog</Controlled>
    <Controlled initial={false}>Båt</Controlled>
    <Controlled initial={false}>Trikk</Controlled>
  </Fieldset>
);

export const DisabledAndReadOnly = () => (
  <div style={{ display: 'grid', gap: 'var(--space-small, 0.5rem)' }}>
    <Controlled initial={false} disabled>
      Setereservasjon (utsolgt)
    </Controlled>
    <Controlled initial={true} disabled>
      Hund (ikke tilgjengelig)
    </Controlled>
    <Controlled initial={true} readOnly>
      Sykkel (inkludert i billetten)
    </Controlled>
  </div>
);
