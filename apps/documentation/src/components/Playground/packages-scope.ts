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
  ...typography,
  ...typographyBeta,
  ...utils,
};
