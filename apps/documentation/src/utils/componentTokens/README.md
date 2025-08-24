# Component Tokens Auto-Generation

This system automatically extracts component color tokens from all packages' `componentColors.scss` files at build time and makes them available for the `ComponentTokensTable` component.

## Why This Approach?

✅ **Monorepo-friendly**: No duplication of existing SCSS files  
✅ **Lightweight**: Generates a manageable tokens file (~420KB vs ~12MB+ for full SCSS)  
✅ **Build-time**: No runtime Node.js module dependencies  
✅ **Efficient**: Categorized and ready-to-use tokens  
✅ **Maintainable**: No manual token synchronization needed

## How It Works

1. **Build Script**: `buildTokens.ts` scans all packages for `componentColors.scss` files
2. **Token Extraction**: Parses SCSS files to extract CSS variables and their values
3. **Auto-Generation**: Creates `generatedTokens.ts` with all extracted tokens
4. **Integration**: `ComponentTokensTable` automatically uses the generated tokens

## Files

- `buildTokens.ts` - Main build script that extracts tokens
- `types.ts` - TypeScript interfaces for tokens
- `generatedTokens.ts` - Auto-generated file (do not edit manually)
- `componentTokens.ts` - Main export file that imports from generated tokens

## Usage

### For Developers

The tokens are automatically generated during the build process. No manual intervention is needed.

```typescript
import {
  getComponentTokens,
  getTokensByCategory,
} from '@utils/componentTokens';

// Get all tokens for a component
const buttonTokens = getComponentTokens('button');

// Get tokens by category
const colorTokens = getTokensByCategory('button', 'color');
```

### For Adding New Token Types

To support new token types (like spacing, typography, etc.), update the `getTokenCategory` function in `buildTokens.ts`:

```typescript
function getTokenCategory(variable: string): ExtractedToken['category'] {
  if (
    variable.includes('color') ||
    variable.includes('fill') ||
    variable.includes('stroke') ||
    variable.includes('text') ||
    variable.includes('shape')
  ) {
    return 'color';
  }
  if (
    variable.includes('spacing') ||
    variable.includes('padding') ||
    variable.includes('margin') ||
    variable.includes('gap')
  ) {
    return 'spacing';
  }
  if (
    variable.includes('font') ||
    variable.includes('line-height') ||
    variable.includes('letter-spacing')
  ) {
    return 'typography';
  }
  return 'other';
}
```

### For Adding New Components

Simply add a `componentColors.scss` file to your package's `src/` directory. The build script will automatically detect and process it.

## Build Process

The token generation is integrated into the main build process:

1. **Documentation Build**: `yarn build` → `yarn generate-tokens` → `gatsby build`
2. **Manual Generation**: `yarn generate-tokens` (for development/testing)
3. **Root Build**: `yarn build:all` → includes token generation

## Generated Files

### generatedTokens.ts (Lightweight Tokens)

```typescript
const buttonTokens: ComponentToken[] = [
  {
    variable: '--components-button-primary-fill',
    value: '#{$fill-primary}',
    description: 'Button Primary Fill token',
    category: 'color' as const,
  },
  // ... more tokens
];
```

**Size**: ~420KB (much smaller than full SCSS files)  
**Content**: Extracted tokens with categories and descriptions  
**Purpose**: Ready-to-use tokens for ComponentTokensTable

## Token Structure

Each token contains:

```typescript
interface ComponentToken {
  variable: string; // CSS variable name (e.g., --components-button-primary-fill)
  value: string; // SCSS token value (e.g., #{fill-primary})
  description: string; // Auto-generated description
  category: 'color' | 'spacing' | 'typography' | 'other';
  component: string; // Package name (e.g., 'button')
}
```

## Categories

- **color**: fill, stroke, text, shape variables
- **spacing**: padding, margin, gap variables
- **typography**: font, line-height, letter-spacing variables
- **other**: border-radius, shadows, etc.

## Performance Features

- **Build-time Generation**: No runtime parsing overhead
- **Categorized Tokens**: Ready for immediate use
- **Lightweight Output**: Much smaller than full SCSS files
- **Automatic Updates**: Always reflects latest componentColors.scss content

## Current Results

- **16 components** processed automatically
- **2028 tokens** extracted and categorized
- **4 token categories**: color, spacing, typography, other
- **Generated file size**: ~420KB (vs ~12MB+ for full SCSS)

## Troubleshooting

### Tokens Not Appearing

1. Ensure your package has a `componentColors.scss` file in the `src/` directory
2. Check that the file follows the expected format: `--components-name: #{$token};`
3. Run `yarn generate-tokens` manually to see any errors
4. Verify the component name matches the package name

### Build Errors

1. Check that all dependencies are installed: `yarn install`
2. Verify the glob pattern in `buildTokens.ts` matches your file structure
3. Ensure the regex pattern correctly matches your SCSS variable format

### Token Generation Issues

1. Check that the build script has access to all package directories
2. Verify file permissions for reading SCSS files
3. Ensure the regex pattern correctly extracts variable names and values

## Future Enhancements

- Support for other token types (shadows, animations, etc.)
- Better categorization based on semantic meaning
- Integration with design token systems
- Support for component variants and states
- Webpack/Vite plugin for build-time optimization
- Incremental token generation for faster builds
