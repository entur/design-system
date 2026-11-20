// The article "For leverandører" from Figma (Entur UI Library, node 20338:8419), Standard mode.
// y, height and textHeight are Figma's layout in px: each layer holds its text and the space after it.

export type FigmaLayer = {
  type:
    | 'title-1'
    | 'title-2'
    | 'subtitle-1'
    | 'subtitle-2'
    | 'leading'
    | 'paragraph';
  y: number;
  height: number;
  textHeight: number;
  /** Text in the layer: paragraphs, or a bulleted list */
  parts: Array<{ list?: boolean; lines: string[] }>;
};

export const figmaArticle = {
  url: 'https://www.figma.com/design/L7FmiKATOnjdhW2TUn0eri/Entur-UI-Library?node-id=20338-8419',
  width: 648,
  height: 3316,
  layers: [
    {
      type: 'title-1',
      y: 32,
      height: 64,
      textHeight: 44,
      parts: [{ lines: ['For leverandører'] }],
    },
    {
      type: 'leading',
      y: 96,
      height: 176,
      textHeight: 128,
      parts: [
        {
          lines: [
            'Entur har som ambisjon å gjøre anskaffelser profesjonelt, effektivt og virkningsfullt. Her kan du som leverandør få informasjon vedrørende våre rutiner for anskaffelser.',
          ],
        },
      ],
    },
    {
      type: 'title-2',
      y: 272,
      height: 56,
      textHeight: 36,
      parts: [{ lines: ['Anskaffelser i Entur'] }],
    },
    {
      type: 'subtitle-1',
      y: 328,
      height: 44,
      textHeight: 28,
      parts: [{ lines: ['Omfang'] }],
    },
    {
      type: 'paragraph',
      y: 372,
      height: 136,
      textHeight: 96,
      parts: [
        {
          lines: [
            'Entur AS gjør innkjøp for ca. 350 millioner kroner i året. Dette omfatter alt fra strategiske satsninger til rent forbruksmateriell. I 2019 var mer enn 70 % av innkjøpene Entur relatert til IT-tjenester og digitalisering.  Digitalisering er en viktig satsning for Entur, og det vil det fortsette å være de kommende årene.',
          ],
        },
      ],
    },
    {
      type: 'subtitle-1',
      y: 508,
      height: 44,
      textHeight: 28,
      parts: [{ lines: ['Vår strategi'] }],
    },
    {
      type: 'paragraph',
      y: 552,
      height: 224,
      textHeight: 184,
      parts: [
        {
          lines: [
            'Entur har som ambisjon å gjøre anskaffelser profesjonelt, effektivt og virkningsfullt. Kjernen i anskaffelsesstrategien er å:',
          ],
        },
        {
          list: true,
          lines: [
            'Bygge Enturs omdømme som en attraktiv kunde, og etablere relasjoner med leverandører som bidrar til å møte fremtidens anskaffelsesbehov.',
            'Etterstrebe at anskaffelser kan gjennomføres smidig, effektivt, og i henhold til lover og regelverket.',
            'Styrke fokus på avtaleforvaltning.',
          ],
        },
      ],
    },
    {
      type: 'subtitle-1',
      y: 776,
      height: 44,
      textHeight: 28,
      parts: [{ lines: ['Entur som kunde'] }],
    },
    {
      type: 'paragraph',
      y: 820,
      height: 296,
      textHeight: 256,
      parts: [
        {
          lines: [
            'Enturs ambisjon er å gjøre seg kjent i markedet som en innovativ og fremtidsrettet kunde. Vi bestreber oss for å gjennomføre våre innkjøpsprosesser på en ryddig og profesjonell måte, og har som mål at inngåtte avtaler skal være fordelaktige for begge parter.',
            'Entur skal ha god innsikt i relevante leverandørmarkeder og legge vekt på leverandørdialog i våre prosesser. Dette for å sikre gode, fremtidsrettede løsninger som i størst mulig grad er egnet for å optimalisere utnyttelsen av organisasjonens ressurser. Et viktig aspekt er skalerbare og fleksible avtaler som gjør Entur i stand til å være følsom overfor raske endringer i markedsdynamikken.',
          ],
        },
      ],
    },
    {
      type: 'subtitle-1',
      y: 1116,
      height: 44,
      textHeight: 28,
      parts: [{ lines: ['Regelverk'] }],
    },
    {
      type: 'paragraph',
      y: 1160,
      height: 152,
      textHeight: 112,
      parts: [
        {
          lines: [
            'Entur er underlagt regelverket om offentlige anskaffelser. Vi operer innenfor forsyningssektoren og følger derfor lov om offentlige anskaffelser og forskrift om innkjøpsregler i forsyningssektoren.',
            'Se lenke til TendSign nederst på denne siden eller kontakt innkjøpsavdelingen.',
          ],
        },
      ],
    },
    {
      type: 'subtitle-1',
      y: 1312,
      height: 44,
      textHeight: 28,
      parts: [{ lines: ['Slik gjennomfører Entur innkjøp'] }],
    },
    {
      type: 'paragraph',
      y: 1356,
      height: 560,
      textHeight: 520,
      parts: [
        {
          lines: [
            'Entur AS gjennomfører alle anskaffelsene etter virksomhetens vedtatte innkjøpsstrategi. I tillegg skal alle anskaffelser følge det gjeldende lovverket. Som et offentlig eid aksjeselskap innen forsyningssektoren, følger Entur regelverket om offentlige anskaffelser og forskrift om innkjøpsregler i forsyningssektoren. Alle anskaffelser gjennomføres i henhold til anskaffelseslovens grunnleggende prinsipper:',
          ],
        },
        {
          list: true,
          lines: [
            'Konkurranse',
            'Etterprøvbarhet',
            'Likebehandling',
            'Forutberegnelighet',
            'Forholdsmessighet',
          ],
        },
        {
          lines: [
            'Entur gjennomfører alle anskaffelser ved hjelp av konkurransegjennomførings-verktøyet TendSign. Leverandører kan logge seg inn på TendSign ved følgende lenke: https://tendsign.no/public/register_seller.aspx',
            'Det vil si at anskaffelsesdokumentene, levering av tilbud og all øvrig kommunikasjon mellom Entur og leverandører vil foregå gjennom det elektroniske verktøyet.',
            'Alle anskaffelser i Entur kommuniseres skriftlig til leverandørmarkedet. Måten det kommuniseres på, vil avhenge av anskaffelsens verdi og kompleksitet.',
          ],
        },
      ],
    },
    {
      type: 'subtitle-1',
      y: 1916,
      height: 44,
      textHeight: 28,
      parts: [{ lines: ['Slik blir du leverandør for Entur'] }],
    },
    {
      type: 'paragraph',
      y: 1960,
      height: 592,
      textHeight: 552,
      parts: [
        {
          lines: [
            'Entur AS inngår kontrakter ved hjelp av forskjellige prosedyrer. Den vedtatte innkjøpsstrategien ligger alltid til grunn for inngåelser av kontrakter.',
            'Entur er underlagt regelverket om offentlige anskaffelser. Alle anskaffelser som gjennomføres i Entur kommuniseres skriftlig til leverandørmarkedet. Måten det kommuniseres vil avhenge av anskaffelsens verdi. Målet er å sikre reell konkurranse.',
          ],
        },
        {
          list: true,
          lines: [
            'Anskaffelser med verdi over EØS – terskelverdi (4,1 millioner kroner per mai 2020) og kunngjøringsplikt publiseres på Doffin gjennom konkurransegjennomføringsverktøyet TendSign. Se lenke til TendSign nederst på siden.',
            'Anskaffelser med en verdi som er lavere enn EØS-terskelverdi har ingen kunngjøringsplikt. Entur er likevel opptatt av å sikre konkurranse også for disse anskaffelsene. Derfor vil Entur invitere potensielle leverandører direkte inn i slike anskaffelser.',
            'Entur er medlem av en innkjøpssentral (Tradebroker). Gjennom denne medlemsavtalen har Entur tilgang til en bred avtaleportefølje innenfor indirekte vare –og tjenesteområder. I Enturs innkjøpsstrategi er det bestemt at medlemskapet i Tradebroker i så stor grad som mulig skal benyttes for anskaffelser av ikke-strategisk karakter.',
          ],
        },
        {
          lines: [
            'Entur ønsker å kjenne markedet best mulig! Vi er alltid interessert i å komme i kontakt med nye leverandører. Ta kontakt eller gå inn på lenke til TendSign.',
          ],
        },
      ],
    },
    {
      type: 'subtitle-1',
      y: 2552,
      height: 44,
      textHeight: 28,
      parts: [{ lines: ['Dynamiske innkjøp'] }],
    },
    {
      type: 'paragraph',
      y: 2596,
      height: 88,
      textHeight: 48,
      parts: [
        {
          lines: [
            'For innkjøp av rådgivningstjenester innefor IT og HR har vi etablert dynamiske innkjøpsordninger.',
          ],
        },
      ],
    },
    {
      type: 'subtitle-1',
      y: 2684,
      height: 44,
      textHeight: 28,
      parts: [{ lines: ['Kontrakter, leveranse, faktura og betaling'] }],
    },
    {
      type: 'paragraph',
      y: 2728,
      height: 112,
      textHeight: 72,
      parts: [
        {
          lines: [
            'Entur AS inngår skriftlige kontrakter med alle sine leverandører før leveransen gjennomføres. Kontraktene vil regulere forholdet mellom partene så lenge avtaletiden løper.',
          ],
        },
      ],
    },
    {
      type: 'subtitle-1',
      y: 2840,
      height: 44,
      textHeight: 28,
      parts: [{ lines: ['Oppfølging av kontrakter'] }],
    },
    {
      type: 'paragraph',
      y: 2884,
      height: 112,
      textHeight: 72,
      parts: [
        {
          lines: [
            'Entur vil følge opp kontrakten gjennom hele kontraktsperioden, og vil ha løpende kontakt med leverandøren. Entur er opptatt av at både vi selv og leverandøren overholder kontraktens forpliktelser.',
          ],
        },
      ],
    },
    {
      type: 'subtitle-1',
      y: 2996,
      height: 44,
      textHeight: 28,
      parts: [{ lines: ['Fakturaer til Entur AS'] }],
    },
    {
      type: 'subtitle-2',
      y: 3040,
      height: 36,
      textHeight: 24,
      parts: [
        {
          lines: ['For de som skal sende faktura til Entur gjelder følgende:'],
        },
      ],
    },
    {
      type: 'paragraph',
      y: 3076,
      height: 208,
      textHeight: 168,
      parts: [
        {
          list: true,
          lines: [
            'Entur foretrekker elektroniske faktura i formatet EHF. Fakturaadresse er Enturs organisasjonsnummer.',
            'Faktura på epost kan sendes til faktura@entur.org. Alle dokumenter må være i PDF.',
            'Faktura per post kan sendes til Entur AS, Postboks 1554 Vika, 0117 Oslo.',
            'Alle fakturaer må være merket med kostnadsstedsnummer og referanseperson hos Entur.',
          ],
        },
      ],
    },
  ] as FigmaLayer[],
};
