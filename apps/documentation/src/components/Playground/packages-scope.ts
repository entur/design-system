import * as a11y from '@entur/a11y';
import * as alert from '@entur/alert';
import * as button from '@entur/button';
import * as chip from '@entur/chip';
import * as datepicker from '@entur/datepicker';
import * as dropdown from '@entur/dropdown';
import * as expand from '@entur/expand';
import * as fileupload from '@entur/fileupload';
import * as form from '@entur/form';
import * as grid from '@entur/grid';
import * as icons from '@entur/icons';
import * as layout from '@entur/layout';
import * as layoutBeta from '@entur/layout/beta';
import * as loader from '@entur/loader';
import * as menu from '@entur/menu';
import * as menuBeta from '@entur/menu/beta';
import * as modal from '@entur/modal';
import * as tab from '@entur/tab';
import * as table from '@entur/table';
import * as tokens from '@entur/tokens';
import * as tooltip from '@entur/tooltip';
import * as travel from '@entur/travel';
import * as typography from '@entur/typography';
import * as typographyBeta from '@entur/typography/beta';
import * as utils from '@entur/utils';

export const packages = {
  ...a11y,
  ...alert,
  ...button,
  ...chip,
  ...datepicker,
  ...dropdown,
  ...expand,
  ...fileupload,
  ...form,
  ...grid,
  ...icons,
  ...layout,
  ...layoutBeta,
  ...loader,
  ...menu,
  // Aliased: @entur/menu/beta exports a SideNavigation that would otherwise
  // shadow the stable one used by the existing examples.
  SideNavigationBeta: menuBeta.SideNavigation,
  ...modal,
  ...tab,
  ...table,
  ...tokens,
  ...tooltip,
  ...travel,
  // Beta first so the stable typography wins name clashes; clashing beta
  // components are reachable through Beta-suffixed aliases.
  ...typographyBeta,
  ...typography,
  LinkBeta: typographyBeta.Link,
  UnorderedListBeta: typographyBeta.UnorderedList,
  NumberedListBeta: typographyBeta.NumberedList,
  ListItemBeta: typographyBeta.ListItem,
  ...utils,
};

// What a snippet's own imports resolve to, so `import { Link } from
// '@entur/typography/beta'` runs the beta Link despite the clashes above.
export const modules: Record<string, Record<string, unknown>> = {
  '@entur/a11y': a11y,
  '@entur/alert': alert,
  '@entur/button': button,
  '@entur/chip': chip,
  '@entur/datepicker': datepicker,
  '@entur/dropdown': dropdown,
  '@entur/expand': expand,
  '@entur/fileupload': fileupload,
  '@entur/form': form,
  '@entur/grid': grid,
  '@entur/icons': icons,
  '@entur/layout': layout,
  '@entur/layout/beta': layoutBeta,
  '@entur/loader': loader,
  '@entur/menu': menu,
  '@entur/menu/beta': menuBeta,
  '@entur/modal': modal,
  '@entur/tab': tab,
  '@entur/table': table,
  '@entur/tokens': tokens,
  '@entur/tooltip': tooltip,
  '@entur/travel': travel,
  '@entur/typography': typography,
  '@entur/typography/beta': typographyBeta,
  '@entur/utils': utils,
};
