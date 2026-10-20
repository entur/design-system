---
name: migrate-typography
description: Migrate a consumer project to the new Entur typography (`@entur/typography/beta`) and the layout beta spacing scale. Covers the renamed spacing values, text without default spacing and `TextContainer`, renamed and removed variants, new HTML elements, `Label`, quotes, lists, CSS overrides, and moving off the old components (Heading1–6, Paragraph …). Use when upgrading `@entur/typography` or `@entur/layout` beta, or moving from the old typography components.
disable-model-invocation: true
---

# Migrate to the new Entur typography

The new typography is `Heading`, `Text`, `Link`, `Label`, `TextContainer` and the lists from `@entur/typography/beta`. It shares the spacing scale `2xs | xs | s | m | lg | xl | 2xl …` with `Flex` and `Grid` in `@entur/layout/beta`.

> **Resolving `references/` paths:** if you are reading this over HTTP rather than from an installed skill folder, resolve every `references/<file>` path in this file against `https://raw.githubusercontent.com/entur/design-system/main/skills/migrate-typography/` — not against the folder of whichever skill linked you here.

## Steps

### 1. Inventory

Find what the project uses. Set `SRC` to the folders with source code (in a monorepo, every package), and keep the globs quoted:

```bash
SRC="src"
CODE=(--include='*.tsx' --include='*.ts' --include='*.jsx' --include='*.js' --exclude-dir=node_modules)
grep -rnE "@entur/typography/beta['\"]" "${CODE[@]}" $SRC
grep -rnE "from ['\"]@entur/typography['\"]" "${CODE[@]}" $SRC
grep -rnE "@entur/layout/beta['\"]" "${CODE[@]}" $SRC
grep -rnE "eds-(text|heading|paragraph|h[1-6]|lead-paragraph|sub-paragraph|small-text|label|sub-label|link|code-text|preformatted-text|strong-text|emphasized-text|blockquote|list-item|unordered-list|numbered-list)\b|var\(--(2xs|xs|s|s-m|m|m-l|l|[0-9]*xl)\)" --include='*.css' --include='*.scss' --include='*.less' "${CODE[@]}" $SRC
```

Report: files using the beta typography, files using the old components, files using layout beta `Flex`/`Grid` spacing, and CSS that targets typography classes or the old spacing variables. Note aliased imports (`Link as LinkText`, `ListItem as LI`), since later greps on component names miss them.

**Done when:** each of the four groups is listed with a count. Skip the steps for groups that are empty.

### 2. Upgrade packages

Upgrade `@entur/typography`, `@entur/layout` and `@entur/tokens` to the latest versions in one command, together with any other `@entur/*` package that depends on them. Import `@entur/typography/beta/styles` next to `@entur/typography/styles`, where the app imports its other styles.

**Done when:** the packages are on the latest version, the project installs and the beta styles are imported.

### 3. Rename spacing values

Load **[references/spacing.md](references/spacing.md)**, sections "Rename". Rename `spacing` on typography components, `gap`/`rowGap`/`columnGap` on `Flex` and `Grid` imported from `@entur/layout/beta`, and the spacing CSS variables. Leave `gap` on other libraries' components alone. If the project already has new values (`3xl` and up, `--spacing-*`, `spacing={{ top }}`), it is partly migrated: rename only the code that still has old values, and ask the user where you can't tell.

Some names exist both before and after but mean a different size, so rename in one pass, highest value first. Never search-and-replace one value at a time.

**Done when:** no old value is left (`xs2`, `sm`, `md`, `*-top`, `*-bottom`, `s-m`, `m-l`, `l`, `--m` …) and every `lg`/`xl` and larger has been checked against the table.

### 4. Fix the API changes

Load **[references/beta-changes.md](references/beta-changes.md)** and work through each section that applies: removed `margin`, renamed variants, `variant="link"`, `Blockquote`, new HTML elements and `Label`, `weight`, `size`, lists and CSS class names.

**Done when:** every pattern in beta-changes.md has been searched for and resolved, and the type-check passes.

### 5. Handle text without default spacing

Text components no longer have margins. Load **[references/spacing.md](references/spacing.md)**, section "No default spacing", and go through every place that relied on the old margins:

- **Running text** (articles, help pages, terms, several headings and paragraphs in a row, rich-text renderers such as Portable Text or HTML parsers): wrap it in `<TextContainer>`. The rhythm only reaches direct children, so wrap the element whose children are the text blocks.
- **Text in UI** (cards, modals, forms, tables): remove `spacing="none"`, which is now the default. Where two texts relied on the old margin (a title and a description), use `Flex` with `gap`, or `spacing` on one of them.
- **Can't tell:** leave it and list it in the report.

**Done when:** every text component without `spacing` has been classified, and the uncertain ones are listed.

### 6. Move off the old components (optional)

Only if the user wants it, or the project already mixes old and new: load **[references/legacy-components.md](references/legacy-components.md)** and replace `Heading1`–`Heading6`, `Paragraph`, `CodeText` and the rest. Step 5 applies to the replaced components too, since the old ones had margins.

**Done when:** no imports of the old components remain from `@entur/typography`, or the user chose to keep them.

### 7. Check CSS overrides

For each override from step 1, check it against "CSS class names" in [references/beta-changes.md](references/beta-changes.md), and against the old class names in [references/legacy-components.md](references/legacy-components.md) if step 6 was done. Selectors for old classes stop matching without any error.

- **Margin resets** (`margin: 0`), line-height fixes on `ListItem`, custom code text: remove.
- **Margins that add space** (`margin-top: 3rem` on a heading): move to `spacing` on the component, or to `gap` on its layout.
- **Inline `style`** with `margin`: move to `spacing`. With `fontWeight`: move to `weight` on `Text`. Headings are already bold, so remove `fontWeight: 600` on `Heading` and ask the user about `500`, which is not a heading style. Remove it on `Link` and `Label`, which follow their own style.
- **Colours and the rest:** rename the selector.

**Done when:** every override has been kept, renamed or removed, with a reason.

### 8. Verify

```bash
npx tsc --noEmit
npm run build
npm test
grep -rnE "variant=['\"](code-text|preformatted-text|link)['\"]|spacing=['\"](xs2|sm|md|[a-z0-9]+-(top|bottom))['\"]" "${CODE[@]}" $SRC
# No margin or external on the new components. Skip matches on old components from @entur/typography, which still take them
grep -rnE "<(Heading|Text|Link)\b[^>]*margin=|<Link\b[^>]*\bexternal\b" "${CODE[@]}" $SRC
```

Then look at the pages with the most text and the most UI text in the browser, in each `data-view-mode` the project uses.

**Done when:** build, type-check and tests pass, the grep finds nothing, and the user has seen the key pages.

### 9. Report

Tell the user:

- what was changed, step by step, and what was left for them (step 5's uncertain cases, overrides kept);
- the visual changes that need no code: new list markers, new code text, headings with balanced line breaks, `size` now always overriding `variant`;
- new options worth knowing: `TextContainer`, `Label`, `trim`, `NumberedList variant="steps"`.

**Done when:** the user has the list.
