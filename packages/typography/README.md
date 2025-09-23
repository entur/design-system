# Typography

## Read before use

Entur's official font is Nationale and is created by Playtype Foundry, located in Copenhagen. The font is protected under licence and shall only be used in official Entur products. By downloading this font you confirm that you are employed by Entur and that the font only will be used in developing official Entur products. **All other uses will be regarded as a violation to the licence agreement and to Entur's brand, and legal actions may be filed.**

This package contains styles and React components for all of our typography.

> 💡 Looking for the [documentation](https://linje.entur.no/komponenter/ressurser/typography)?
> Looking for the beta [documentation](https://linje.entur.no/komponenter/ressurser/typography-beta)?

## Installation

```bash
npm install @entur/typography
# or
yarn add @entur/typography
```

## 🚀 Quick Start

### Using Beta Typography (Recommended)

```typescript
import { Heading, Text, LinkBeta } from '@entur/typography';

function MyComponent() {
  return (
    <div>
      <Heading as="h1" variant="title-1">
        My Title
      </Heading>
      <Text variant="paragraph">My content</Text>
      <LinkBeta href="/more">Learn more</LinkBeta>
    </div>
  );
}
```

### Using Legacy Typography

```typescript
import { Heading1, Paragraph, Link } from '@entur/typography';

function MyComponent() {
  return (
    <div>
      <Heading1>My Title</Heading1>
      <Paragraph>My content</Paragraph>
      <Link href="/more">Learn more</Link>
    </div>
  );
}
```

## 🔄 Migration

**Migrating from legacy typography?** We've created a comprehensive migration package to help you transition smoothly. Follow our migration guide in our website.

- 🔧 **Migration Helpers** - Drop-in replacements for legacy components
- 🤖 **Migration Script** - Automated migration tool

### Quick Migration

```bash
# Option 1: Using npx (recommended)
npx @entur/typography@latest migrate

# Option 2: With specific options
npx @entur/typography@latest migrate --dry-run


# Option 3: From installed package
npm install @entur/typography@latest
npx @entur/typography@latest migrate

# Option 4: Add to your package.json scripts
# "scripts": { "migrate-typography": "npx @entur/typography@latest migrate" }
# Then run: npm run migrate-typography -- --dry-run
```

**Note**: The migration script requires `glob` to be available. If you encounter an error, install it:

```bash
npm install glob
# or
yarn add glob
```

### Migration Mode

- **🚀 Complete Migration**: Updates imports + component usage

### Update Styles

```scss
// Replace this
@import '@entur/typography/dist/styles.css';

// With this
@import '@entur/typography/src/beta/styles.scss';
```

## 🎨 Features

### Beta Typography

- **Semantic variants** - Title, subtitle, section, paragraph, etc.
- **Size variants** - Extra large, large, medium, small, extra small
- **Weight variants** - Light, regular, medium, semibold, bold
- **Spacing options** - Configurable margins and padding
- **Accessibility** - Built-in ARIA support and semantic HTML

### Legacy Typography

- **Individual components** - Heading1-6, Paragraph, Link, etc.
- **Simple API** - Easy to use with minimal configuration
- **Backward compatibility** - Existing code continues to work

## Licenses

- Source code is licensed under European Union Public License, version 1.2 (EUPL-1.2)
- The fonts are licensed separately, and all use should follow its licence.
