import React from 'react';
import { Accordion, AccordionItem, Paragraph } from '@entur/linje';

export const Closed = () => (
  <div style={{ width: 480, maxWidth: '100%' }}>
    <Accordion>
      <AccordionItem title="Hva er en periodebillett?">
        <Paragraph margin="none">
          En periodebillett gir fri reise i valgte soner i 7, 30 eller 180
          dager.
        </Paragraph>
      </AccordionItem>
    </Accordion>
  </div>
);

export const Open = () => (
  <div style={{ width: 480, maxWidth: '100%' }}>
    <Accordion>
      <AccordionItem title="Hva er en periodebillett?" defaultOpen>
        <Paragraph margin="none">
          En periodebillett gir fri reise i valgte soner i 7, 30 eller 180
          dager.
        </Paragraph>
      </AccordionItem>
      <AccordionItem title="Hvordan fornyer jeg billetten?">
        <Paragraph margin="none">
          Du kan fornye billetten i appen inntil 14 dager før den utløper.
        </Paragraph>
      </AccordionItem>
    </Accordion>
  </div>
);
