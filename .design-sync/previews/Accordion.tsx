import { Accordion, AccordionItem, Paragraph } from '@entur/linje';

const Items = () => (
  <>
    <AccordionItem id="refusjon" title="Kan jeg få refusjon på billetten?">
      <Paragraph margin="none">
        Enkeltbilletter kan refunderes frem til avgang. Periodebilletter
        refunderes for gjenstående dager.
      </Paragraph>
    </AccordionItem>
    <AccordionItem id="bagasje" title="Hvor mye bagasje kan jeg ta med?">
      <Paragraph margin="none">
        Du kan ta med inntil tre kolli, i tillegg til håndbagasje. Sykkel krever
        egen billett.
      </Paragraph>
    </AccordionItem>
    <AccordionItem id="dyr" title="Kan jeg ta med hund på toget?">
      <Paragraph margin="none">
        Hunder er velkomne i egne dyrevogner. Små dyr i bur reiser gratis.
      </Paragraph>
    </AccordionItem>
  </>
);

export const Closed = () => (
  <div style={{ width: 480, maxWidth: '100%' }}>
    <Accordion>
      <Items />
    </Accordion>
  </div>
);

export const Open = () => (
  <div style={{ width: 480, maxWidth: '100%' }}>
    <Accordion defaultOpenId="bagasje">
      <Items />
    </Accordion>
  </div>
);
