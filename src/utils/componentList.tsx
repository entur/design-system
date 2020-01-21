// Remember - add any new packages here!
// Note that icons and tokens are left out - that's on purpose
import * as a11y from '@entur/a11y';
import * as alert from '@entur/alert';
import * as button from '@entur/button';
import * as chip from '@entur/chip';
import * as datepicker from '@entur/datepicker';
import * as dropdown from '@entur/dropdown';
import * as expand from '@entur/expand';
import * as form from '@entur/form';
import * as layout from '@entur/layout';
import * as loader from '@entur/loader';
import * as menu from '@entur/menu';
import * as modal from '@entur/modal';
import * as tab from '@entur/tab';
import * as table from '@entur/table';
import * as tooltip from '@entur/tooltip';
import * as typography from '@entur/typography';

const allComponentsByPackage = {
  a11y,
  alert,
  button,
  chip,
  datepicker,
  dropdown,
  expand,
  form,
  layout,
  loader,
  menu,
  modal,
  tab,
  table,
  tooltip,
  typography,
};

export type ComponentRepresentationType = {
  exportName: string;
  exportImpl: any;
  packageName: string;
};

export const allComponentsAlphabetically: ComponentRepresentationType[] = Object.entries(
  allComponentsByPackage,
)
  .flatMap(([packageName, theExports]) =>
    Object.entries(theExports).map(([exportName, exportImpl]) => ({
      exportName,
      exportImpl,
      packageName,
    })),
  )
  .sort((a, b) => a.exportName.localeCompare(b.exportName));
