import React from 'react';
import { ValidationSuccessFilledIcon } from '@entur/icons';
import { useContrast } from '@entur/layout';
import { colors } from '@entur/tokens';

export const CheckIcon = () => {
  const contrast = useContrast();
  return contrast ? (
    <ValidationSuccessFilledIcon
      style={{ fontSize: '1.5rem', color: colors.validation.mintContrast }}
    />
  ) : (
    <ValidationSuccessFilledIcon
      style={{ fontSize: '1.5rem', color: colors.validation.mint }}
    />
  );
};
