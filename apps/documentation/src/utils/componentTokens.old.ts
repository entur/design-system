// Component tokens data - this could be generated at build time
// For now, we'll define it manually for the components we have

export interface ComponentToken {
  variable: string;
  value: string;
  description: string;
  category: 'color' | 'spacing' | 'typography' | 'other';
}

export interface ComponentTokens {
  [npmPackage: string]: ComponentToken[];
}

// Example tokens for the button component
const buttonTokens: ComponentToken[] = [
  {
    variable: '--components-button-primary-fill',
    value: '#{$fill-primary}',
    description: 'Primary button background color',
    category: 'color',
  },
  {
    variable: '--components-button-primary-text',
    value: '#{$text-on-primary}',
    description: 'Primary button text color',
    category: 'color',
  },
  {
    variable: '--components-button-primary-border',
    value: '#{$stroke-primary}',
    description: 'Primary button border color',
    category: 'color',
  },
  {
    variable: '--components-button-secondary-fill',
    value: '#{$fill-secondary}',
    description: 'Secondary button background color',
    category: 'color',
  },
  {
    variable: '--components-button-secondary-text',
    value: '#{$text-on-secondary}',
    description: 'Secondary button text color',
    category: 'color',
  },
  {
    variable: '--components-button-secondary-border',
    value: '#{$stroke-secondary}',
    description: 'Secondary button border color',
    category: 'color',
  },
  {
    variable: '--components-button-padding',
    value: '#{$spacing-medium}',
    description: 'Button padding',
    category: 'spacing',
  },
  {
    variable: '--components-button-border-radius',
    value: '#{$border-radius-medium}',
    description: 'Button border radius',
    category: 'other',
  },
];

// Example tokens for the alert component
const alertTokens: ComponentToken[] = [
  {
    variable: '--components-alert-alertbox-information-standard-filldefault',
    value: '#{$fill-information-muted}',
    description: 'Information alert background color',
    category: 'color',
  },
  {
    variable: '--components-alert-alertbox-information-standard-textdefault',
    value: '#{$text-accent}',
    description: 'Information alert text color',
    category: 'color',
  },
  {
    variable: '--components-alert-alertbox-information-standard-border',
    value: '#{$stroke-information}',
    description: 'Information alert border color',
    category: 'color',
  },
  {
    variable: '--components-alert-alertbox-success-standard-filldefault',
    value: '#{$fill-success-muted}',
    description: 'Success alert background color',
    category: 'color',
  },
  {
    variable: '--components-alert-alertbox-success-standard-textdefault',
    value: '#{$text-accent}',
    description: 'Success alert text color',
    category: 'color',
  },
  {
    variable: '--components-alert-alertbox-success-standard-border',
    value: '#{$stroke-success}',
    description: 'Success alert border color',
    category: 'color',
  },
];

// Export all component tokens
export const componentTokens: ComponentTokens = {
  button: buttonTokens,
  alert: alertTokens,
  // Add more components as needed
};

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
