import React from 'react';
import { Theme } from '@providers/SettingsContext';

import logo from '@media/logo/logo.svg';
import logoDark from '@media/logo/logoDark.svg';

export const Logo = ({ colorMode = 'light' }: { colorMode: Theme }) => (
  <img
    src={['dark', 'contrast'].includes(colorMode) ? logoDark : logo}
    width="104px"
    alt="Entur sin logo"
  />
);
