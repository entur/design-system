import React from 'react';
import { TravelSwitch } from '@entur/linje';

const Controlled = (
  props: Omit<
    React.ComponentProps<typeof TravelSwitch>,
    'checked' | 'onChange'
  > & { defaultChecked?: boolean },
) => {
  const { defaultChecked = true, ...rest } = props;
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <TravelSwitch
      {...rest}
      checked={checked}
      onChange={e => setChecked(e.target.checked)}
    />
  );
};

export const Default = () => <Controlled transport="bus">Buss</Controlled>;

export const Transports = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-small)',
    }}
  >
    <Controlled transport="bus">Buss</Controlled>
    <Controlled transport="tram">Trikk</Controlled>
    <Controlled transport="metro">T-bane</Controlled>
    <Controlled transport="rail">Tog</Controlled>
    <Controlled transport="ferry" defaultChecked={false}>
      Båt
    </Controlled>
    <Controlled transport="plane" defaultChecked={false}>
      Fly
    </Controlled>
  </div>
);

export const LabelBottom = () => (
  <div style={{ display: 'flex', gap: 'var(--space-large)' }}>
    <Controlled transport="bus" labelPlacement="bottom">
      Buss
    </Controlled>
    <Controlled transport="tram" labelPlacement="bottom">
      Trikk
    </Controlled>
    <Controlled transport="rail" labelPlacement="bottom">
      Tog
    </Controlled>
    <Controlled
      transport="ferry"
      labelPlacement="bottom"
      defaultChecked={false}
    >
      Båt
    </Controlled>
  </div>
);

export const Sizes = () => (
  <div
    style={{ display: 'flex', gap: 'var(--space-large)', alignItems: 'center' }}
  >
    <Controlled transport="metro" size="medium">
      Medium
    </Controlled>
    <Controlled transport="metro" size="large">
      Stor
    </Controlled>
  </div>
);
