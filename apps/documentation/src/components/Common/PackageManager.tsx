import React from 'react';
import { useSettings } from '@providers/SettingsContext';
import { Text } from '@entur/typography/beta';

const PackageManager = (): React.ReactNode => {
  const { packageManager } = useSettings();
  return (
    <div>
      {packageManager === 'npm' ? (
        <Text variant="code-text">
          npm install @entur/tokens @entur/typography @entur/layout
          @entur/button @entur/form
        </Text>
      ) : (
        <Text variant="code-text">
          yarn add @entur/tokens @entur/typography @entur/layout @entur/button
          @entur/form
        </Text>
      )}
    </div>
  );
};

export default PackageManager;
