export interface ComponentToken {
  variable: string;
  value: string;
  description: string;
  category: 'color' | 'spacing' | 'typography' | 'other';
  component: string;
}

export interface ComponentTokens {
  [npmPackage: string]: ComponentToken[];
}
