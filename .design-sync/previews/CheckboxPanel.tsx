import React from 'react';
import { CheckboxPanel, Fieldset, Label } from '@entur/linje';

const Panel = ({
  initial,
  ...props
}: { initial: boolean } & React.ComponentProps<typeof CheckboxPanel>) => {
  const [checked, setChecked] = React.useState(initial);
  return (
    <CheckboxPanel
      checked={checked}
      onChange={() => setChecked(c => !c)}
      {...(props as any)}
    />
  );
};

export const Default = () => (
  <div style={{ width: 320 }}>
    <Fieldset label="Velg tilleggsprodukter">
      <div style={{ display: 'grid', gap: 'var(--space-small, 0.5rem)' }}>
        <Panel
          initial={true}
          title="Setereservasjon"
          value="sete"
          secondaryLabel="50,-"
        />
        <Panel
          initial={false}
          title="Hund"
          value="hund"
          secondaryLabel="99,-"
        />
        <Panel
          initial={false}
          title="Sykkel"
          value="sykkel"
          secondaryLabel="149,-"
        >
          <Label as="span">Plass til sykkelen kan ikke garanteres</Label>
        </Panel>
      </div>
    </Fieldset>
  </div>
);

export const Large = () => (
  <div style={{ width: 320 }}>
    <Panel
      initial={true}
      title="Flex"
      value="flex"
      secondaryLabel="499,-"
      size="large"
    >
      Fleksibel billett som kan endres og refunderes
    </Panel>
  </div>
);

export const HiddenCheckbox = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-small, 0.5rem)', width: 320 }}
  >
    <Panel initial={true} title="Måltid om bord" value="mat" hideCheckbox />
    <Panel
      initial={false}
      title="Ekstra benplass"
      value="benplass"
      hideCheckbox
    />
  </div>
);

export const DisabledAndReadOnly = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-small, 0.5rem)', width: 320 }}
  >
    <Panel
      initial={false}
      title="Sovekupé"
      value="sove"
      secondaryLabel="Utsolgt"
      disabled
    />
    <Panel
      initial={true}
      title="Setereservasjon"
      value="sete-ro"
      secondaryLabel="Inkludert"
      readOnly
    />
  </div>
);
