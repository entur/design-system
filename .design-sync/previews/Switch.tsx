import React from 'react';
import { Switch } from '@entur/linje';

const Controlled = ({
  initial,
  children,
  ...props
}: { initial: boolean; children?: React.ReactNode } & Record<string, any>) => {
  const [checked, setChecked] = React.useState(initial);
  return (
    <Switch checked={checked} onChange={() => setChecked(c => !c)} {...props}>
      {children}
    </Switch>
  );
};

export const Default = () => (
  <Controlled initial={true}>Varsle meg om forsinkelser</Controlled>
);

export const States = () => (
  <div style={{ display: 'grid', gap: 'var(--space-small, 0.5rem)' }}>
    <Controlled initial={false}>Vis kun direkte reiser</Controlled>
    <Controlled initial={true}>Vis sanntid</Controlled>
    <Controlled initial={true} hideIcon>
      Uten ikon
    </Controlled>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'grid', gap: 'var(--space-default, 1rem)' }}>
    <Controlled initial={true}>Medium</Controlled>
    <Controlled initial={true} size="large">
      Stor
    </Controlled>
  </div>
);

export const LabelBottom = () => (
  <div style={{ display: 'flex', gap: 'var(--space-large, 1.5rem)' }}>
    <Controlled initial={true} labelPlacement="bottom">
      Buss
    </Controlled>
    <Controlled initial={false} labelPlacement="bottom">
      Tog
    </Controlled>
  </div>
);
