import React from 'react';
import { useSettings } from '~/components/SettingsContext';
import { CodeText } from '@entur/typography';

export const PackageManager = () => {
  const { packageManager } = useSettings();
  return (
    <div>
      {packageManager === 'npm' ? (
        <CodeText>
          npm install @entur/tokens @entur/typography @entur/layout
          @entur/button @entur/form
        </CodeText>
      ) : (
        <CodeText>
          yarn add @entur/tokens @entur/typography @entur/layout @entur/button
          @entur/form
        </CodeText>
      )}
    </div>
  );
};
