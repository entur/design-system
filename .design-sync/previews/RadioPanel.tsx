import React from 'react';
import { RadioPanel, RadioGroup } from '@entur/linje';

const Group = ({
  initial,
  label,
  children,
  ...props
}: {
  initial: string;
  label: string;
  children: React.ReactNode;
  readOnly?: boolean;
}) => {
  const [value, setValue] = React.useState(initial);
  return (
    <div style={{ width: 320 }}>
      <RadioGroup
        name={label}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)}
        {...props}
      >
        <div style={{ display: 'grid', gap: 'var(--space-small, 0.5rem)' }}>
          {children}
        </div>
      </RadioGroup>
    </div>
  );
};

export const Default = () => (
  <Group initial="standard" label="Velg billettype">
    <RadioPanel title="Standard" secondaryLabel="199,-" value="standard">
      Ikke fleksibel
    </RadioPanel>
    <RadioPanel title="Flex" secondaryLabel="299,-" value="flex">
      Kan endres og refunderes
    </RadioPanel>
  </Group>
);

export const Large = () => (
  <Group initial="komfort" label="Velg komfort">
    <RadioPanel
      title="Standard"
      secondaryLabel="449,-"
      value="standard"
      size="large"
    >
      Sete i vanlig vogn
    </RadioPanel>
    <RadioPanel
      title="Komfort"
      secondaryLabel="599,-"
      value="komfort"
      size="large"
    >
      Kaffe, te og strøm ved setet
    </RadioPanel>
  </Group>
);

export const HiddenRadio = () => (
  <Group initial="0730" label="Velg avgang">
    <RadioPanel
      title="07:30 – 11:52"
      secondaryLabel="4 t 22 min"
      value="0730"
      hideRadioButton
    />
    <RadioPanel
      title="09:25 – 13:49"
      secondaryLabel="4 t 24 min"
      value="0925"
      hideRadioButton
    />
  </Group>
);

export const DisabledOption = () => (
  <Group initial="standard" label="Velg plass">
    <RadioPanel title="Standard" secondaryLabel="199,-" value="standard" />
    <RadioPanel
      title="Sovekupé"
      secondaryLabel="Utsolgt"
      value="sove"
      disabled
    />
  </Group>
);
