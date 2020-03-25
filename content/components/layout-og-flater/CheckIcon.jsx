import React from 'react';
import { ValidationCheckIcon } from '@entur/icons';
import { useContrast } from '@entur/layout';
import { colors } from '@entur/tokens';

export const CheckIcon = () => {
  const contrast = useContrast();
  return contrast ? (
    <ValidationCheckIcon
      style={{ fontSize: '1.5rem', color: colors.validation.mintContrast }}
    />
  ) : (
    <ValidationCheckIcon
      style={{ fontSize: '1.5rem', color: colors.validation.mint }}
    />
  );
};
