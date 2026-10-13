import React from 'react';
import { ExpandableTextButton, BaseExpand, Paragraph } from '@entur/linje';

export const Closed = () => (
  <ExpandableTextButton open={false} onToggle={() => undefined}>
    Vis alle stoppesteder
  </ExpandableTextButton>
);

export const Open = () => (
  <ExpandableTextButton open onToggle={() => undefined}>
    Skjul stoppesteder
  </ExpandableTextButton>
);

export const WithContent = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ width: 400, maxWidth: '100%' }}>
      <ExpandableTextButton open={open} onToggle={() => setOpen(!open)}>
        Stoppesteder på linje 31
      </ExpandableTextButton>
      <BaseExpand open={open}>
        <Paragraph margin="none">
          Tonsenhagen – Carl Berners plass – Jernbanetorget – Nationaltheatret –
          Snarøya
        </Paragraph>
      </BaseExpand>
    </div>
  );
};
