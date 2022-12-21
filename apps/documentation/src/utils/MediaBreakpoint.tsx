import { createMedia } from '@artsy/fresnel';
import { breakpoints } from '@entur/tokens';
export const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    desktop: breakpoints.large,
  },
});
