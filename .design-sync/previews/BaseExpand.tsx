import React from 'react';
import { BaseExpand, ExpandableTextButton, Paragraph } from '@entur/linje';

const box: React.CSSProperties = {
  width: 400,
  maxWidth: '100%',
  border: 'var(--border-widths-small) solid var(--colors-greys-grey)',
  borderRadius: 'var(--border-radiuses-medium)',
  padding: 'var(--space-default)',
};

export const Open = () => (
  <div style={box}>
    <Paragraph margin="bottom">Oslo S → Trondheim S, 07:02</Paragraph>
    <BaseExpand open>
      <Paragraph margin="none">
        Stopper på Lillehammer, Otta, Dombås, Oppdal og Støren. Kafévogn i vogn
        5.
      </Paragraph>
    </BaseExpand>
  </div>
);

export const Closed = () => (
  <div style={box}>
    <Paragraph margin="none">Oslo S → Trondheim S, 07:02</Paragraph>
    <BaseExpand open={false}>
      <Paragraph margin="none">
        Stopper på Lillehammer, Otta, Dombås, Oppdal og Støren. Kafévogn i vogn
        5.
      </Paragraph>
    </BaseExpand>
  </div>
);

export const WithTrigger = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ width: 400, maxWidth: '100%' }}>
      <ExpandableTextButton open={open} onToggle={() => setOpen(!open)}>
        Reisedetaljer
      </ExpandableTextButton>
      <BaseExpand open={open}>
        <Paragraph margin="none">
          Bytte på Lillestrøm, 8 minutter. Neste tog går fra spor 2.
        </Paragraph>
      </BaseExpand>
    </div>
  );
};
