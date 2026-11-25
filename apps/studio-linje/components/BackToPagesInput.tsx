import React from 'react';
import { Button, Stack } from '@sanity/ui';
import type { ObjectInputProps } from 'sanity';
import { usePresentationParams } from 'sanity/presentation';
import { useRouter } from 'sanity/router';
import { LeftArrowIcon } from '@entur/icons';
import { getListPath } from '../listPath';

// Pages are edited in Presentation, see OpenInPresentation. This leads
// back to the list in Sider the document was opened from, not to the document,
// which would open here again.
export const BackToPagesInput = (props: ObjectInputProps) => {
  const { navigateUrl } = useRouter();
  const inPresentation = usePresentationParams(false) !== null;

  return (
    <Stack gap={5}>
      {inPresentation && (
        <Button
          icon={LeftArrowIcon}
          tone="primary"
          text="Tilbake til sideoversikt"
          onClick={() => navigateUrl({ path: getListPath() })}
        />
      )}
      {props.renderDefault(props)}
    </Stack>
  );
};
