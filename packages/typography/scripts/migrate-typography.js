#!/usr/bin/env node

/**
 * Typography Migration Script
 *
 * This script helps you migrate from old typography components to new beta typography.
 *
 * MIGRATION MODES:
 *
 * 🚀 Complete Mode (default):
 *   - Updates import paths AND component usage
 *   - Replaces old components with beta components
 *   - CONSEQUENCES:
 *     * <Heading1> becomes <Heading as="h1" variant="title-1">
 *     * <Paragraph> becomes <Text variant="paragraph">
 *     * <Link> becomes <LinkBeta>
 *     * <Blockquote> becomes <BlockquoteBeta>
 *     * <BlockquoteFooter> becomes <BlockquoteFooterBeta>
 *     * <UnorderedList> becomes <UnorderedListBeta>
 *     * <NumberedList> becomes <NumberedListBeta>
 *     * <ListItem> becomes <ListItemBeta>
 *     * Props may need updates (e.g., different prop names)
 *     * Styling classes may change
 *     * Test thoroughly after migration!
 *

 *
 * Usage:
 * 1. Run this script in your project root
 * 2. Choose your migration mode (complete)
 * 3. Update your styles as needed
 * 4. Test your application thoroughly
 *
 * Options:
 *   --dry-run        Show what would be changed without modifying files
 *
 * Environment Variables:
 *   TYPOGRAPHY_MIGRATION_DIRS  Comma-separated list of directories to scan
 *                              Example: "src/**,app/**"
 *
 * Security Features:
 *   - Only scans allowed directories (src/**, app/**, etc.)
 *   - Never scans node_modules, dist, build, .git, etc.
 *   - Dry-run mode for safe testing
 *   - Path validation prevents directory traversal attacks
 *
 */

const fs = require('fs');
const path = require('path');

// Check if glob is available
let glob;
try {
  glob = require('glob');
} catch (error) {
  console.error(
    '❌ Error: The "glob" package is required to run this migration script.',
  );
  console.error('');
  console.error('Please install it:');
  console.error('  npm install glob');
  console.error('  yarn add glob');
  console.error('');
  console.error('Or use npx which will handle dependencies automatically:');
  console.error('  npx @entur/typography@latest migrate');
  console.error('');
  process.exit(1);
}

// Configuration
const OLD_IMPORT = '@entur/typography';
const BETA_IMPORT = '@entur/typography';

// Enhanced warning detection patterns - only truly problematic patterns
const PROBLEMATIC_PATTERNS = {
  // Style conflicts that will cause issues
  styleMarginConflict: /style=.*margin=/g,
  styleSpacingConflict: /style=.*spacing=/g,

  // Invalid HTML structure
  nestedTypography: /<Text[^>]*>.*<Text[^>]*>/g,

  // Accessibility issues
  missingAsProps: /<Heading[^>]*>(?!.*\bas=)/g,

  // Semantic HTML mismatches
  semanticMismatch: /<Heading[^>]*as="([^"]*)"[^>]*variant="([^"]*)"/g,
};

// Warning severity levels
const WARNING_CATEGORIES = {
  CRITICAL: 'critical', // Will break functionality
  HIGH: 'high', // Likely to cause issues
  MEDIUM: 'medium', // May cause styling issues
  LOW: 'low', // Best practice suggestions
  INFO: 'info', // Informational only
};

// =============================================================================
// 🎯 MIGRATION FOLDERS CONFIGURATION
// =============================================================================
//
// EDIT THIS SECTION TO CONTROL WHICH FOLDERS ARE SCANNED
//
// ADD FOLDERS:    Add new patterns to scan additional directories
// REMOVE FOLDERS: Delete patterns you don't want to scan
// CLEAR ALL:      Remove all patterns to scan only what you add
//
// Examples:
//   'src/**'              - Scan src folder and all subdirectories
//   'app/**'              - Scan app folder and all subdirectories
//   'packages/my-app/**'  - Scan specific package
//   'frontend/**'         - Scan frontend directory
//   'shared/**'           - Scan shared components
//   'components/**'       - Scan components folder
//
// =============================================================================

const MIGRATION_FOLDERS = [
  // 👇 ADD YOUR FOLDERS HERE 👇
  'src/**',
  'app/**',
  'apps/**',
  'components/**',
  'pages/**',
  'lib/**',
  'utils/**',
  'styles/**',
  'css/**',
  'scss/**',
  // 👆 ADD YOUR FOLDERS ABOVE 👆
];

// =============================================================================

// Validate and sanitize directory input for security
function validateDirectoryPath(dir) {
  return !path.isAbsolute(dir) && !dir.includes('..') && !dir.includes('~');
}

// Enhanced file analysis for better warning detection - only truly problematic patterns
function analyzeFile(filePath, content) {
  const analysis = {
    hasStyleConflicts: false,
    hasNestedTypography: false,
    hasAccessibilityIssues: false,
    hasSemanticMismatches: false,
    lineNumbers: {},
    suggestions: [],
    warnings: [],
  };

  // Line-by-line analysis for better context
  content.split('\n').forEach((line, index) => {
    const lineNum = index + 1;

    // Check for style conflicts (style + margin/spacing)
    if (
      line.match(PROBLEMATIC_PATTERNS.styleMarginConflict) ||
      line.match(PROBLEMATIC_PATTERNS.styleSpacingConflict)
    ) {
      analysis.hasStyleConflicts = true;
      analysis.lineNumbers.styleConflicts = (
        analysis.lineNumbers.styleConflicts || []
      ).concat(lineNum);

      // Generate warning message
      analysis.warnings.push(
        `Line ${lineNum}: Style conflicts detected - component has both style and margin/spacing props`,
      );
    }

    // Check for nested typography components (invalid HTML)
    if (line.match(PROBLEMATIC_PATTERNS.nestedTypography)) {
      analysis.hasNestedTypography = true;
      analysis.lineNumbers.nestedTypography = (
        analysis.lineNumbers.nestedTypography || []
      ).concat(lineNum);

      // Generate warning message
      analysis.warnings.push(
        `Line ${lineNum}: Nested typography components detected - invalid HTML structure`,
      );
    }

    // Check for missing as props (accessibility issue)
    if (line.match(PROBLEMATIC_PATTERNS.missingAsProps)) {
      analysis.hasAccessibilityIssues = true;
      analysis.lineNumbers.missingAsProps = (
        analysis.lineNumbers.missingAsProps || []
      ).concat(lineNum);

      // Generate warning message
      analysis.warnings.push(
        `Line ${lineNum}: Missing 'as' prop - accessibility issue for Heading component`,
      );
    }

    // Check for semantic mismatches (e.g., h1 with subtitle variant)
    if (line.match(PROBLEMATIC_PATTERNS.semanticMismatch)) {
      analysis.hasSemanticMismatches = true;
      analysis.lineNumbers.semanticMismatches = (
        analysis.lineNumbers.semanticMismatches || []
      ).concat(lineNum);

      // Generate warning message
      analysis.warnings.push(
        `Line ${lineNum}: Semantic mismatch detected - heading level and variant combination may be incorrect`,
      );
    }
  });

  return analysis;
}

// Generate enhanced warnings with context and solutions
function generateWarningWithSolution(warning, context, filePath, lineNumber) {
  const severity = determineSeverity(warning);
  const suggestion = generateSuggestion(warning, context);
  const codeExample = generateCodeExample(warning);

  return {
    message: warning,
    severity,
    suggestion,
    codeExample,
    file: filePath,
    line: lineNumber,
    documentation: getRelevantDocs(warning),
  };
}

// Determine warning severity based on content
function determineSeverity(warning) {
  if (warning.includes('will break') || warning.includes('fatal'))
    return WARNING_CATEGORIES.CRITICAL;
  if (warning.includes('conflict') || warning.includes('override'))
    return WARNING_CATEGORIES.HIGH;
  if (warning.includes('may cause') || warning.includes('styling'))
    return WARNING_CATEGORIES.MEDIUM;
  if (warning.includes('best practice') || warning.includes('consider'))
    return WARNING_CATEGORIES.LOW;
  return WARNING_CATEGORIES.INFO;
}

// Generate actionable suggestions
function generateSuggestion(warning, context) {
  if (warning.includes('style and margin')) {
    return 'Remove the margin prop as it will be overridden by inline styles. Use spacing prop instead.';
  }
  if (warning.includes('missing variant')) {
    return 'Add a variant prop to ensure consistent styling. Example: variant="title-1"';
  }
  if (warning.includes('nested typography')) {
    return 'Avoid nesting Text components. Use spans or other inline elements for emphasis.';
  }
  if (warning.includes('deprecated margin')) {
    return 'Replace margin prop with spacing prop for better consistency.';
  }
  return 'Review the component for potential styling conflicts.';
}

// Generate code examples for fixes
function generateCodeExample(warning) {
  if (warning.includes('style and margin')) {
    return '// Before: <Text style={{color: "red"}} margin="bottom">\n// After:  <Text style={{color: "red"}} spacing="bottom">';
  }
  if (warning.includes('missing variant')) {
    return '// Before: <Heading as="h1">Title</Heading>\n// After:  <Heading as="h1" variant="title-1">Title</Heading>';
  }
  if (warning.includes('nested typography')) {
    return '// Before: <Text>Hello <Text>World</Text></Text>\n// After:  <Text>Hello <span>World</span></Text>';
  }
  return '';
}

// Get relevant documentation links
function getRelevantDocs(warning) {
  if (warning.includes('variant'))
    return 'https://linje.entur.no/komponenter/ressurser/typography-beta#heading-variants';
  if (warning.includes('spacing'))
    return 'https://linje.entur.no/komponenter/ressurser/typography-beta#spacing';
  if (warning.includes('semantic'))
    return 'https://linje.entur.no/komponenter/ressurser/typography-beta#semantic-html';
  return 'https://linje.entur.no/komponenter/ressurser/typography-beta';
}

let ALLOWED_DIRECTORIES = process.env.TYPOGRAPHY_MIGRATION_DIRS
  ? process.env.TYPOGRAPHY_MIGRATION_DIRS.split(',')
  : MIGRATION_FOLDERS;

// Filter out potentially dangerous paths
ALLOWED_DIRECTORIES = ALLOWED_DIRECTORIES.filter(validateDirectoryPath);

if (ALLOWED_DIRECTORIES.length === 0) {
  console.error(
    '❌ Error: No valid migration directories found after security validation.',
  );
  console.error(
    'All directory paths must be relative and not contain ".." or "~".',
  );
  console.error('');
  console.error('Valid examples:');
  console.error('  src/**');
  console.error('  app/**');
  console.error('  components/**');
  console.error('');
  console.error('Invalid examples:');
  console.error('  /absolute/path');
  console.error('  ../parent/directory');
  console.error('  ~/home/directory');
  process.exit(1);
}

// Security: Block-list of directories to never scan
const BLOCKED_DIRECTORIES = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.git/**',
  '**/coverage/**',
  '**/.next/**',
  '**/.nuxt/**',
  '**/public/**',
  '**/static/**',
  '**/assets/**',
  '**/images/**',
  '**/fonts/**',
  '**/vendor/**',
  '**/temp/**',
  '**/tmp/**',
];

// Component mapping for complete migration
const COMPONENT_MAPPING = {
  Heading1: { component: 'Heading', as: 'h1', variant: 'title-1' },
  Heading2: { component: 'Heading', as: 'h2', variant: 'title-2' },
  Heading3: { component: 'Heading', as: 'h3', variant: 'subtitle-1' },
  Heading4: { component: 'Heading', as: 'h4', variant: 'subtitle-2' },
  Heading5: { component: 'Heading', as: 'h5', variant: 'section-1' },
  Heading6: { component: 'Heading', as: 'h6', variant: 'section-2' },
  Paragraph: { component: 'Text', variant: 'paragraph' },
  LeadParagraph: { component: 'Text', variant: 'leading' },
  SmallText: { component: 'Text', variant: 'subparagraph' },
  StrongText: { component: 'Text', as: 'strong', weight: 'bold' },
  SubLabel: { component: 'Text', variant: 'sublabel' },
  SubParagraph: { component: 'Text', variant: 'subparagraph' },
  Label: { component: 'Text', variant: 'label' },
  EmphasizedText: { component: 'Text', variant: 'emphasized' },
  CodeText: { component: 'Text', variant: 'code-text' },
  Link: { component: 'LinkBeta' }, // Convert Link to LinkBeta
  Blockquote: { component: 'BlockquoteBeta' }, // Convert Blockquote to BlockquoteBeta
  BlockquoteFooter: { component: 'BlockquoteFooterBeta' }, // Convert BlockquoteFooter to BlockquoteFooterBeta
  UnorderedList: { component: 'UnorderedListBeta' },
  NumberedList: { component: 'NumberedListBeta' },
  ListItem: { component: 'ListItemBeta' },
};

// Props mapping for migration
const PROPS_MAPPING = {
  margin: 'spacing',
};

// Spacing value mapping from old margin to new spacing
// Based on the actual CSS classes in src/beta/styles.scss
// and the old margin prop values: "top" | "bottom" | "both" | "none"
const SPACING_MAPPING = {
  // Old margin values mapped to new spacing values
  none: 'none', // No spacing
  top: 'md-top', // Top margin only (medium size)
  bottom: 'md-bottom', // Bottom margin only (medium size)
  both: 'md', // Both top and bottom margins (medium size)

  // Additional spacing values for more granular control
  // These weren't in the old margin prop but are available in new spacing
  left: 'md-left', // Left margin (medium size)
  right: 'md-right', // Right margin (medium size)

  // Size-based spacing (applies to both top and bottom)
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',

  // Specific directional spacing with sizes
  'xs-top': 'xs-top',
  'xs-bottom': 'xs-bottom',
  'sm-top': 'sm-top',
  'sm-bottom': 'sm-bottom',
  'md-top': 'md-top',
  'md-bottom': 'md-bottom',
  'lg-top': 'lg-top',
  'lg-bottom': 'lg-bottom',
  'xl-top': 'xl-top',
  'xl-bottom': 'xl-bottom',

  // Extra small variants
  xs2: 'xs2',
  'xs2-top': 'xs2-top',
  'xs2-bottom': 'xs2-bottom',
};

// Import patterns to handle
const IMPORT_PATTERNS = [
  /from\s+['"`]@entur\/typography['"`]/g,
  /from\s+['"`]@entur\/typography\/dist['"`]/g,
  /from\s+['"`]@entur\/typography\/dist\/index['"`]/g,
  /from\s+['"`]@entur\/typography\/dist\/styles\.css['"`]/g,
];

// Parse JSX props more robustly
function parseJSXProps(propsString) {
  if (!propsString || !propsString.trim()) {
    return { props: {}, warnings: [], spreadProps: [] };
  }

  const props = {};
  const warnings = [];
  const spreadProps = []; // Track spread props separately
  const originalSyntax = {}; // Track original JSX syntax for each prop

  try {
    // Parse props manually to handle complex cases
    let remaining = propsString.trim();

    // First, extract all spread props
    const spreadRegex = /\.\.\.\{?(\w+)\}?/g;
    let spreadMatch;
    while ((spreadMatch = spreadRegex.exec(remaining)) !== null) {
      spreadProps.push(spreadMatch[1]);
    }

    // Remove spread props from the string to parse regular props
    remaining = remaining.replace(/\.\.\.\{?(\w+)\}?/g, '');

    // Now parse regular props
    while (remaining.trim().length > 0) {
      // Skip whitespace
      remaining = remaining.replace(/^\s+/, '');

      // Match prop name
      const nameMatch = remaining.match(/^(\w+)=/);
      if (!nameMatch) break;

      const propName = nameMatch[1];
      const matchLength = nameMatch[0].length;
      remaining = remaining.substring(matchLength);

      // Match prop value
      if (remaining.startsWith('"') || remaining.startsWith("'")) {
        // String value
        const quote = remaining[0];
        const endQuoteIndex = remaining.indexOf(quote, 1);
        if (endQuoteIndex === -1) {
          warnings.push(`Unterminated string in prop ${propName}`);
          break;
        }

        const propValue = remaining.substring(1, endQuoteIndex);
        props[propName] = propValue;
        originalSyntax[propName] = 'string'; // Mark as string literal
        remaining = remaining.substring(endQuoteIndex + 1);
      } else if (remaining.startsWith('{')) {
        // Object value - find matching closing brace
        let braceCount = 0;
        let endIndex = -1;

        for (let i = 0; i < remaining.length; i++) {
          if (remaining[i] === '{') braceCount++;
          if (remaining[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              endIndex = i;
              break;
            }
          }
        }

        if (endIndex === -1) {
          warnings.push(`Unterminated object in prop ${propName}`);
          break;
        }

        const propValue = remaining.substring(1, endIndex);
        props[propName] = propValue;
        originalSyntax[propName] = 'jsx'; // Mark as JSX expression
        remaining = remaining.substring(endIndex + 1);
      } else {
        // Boolean prop
        props[propName] = true;
        originalSyntax[propName] = 'boolean'; // Mark as boolean
        break;
      }

      // Skip whitespace
      remaining = remaining.replace(/^\s+/, '');
    }
  } catch (error) {
    warnings.push(`Failed to parse props: ${error.message}`);
  }

  return { props, warnings, spreadProps, originalSyntax };
}

// Migrate props from old to new format
function migrateProps(props, oldComponent) {
  const migratedProps = { ...props };
  const warnings = [];

  // Handle margin prop migration
  if (props.margin) {
    const newSpacing = SPACING_MAPPING[props.margin];
    if (newSpacing) {
      migratedProps.spacing = newSpacing;
      delete migratedProps.margin;
      warnings.push(
        `Migrated 'margin="${props.margin}"' to 'spacing="${newSpacing}"'`,
      );
    } else {
      // Unknown margin value - suggest alternatives
      const suggestions = getSpacingSuggestions(props.margin);
      migratedProps.spacing = props.margin; // Keep original value for now
      delete migratedProps.margin;
      warnings.push(
        `Migrated 'margin="${props.margin}"' to 'spacing="${props.margin}"' (unknown value). ${suggestions}`,
      );
    }
  }

  // Handle Heading components with existing 'as' prop
  if (oldComponent.startsWith('Heading') && props.as) {
    const headingNumber = oldComponent.replace('Heading', '');
    const expectedAs = `h${headingNumber}`;

    if (props.as !== expectedAs) {
      warnings.push(
        `Heading component has 'as="${props.as}"' but expected 'as="${expectedAs}"' - review semantic HTML structure`,
      );
    }
  }

  // Handle style prop conflicts
  if (props.style && props.margin) {
    warnings.push(
      `Component has both 'style' and 'margin' props - check for conflicts`,
    );
  }

  return { props: migratedProps, warnings };
}

// Helper function to suggest spacing alternatives for unknown margin values
function getSpacingSuggestions(unknownMargin) {
  const suggestions = [];

  // Check if it might be one of the old margin values
  if (['top', 'bottom', 'both', 'none'].includes(unknownMargin)) {
    suggestions.push(
      `"${unknownMargin}" is a valid old margin value and will be migrated correctly.`,
    );
    return suggestions.join(' ');
  }

  // Check if it might be a directional value
  if (
    unknownMargin.includes('top') ||
    unknownMargin.includes('bottom') ||
    unknownMargin.includes('left') ||
    unknownMargin.includes('right')
  ) {
    suggestions.push(
      'Consider using directional spacing like "md-top", "sm-bottom", etc.',
    );
  }

  // Check if it might be a size value
  if (['xs', 'sm', 'md', 'lg', 'xl'].includes(unknownMargin)) {
    suggestions.push(
      'Consider using size-based spacing like "xs", "sm", "md", "lg", "xl".',
    );
  }

  // Check if it might be a specific variant
  if (unknownMargin.includes('xs2')) {
    suggestions.push(
      'Consider using "xs2", "xs2-top", or "xs2-bottom" for extra small spacing.',
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      'Old margin values: "none", "top", "bottom", "both". New spacing values: "xs", "sm", "md", "lg", "xl", and directional variants.',
    );
  }

  return suggestions.join(' ');
}

// Convert props object back to JSX string
function propsToString(props, originalSyntax = {}) {
  if (!props || Object.keys(props).length === 0) {
    return '';
  }

  return (
    ' ' +
    Object.entries(props)
      .map(([key, value]) => {
        // Use original syntax information if available
        if (originalSyntax[key] === 'string') {
          return `${key}="${value}"`;
        } else if (originalSyntax[key] === 'jsx') {
          return `${key}={${value}}`;
        } else if (originalSyntax[key] === 'boolean') {
          return value ? key : '';
        } else {
          // Fallback logic for when originalSyntax is not available
          if (typeof value === 'string' && !value.includes('{')) {
            return `${key}="${value}"`;
          } else if (
            typeof value === 'string' &&
            value.startsWith('{') &&
            value.endsWith('}')
          ) {
            // Already a JSX object, don't add extra braces
            return `${key}={${value}}`;
          } else {
            return `${key}={${value}}`;
          }
        }
      })
      .filter(prop => prop.length > 0) // Remove empty props (like false booleans)
      .join(' ')
  );
}

// Update imports in content
function updateImports(content) {
  let updatedContent = content;
  let changes = 0;

  // First, update import paths
  IMPORT_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern) || [];
    changes += matches.length;
    updatedContent = updatedContent.replace(pattern, `from '${BETA_IMPORT}'`);
  });

  // Then, update destructured import names - only within @entur/typography imports
  // Find all import statements from @entur/typography and update component names
  const importRegex =
    /import\s*{([^}]+)}\s*from\s*['"']@entur\/typography['"']/g;

  updatedContent = updatedContent.replace(importRegex, (match, importList) => {
    let updatedImportList = importList;
    let hasChanges = false;
    const uniqueComponents = new Set();

    // Check each component in the import list
    Object.entries(COMPONENT_MAPPING).forEach(([oldComponent, mapping]) => {
      const componentRegex = new RegExp(`\\b${oldComponent}\\b`, 'g');
      if (componentRegex.test(updatedImportList)) {
        updatedImportList = updatedImportList.replace(
          componentRegex,
          mapping.component,
        );
        uniqueComponents.add(mapping.component);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      changes++;
      // Deduplicate components and create clean import statement
      const finalImportList = Array.from(uniqueComponents).join(', ');
      return `import {${finalImportList}} from '${BETA_IMPORT}'`;
    }

    return match;
  });

  return { content: updatedContent, changes };
}

// Update component usage with better prop handling
function updateComponents(content) {
  let updatedContent = content;
  let changes = 0;
  let warnings = [];

  Object.entries(COMPONENT_MAPPING).forEach(([oldComponent, mapping]) => {
    // More robust regex to handle complex JSX
    const componentRegex = new RegExp(`<${oldComponent}(\\s+[^>]*?)?>`, 'g');

    updatedContent = updatedContent.replace(
      componentRegex,
      (match, propsString) => {
        changes++;

        // Parse existing props
        const {
          props: existingProps,
          warnings: parseWarnings,
          spreadProps,
          originalSyntax,
        } = parseJSXProps(propsString);
        warnings.push(...parseWarnings);

        // Migrate props
        const { props: migratedProps, warnings: migrateWarnings } =
          migrateProps(existingProps, oldComponent);
        warnings.push(...migrateWarnings);

        // Build new props from mapping
        const newProps = { ...migratedProps };

        // Add mapping props (but don't override existing ones)
        Object.entries(mapping).forEach(([key, value]) => {
          if (key !== 'component' && !newProps[key]) {
            newProps[key] = value;
          }
        });

        // Handle Heading components
        if (mapping.component === 'Heading') {
          // Preserve existing 'as' prop if it exists, otherwise use mapping default
          const asValue = existingProps.as || mapping.as;
          // Preserve existing 'variant' prop if it exists, otherwise use mapping default
          const variantValue = existingProps.variant || mapping.variant;

          // Remove as and variant from props since we'll add them separately
          delete newProps.as;
          delete newProps.variant;

          // Ensure mapping props come first
          const orderedProps = {};
          if (newProps.spacing) {
            orderedProps.spacing = newProps.spacing;
            delete newProps.spacing;
          }
          Object.assign(orderedProps, newProps);

          const propsString = propsToString(orderedProps, originalSyntax);
          const spreadPropsString =
            spreadProps.length > 0 ? ` {...${spreadProps.join(', ...')}}` : '';
          return `<Heading as="${asValue}" variant="${variantValue}"${propsString}${spreadPropsString}>`;
        }

        // Handle other components
        const componentName = mapping.component;

        // Remove mapping props from newProps since they're already set
        Object.keys(mapping).forEach(key => {
          if (key !== 'component') {
            delete newProps[key];
          }
        });

        // Add mapping props in the correct order
        const finalProps = {};
        Object.entries(mapping).forEach(([key, value]) => {
          if (key !== 'component') {
            finalProps[key] = value;
          }
        });
        Object.assign(finalProps, newProps);

        const otherPropsString = propsToString(finalProps, originalSyntax);
        const spreadPropsString =
          spreadProps.length > 0 ? ` {...${spreadProps.join(', ...')}}` : '';
        return `<${componentName}${otherPropsString}${spreadPropsString}>`;
      },
    );

    // Update closing tags
    const closingTagRegex = new RegExp(`</${oldComponent}>`, 'g');
    const componentName = mapping.component;
    updatedContent = updatedContent.replace(
      closingTagRegex,
      `</${componentName}>`,
    );
  });

  return { content: updatedContent, changes, warnings };
}

/**
 * Find files matching the given pattern in allowed directories
 *
 * This function uses efficient glob patterns and data structures:
 * - Single glob call with brace expansion instead of multiple calls
 * - Set-based extension filtering for O(1) lookups
 * - No array concatenation in loops
 *
 * @param {string} pattern - Glob pattern to match (e.g., '*.{ts,tsx,js,jsx}')
 * @returns {string[]} Array of matching file paths
 */
function findFiles(pattern) {
  const allFiles = [];

  // Process directory patterns
  const directoryPatterns = ALLOWED_DIRECTORIES.filter(dir =>
    dir.includes('**'),
  );
  const filePatterns = ALLOWED_DIRECTORIES.filter(dir => !dir.includes('**'));

  // Handle directory patterns (e.g., src/**, app/**)
  if (directoryPatterns.length > 0) {
    const combinedDirPattern = `{${directoryPatterns.join(',')}}/${pattern}`;
    const dirFiles = glob.sync(combinedDirPattern, {
      ignore: BLOCKED_DIRECTORIES,
      nodir: true,
      absolute: false,
    });
    allFiles.push(...dirFiles);
  }

  // Handle file patterns (e.g., *.jsx, *.tsx)
  filePatterns.forEach(filePattern => {
    const files = glob.sync(filePattern, {
      ignore: BLOCKED_DIRECTORIES,
      nodir: true,
      absolute: false,
    });
    allFiles.push(...files);
  });

  // Use Set for efficient deduplication and filtering
  const fileExtensions = new Set([
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.scss',
    '.css',
  ]);

  const uniqueFiles = allFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return fileExtensions.has(ext);
  });

  return uniqueFiles;
}

function updateImportsAndComponents(content) {
  let updatedContent = content;
  let changes = 0;
  let warnings = [];

  // Update both imports and components
  const { content: newContent, changes: importChanges } =
    updateImports(content);
  const {
    content: finalContent,
    changes: componentChanges,
    warnings: componentWarnings,
  } = updateComponents(newContent);
  updatedContent = finalContent;
  changes = importChanges + componentChanges;
  warnings = componentWarnings;

  return { content: updatedContent, changes, warnings };
}

function generateMigrationReport(files, isDryRun = false) {
  const report = {
    strategy: 'complete',
    totalFiles: files.length,
    migratedFiles: 0,
    totalChanges: 0,
    totalWarnings: 0,
    files: [],
    warnings: [],
    isDryRun,
  };

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');

      // Analyze file for problematic patterns BEFORE migration
      const fileAnalysis = analyzeFile(file, content);

      const {
        content: updatedContent,
        changes,
        warnings,
      } = updateImportsAndComponents(content);

      // Combine migration warnings with file analysis warnings
      const allWarnings = [...warnings, ...fileAnalysis.warnings];

      if (changes > 0 || fileAnalysis.warnings.length > 0) {
        if (!isDryRun) {
          fs.writeFileSync(file, updatedContent, 'utf8');
        }
        if (changes > 0) {
          report.migratedFiles++;
          report.totalChanges += changes;
        }
        report.totalWarnings += allWarnings.length;
        report.files.push({ file, changes, warnings: allWarnings });
        report.warnings.push(
          ...allWarnings.map(warning => `${file}: ${warning}`),
        );
      }
    } catch (error) {
      report.warnings.push(`${file}: Error processing file - ${error.message}`);
    }
  });

  return report;
}

function printReport(report) {
  console.log('\n🎉 Migration Report');
  console.log('==================');
  console.log(`Strategy: ${report.strategy}`);
  console.log(`Total files scanned: ${report.totalFiles}`);
  console.log(`Files migrated: ${report.migratedFiles}`);
  console.log(`Total changes: ${report.totalChanges}`);
  console.log(`Total warnings: ${report.totalWarnings}`);

  if (report.files.length > 0) {
    console.log('\nMigrated files:');
    report.files.forEach(({ file, changes, warnings }) => {
      console.log(
        `  ✅ ${file} (${changes} changes${
          warnings.length > 0 ? `, ${warnings.length} warnings` : ''
        })`,
      );
    });
  }

  if (report.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');

    // Group warnings by type
    const marginWarnings = report.warnings.filter(w => w.includes('Migrated'));
    const semanticWarnings = report.warnings.filter(w =>
      w.includes('expected'),
    );
    const conflictWarnings = report.warnings.filter(w =>
      w.includes('check for conflicts'),
    );

    // New warning types from file analysis
    const styleConflictWarnings = report.warnings.filter(
      w => w.includes('style conflicts') || w.includes('style and margin'),
    );
    const nestedTypographyWarnings = report.warnings.filter(w =>
      w.includes('nested typography'),
    );
    const accessibilityWarnings = report.warnings.filter(
      w => w.includes('missing as prop') || w.includes('accessibility'),
    );
    const semanticMismatchWarnings = report.warnings.filter(w =>
      w.includes('semantic mismatch'),
    );

    if (marginWarnings.length > 0) {
      console.log(
        `\n  🔄 Margin → Spacing Migrations (${marginWarnings.length}):`,
      );
      // Show first 5 warnings, then summarize the rest
      marginWarnings
        .slice(0, 5)
        .forEach(warning => console.log(`    ${warning}`));
      if (marginWarnings.length > 5) {
        console.log(
          `    ... and ${marginWarnings.length - 5} more similar warnings`,
        );
      }
    }

    if (semanticWarnings.length > 0) {
      console.log(`\n  🎯 Semantic HTML Issues (${semanticWarnings.length}):`);
      // Show first 5 warnings, then summarize the rest
      semanticWarnings
        .slice(0, 5)
        .forEach(warning => console.log(`    ${warning}`));
      if (semanticWarnings.length > 5) {
        console.log(
          `    ... and ${semanticWarnings.length - 5} more similar warnings`,
        );
      }
    }

    if (conflictWarnings.length > 0) {
      console.log(`\n  🚨 Style Conflicts (${conflictWarnings.length}):`);
      // Show first 5 warnings, then summarize the rest
      conflictWarnings
        .slice(0, 5)
        .forEach(warning => console.log(`    ${warning}`));
      if (conflictWarnings.length > 5) {
        console.log(
          `    ... and ${conflictWarnings.length - 5} more similar warnings`,
        );
      }
      console.log(`    → Review these components for styling conflicts`);
    }

    // Display new warning types
    if (styleConflictWarnings.length > 0) {
      console.log(
        `\n  🎨 Style + Margin Conflicts (${styleConflictWarnings.length}):`,
      );
      styleConflictWarnings
        .slice(0, 5)
        .forEach(warning => console.log(`    ${warning}`));
      if (styleConflictWarnings.length > 5) {
        console.log(
          `    ... and ${
            styleConflictWarnings.length - 5
          } more similar warnings`,
        );
      }
      console.log(`    → Remove margin prop when using inline styles`);
    }

    if (nestedTypographyWarnings.length > 0) {
      console.log(
        `\n  🚫 Nested Typography (${nestedTypographyWarnings.length}):`,
      );
      nestedTypographyWarnings
        .slice(0, 5)
        .forEach(warning => console.log(`    ${warning}`));
      if (nestedTypographyWarnings.length > 5) {
        console.log(
          `    ... and ${
            nestedTypographyWarnings.length - 5
          } more similar warnings`,
        );
      }
      console.log(
        `    → Use spans or other inline elements instead of nested Text components`,
      );
    }

    if (accessibilityWarnings.length > 0) {
      console.log(
        `\n  ♿ Accessibility Issues (${accessibilityWarnings.length}):`,
      );
      accessibilityWarnings
        .slice(0, 5)
        .forEach(warning => console.log(`    ${warning}`));
      if (accessibilityWarnings.length > 5) {
        console.log(
          `    ... and ${
            accessibilityWarnings.length - 5
          } more similar warnings`,
        );
      }
      console.log(
        `    → Add 'as' prop to Heading components for proper semantic HTML`,
      );
    }

    if (semanticMismatchWarnings.length > 0) {
      console.log(
        `\n  🔍 Semantic Mismatches (${semanticMismatchWarnings.length}):`,
      );
      semanticMismatchWarnings
        .slice(0, 5)
        .forEach(warning => console.log(`    ${warning}`));
      if (semanticMismatchWarnings.length > 5) {
        console.log(
          `    ... and ${
            semanticMismatchWarnings.length - 5
          } more similar warnings`,
        );
      }
      console.log(`    → Review heading level and variant combinations`);
    }

    console.log('\n📋 Summary:');
    if (marginWarnings.length > 0)
      console.log(
        `  • ${marginWarnings.length} margin props migrated to spacing`,
      );
    if (semanticWarnings.length > 0)
      console.log(
        `  • ${semanticWarnings.length} semantic HTML issues need review`,
      );
    if (conflictWarnings.length > 0)
      console.log(
        `  • ${conflictWarnings.length} style conflicts need manual review`,
      );
    if (styleConflictWarnings.length > 0)
      console.log(
        `  • ${styleConflictWarnings.length} style + margin conflicts detected`,
      );
    if (nestedTypographyWarnings.length > 0)
      console.log(
        `  • ${nestedTypographyWarnings.length} nested typography components found`,
      );
    if (accessibilityWarnings.length > 0)
      console.log(
        `  • ${accessibilityWarnings.length} accessibility issues need attention`,
      );
    if (semanticMismatchWarnings.length > 0)
      console.log(
        `  • ${semanticMismatchWarnings.length} semantic mismatches detected`,
      );

    // Add helpful note about warning limits
    if (report.warnings.length > 15) {
      console.log(
        '\n💡 Note: Only showing first 5 warnings of each type to avoid overwhelming output.',
      );
      console.log(
        '   All warnings are still logged in the migration report above.',
      );
    }
  }
}

function showNextSteps() {
  console.log('\n📝 Next Steps');
  console.log('=============');

  console.log('1. 🧪 Test your application thoroughly');
  console.log('2. 🔄 Review and adjust any component props if needed');
  console.log('3. 📚 Read the migration guide on our website');

  console.log('\n⚠️  Important Notes:');
  console.log('- Check warnings above for potential issues');
  console.log('- Review migrated components for prop conflicts');
  console.log('- Test thoroughly, especially components with custom styling');
}

function main() {
  // Show help if requested
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('🎨 Typography Migration Script');
    console.log('==============================');
    console.log('');
    console.log('Usage:');
    console.log('  # From npm package (recommended)');
    console.log('  npx @entur/typography@latest migrate [options]');
    console.log('  yarn dlx @entur/typography@latest migrate [options]');
    console.log('');
    console.log('  # Direct execution (requires glob package)');
    console.log('  node scripts/migrate-typography.js [options]');
    console.log('');
    console.log('  # Local development');
    console.log('  npm run migrate');
    console.log('');
    console.log('Options:');
    console.log(
      '  --dry-run        Show what would be changed without modifying files',
    );
    console.log('  --help, -h       Show this help message');
    console.log('');
    console.log('Migration Mode:');
    console.log('  🚀 Complete Mode: Updates everything');
    console.log('     - Replaces old components with beta components');
    console.log('     - Heading1-6 → Heading with as/variant props');
    console.log('     - Text components → Text with variant props');
    console.log('     - Link → LinkBeta, Blockquote → BlockquoteBeta');
    console.log(
      '     - Lists → UnorderedListBeta, NumberedListBeta, ListItemBeta',
    );
    console.log('     - May require prop/styling updates');
    console.log('     - Test thoroughly after migration');
    console.log('');
    console.log('Examples:');
    console.log('  # See what would be changed');
    console.log('  npx @entur/typography@latest migrate --dry-run');
    console.log('');
    console.log('  # Complete migration: update everything (default)');
    console.log('  npx @entur/typography@latest migrate');

    console.log('Environment Variables:');
    console.log(
      '  TYPOGRAPHY_MIGRATION_DIRS  Comma-separated list of directories to scan',
    );
    console.log('                            Example: "src/**,app/**"');
    console.log('');
    console.log('🎯 Customizing Scan Directories:');
    console.log('  Option 1: Edit MIGRATION_FOLDERS in the script (EASIEST)');
    console.log(
      '    Open the script and find the "MIGRATION FOLDERS CONFIGURATION" section',
    );
    console.log('    Add/remove folder patterns between the 👇 and 👆 markers');
    console.log('    Examples: "src/**", "app/**", "packages/my-app/**"');
    console.log('');
    console.log('  Option 2: Set environment variable');
    console.log(
      '    export TYPOGRAPHY_MIGRATION_DIRS="src/**,app/**,components/**"',
    );
    console.log('    node scripts/migrate-typography.js');
    console.log('');
    console.log('Security Features:');
    console.log('  - Only scans allowed directories (src/**, app/**, etc.)');
    console.log('  - Never scans node_modules, dist, build, .git, etc.)');
    console.log('  - Dry-run mode for safe testing');
    console.log('');
    process.exit(0);
  }

  console.log('🎨 Typography Migration Script');
  console.log('==============================');
  console.log('');
  console.log(
    'This script helps you migrate from old typography to new beta typography.',
  );
  console.log('');

  // Find files to migrate - use a single efficient pattern
  const allFiles = findFiles('*.{ts,tsx,js,jsx,scss,css}');

  console.log(`Found ${allFiles.length} files to scan for typography imports.`);
  console.log('');

  // Security check
  console.log('🔒 Security: Only scanning allowed directories:');
  ALLOWED_DIRECTORIES.forEach(dir => {
    console.log(`  ✅ ${dir}`);
  });
  console.log('');

  // Safety check
  if (allFiles.length === 0) {
    console.log('⚠️  No files found to scan. This might mean:');
    console.log("   - You're not in the right directory");
    console.log("   - Your project structure doesn't match the allow-list");
    console.log('   - You need to run this from your project root');
    console.log('');
    console.log('Allowed directory patterns:');
    ALLOWED_DIRECTORIES.forEach(dir => console.log(`   ${dir}`));
    process.exit(1);
  }

  console.log('📁 Files will be scanned in these locations:');
  const scannedDirs = [
    ...new Set(allFiles.map(file => path.dirname(file))),
  ].slice(0, 10);

  // Show relative paths safely
  scannedDirs.forEach(dir => {
    // Ensure we don't show absolute paths
    const safeDir = path.isAbsolute(dir)
      ? path.relative(process.cwd(), dir)
      : dir;
    console.log(`  📂 ${safeDir}`);
  });

  if (allFiles.length > 10) {
    console.log(`  ... and ${allFiles.length - 10} more files`);
  }
  console.log('');

  // Parse command line options
  const isDryRun = process.argv.includes('--dry-run');

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE: No files will be modified');
    console.log('');
  }

  console.log('🚀 COMPLETE MIGRATION: Updating imports + component usage');
  console.log('⚠️  WARNING: This will modify your component usage!');
  console.log('   - Old components will be replaced with beta components');
  console.log(
    '   - Link → LinkBeta, Blockquote → BlockquoteBeta, Lists → ListBeta components',
  );
  console.log(
    '   - List components → UnorderedListBeta, NumberedListBeta, ListItemBeta',
  );
  console.log('   - You may need to update props and styling');
  console.log('   - Test thoroughly after migration');

  console.log('');

  // Perform migration
  const report = generateMigrationReport(allFiles, isDryRun);
  printReport(report);
  showNextSteps();

  console.log('\n🎯 Migration complete!');
}

if (require.main === module) {
  main();
}

module.exports = {
  updateImportsAndComponents,
  generateMigrationReport,
  COMPONENT_MAPPING,
  PROPS_MAPPING,
};
