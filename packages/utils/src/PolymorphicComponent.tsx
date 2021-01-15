// Direct export from dependency, as all packages are dependant on utils
// Avoids adding the dependency to several packages
import { Box, PolymorphicComponentProps } from 'react-polymorphic-box';
import type {
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
  PolymorphicForwardRefExoticComponent,
} from 'react-polymorphic-types';

export {
  Box,
  PolymorphicComponentProps,
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
  PolymorphicForwardRefExoticComponent,
};
