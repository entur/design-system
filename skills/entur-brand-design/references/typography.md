# Entur Typography

Full docs: https://linje.entur.no/identitet/verktoykassen/typografi

## Primary typeface: Nationale

Nationale is Entur's brand typeface — a modern, geometric sans-serif with excellent legibility at all sizes. It works for both headings and body text.

**License**: Nationale is a licensed font.

- **Entur employees**: contact Markedsføring to get access to the font.
- **External collaborators**: purchase your own license at [playtype.com](https://playtype.com/index.php?q=font/nationale).

### In digital products

Use only **two weights** in digital interfaces:

- **Medium (500)** — body text, ingress, UI text
- **Demibold (600)** — headings, emphasis

Restraint in weight usage creates a cleaner hierarchy. Avoid mixing more than two weights in a single view unless using typography as a graphic element.

---

## Fallback font: Arial

Arial is the **support font** for all contexts where Nationale is not available (e.g. Office documents, emails, external communications). Most people should use Arial unless they have a Nationale license.

---

## Typography in development

Use `@entur/typography` React components. They apply the correct font, weight, and size based on semantic role.

```tsx
import { Heading1, Heading2, Paragraph, LeadParagraph, Label, SmallText, Link } from '@entur/typography';

<Heading1>Finn din neste reise</Heading1>
<LeadParagraph>Søk blant tusenvis av avganger over hele landet.</LeadParagraph>
<Paragraph>Reiseplanleggeren hjelper deg å finne beste rute.</Paragraph>
<Label>Avreisestad</Label>
<SmallText>* Avgangstider kan avvike fra planen</SmallText>
```

Components: `Heading1`–`Heading6`, `Paragraph`, `LeadParagraph`, `SmallText`, `Label`, `SubLabel`, `Link`, `StrongText`, `EmphasizedText`, `Blockquote`, `ListItem`, `UnorderedList`, `NumberedList`, `CodeText`, `PreformattedText`, `SubParagraph`

Full component docs: https://linje.entur.no/komponenter/ressurser/typography

---

## Typography as a graphic element

In brand contexts (print, presentations, hero sections), Nationale is also used as a pure graphic element. Large, bold type creates visual contrast and energy. This is distinct from UI typography and is appropriate only when using a licensed copy of Nationale and in marketing/identity contexts.

---

## Hierarchy guidelines

Good typographic hierarchy makes content scannable:

1. One dominant heading per section
2. Lead paragraph introduces the section if needed
3. Body text is the default — avoid unnecessary size variation
4. Labels and small text for metadata, captions, form labels
5. Use `StrongText` and `EmphasizedText` sparingly for inline emphasis

Don't create hierarchy through color alone — combine size, weight, and spacing.

---

## Font loading in apps

The `@entur/styles` package includes the base font import. Ensure it's loaded globally before any component styles:

```ts
import '@entur/styles';
// or
import '@entur/styles/dist/styles.css';
```
