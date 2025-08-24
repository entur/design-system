import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

interface ExtractedToken {
  variable: string;
  value: string;
  description: string;
  category: 'color' | 'spacing' | 'typography' | 'other';
  component: string;
}

interface ComponentTokens {
  [npmPackage: string]: ExtractedToken[];
}

// Function to determine token category based on variable name
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

// Function to generate a description based on the variable name
function generateDescription(variable: string): string {
  // Remove the --components- prefix and split by hyphens
  const parts = variable.replace('--components-', '').split('-');

  // Convert to readable format
  const readable = parts
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return `${readable} token`;
}

// Function to extract component name from package path
function getComponentName(packagePath: string): string {
  // Extract the package name from the path
  // Path format: .../packages/packageName/src/componentColors.scss
  const pathParts = packagePath.split(path.sep);
  const packagesIndex = pathParts.findIndex(part => part === 'packages');
  if (packagesIndex !== -1 && packagesIndex + 1 < pathParts.length) {
    return pathParts[packagesIndex + 1];
  }
  // Fallback to basename if path structure is unexpected
  return path.basename(path.dirname(packagePath));
}

// Function to parse SCSS file and extract tokens
function parseComponentColorsFile(filePath: string): ExtractedToken[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const tokens: ExtractedToken[] = [];
    const component = getComponentName(path.dirname(filePath));

    // Regular expression to match CSS variable declarations
    // Matches: --components-component-name: #{$token-value};
    const variableRegex = /--components-([^:]+):\s*#\{([^}]+)\};/g;

    let match;
    while ((match = variableRegex.exec(content)) !== null) {
      const fullVariable = `--components-${match[1]}`;
      const value = `#{$${match[2]}}`;

      tokens.push({
        variable: fullVariable,
        value,
        description: generateDescription(fullVariable),
        category: getTokenCategory(fullVariable),
        component,
      });
    }

    return tokens;
  } catch (error) {
    console.error(`Error parsing file ${filePath}:`, error);
    return [];
  }
}

// Main function to build all component tokens
async function buildComponentTokens(): Promise<void> {
  try {
    console.log('🔍 Scanning packages for componentColors.scss files...');

    // Find all componentColors.scss files in packages
    const pattern = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'packages/*/src/componentColors.scss',
    );
    const files = await glob(pattern);

    console.log(`Found ${files.length} componentColors.scss files`);

    const allTokens: ComponentTokens = {};

    // Process each file
    for (const file of files) {
      const component = getComponentName(path.dirname(file));
      console.log(`Processing ${component}...`);

      const tokens = parseComponentColorsFile(file);
      if (tokens.length > 0) {
        allTokens[component] = tokens;
        console.log(`  Extracted ${tokens.length} tokens`);
      }
    }

    // Generate the output file
    const outputPath = path.join(__dirname, '..', 'generatedTokens.ts');
    const outputContent = generateTokensFile(allTokens);

    fs.writeFileSync(outputPath, outputContent);

    console.log(`✅ Generated tokens file: ${outputPath}`);
    console.log(`Total components processed: ${Object.keys(allTokens).length}`);
    console.log(
      `Total tokens extracted: ${Object.values(allTokens).flat().length}`,
    );
  } catch (error) {
    console.error('❌ Error building component tokens:', error);
    process.exit(1);
  }
}

// Function to generate the TypeScript tokens file
function generateTokensFile(tokens: ComponentTokens): string {
  const imports = `import { ComponentToken } from './componentTokens/types';`;

  const tokensData = Object.entries(tokens)
    .map(([component, componentTokens]) => {
      const tokensString = componentTokens
        .map(
          token => `  {
    variable: '${token.variable}',
    value: '${token.value}',
    description: '${token.description}',
    category: '${token.category}' as const,
  }`,
        )
        .join(',\n');

      return `const ${component}Tokens: ComponentToken[] = [
${tokensString}
];`;
    })
    .join('\n\n');

  const exports = Object.keys(tokens)
    .map(component => `  ${component}: ${component}Tokens`)
    .join(',\n');

  const getComponentTokensFunction = `
// Helper function to get tokens for a specific component
export const getComponentTokens = (npmPackage: string): ComponentToken[] => {
  return componentTokens[npmPackage] || [];
};

// Helper function to get tokens by category
export const getTokensByCategory = (
  npmPackage: string,
  category: ComponentToken['category'],
): ComponentToken[] => {
  const tokens = getComponentTokens(npmPackage);
  return tokens.filter(token => token.category === category);
};
`;

  return `${imports}

// Auto-generated component tokens - DO NOT EDIT MANUALLY
// This file is generated at build time from componentColors.scss files
// Size: ~${Math.round(
    Object.values(tokens).flat().length * 0.2,
  )}KB (much smaller than full SCSS files)

${tokensData}

// Export all component tokens
export const componentTokens: Record<string, ComponentToken[]> = {
${exports}
};

${getComponentTokensFunction}
`;
}

// Run the build if this file is executed directly
if (require.main === module) {
  buildComponentTokens();
}
