import React from 'react';
import { ToastProvider } from '@entur/alert';
import { Heading, Text } from '@entur/typography/beta';
import { SettingsProvider } from '@providers/SettingsContext';

// The page header on the site, without its links and npm details
export function PreviewPage({
  subcategory,
  title,
  description,
  children,
}: {
  subcategory?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <ToastProvider>
        <main style={{ maxWidth: '50rem', padding: '2rem' }}>
          {subcategory && (
            <Text variant="overline" spacing={{ bottom: 'xs' }}>
              {subcategory}
            </Text>
          )}
          <Heading as="h1" variant="title-1">
            {title}
          </Heading>
          {description && (
            <Text variant="leading" spacing={{ top: 'm', bottom: 'xl' }}>
              {description}
            </Text>
          )}
          {children}
        </main>
      </ToastProvider>
    </SettingsProvider>
  );
}
