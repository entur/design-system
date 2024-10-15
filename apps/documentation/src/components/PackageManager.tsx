import React from 'react';
import { useSettings } from '~/utils/Providers/SettingsContext';
import { CodeText } from '@entur/typography';

const PackageManager = (): React.ReactNode => {
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

export default PackageManager;
