// The docs site is resolved through the aliases in viteShared.ts. Typing it here
// keeps Studio's typecheck from compiling the whole Gatsby app.
declare module '*.scss';

declare module '@components/sanity/PortableText' {
  import type { ComponentType } from 'react';
  export const PortableText: ComponentType<{
    value: unknown;
    context?: { npmPackage?: string };
    container?: boolean;
  }>;
}

declare module '@components/sanity/DocContent' {
  import type { ReactNode } from 'react';
  export function renderContent(args: {
    value: unknown;
    context?: { npmPackage?: string };
  }): ReactNode;
}

declare module '@providers/SettingsContext' {
  import type { ComponentType, ReactNode } from 'react';
  export const SettingsProvider: ComponentType<{ children: ReactNode }>;
}

declare module '@components/Playground/Playground' {
  import type { ComponentType } from 'react';
  const Playground: ComponentType<Record<string, unknown>>;
  export default Playground;
}
