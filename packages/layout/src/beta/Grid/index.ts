import { Grid as GridParent } from './Grid';
import { GridItem } from './GridItem';

type Grid = typeof GridParent & {
  /**
   * An item inside a Grid.
   *
   * @example
   * <Grid.Item colSpan={6}>Content</Grid.Item>
   */
  Item: typeof GridItem & { displayName?: string };
};

/**
 * A CSS Grid component for organizing content in a grid.
 *
 * @example
 * <Grid>
 *   <Grid.Item colSpan={6}>Content</Grid.Item>
 *   <Grid.Item colSpan={6}>Content</Grid.Item>
 * </Grid>
 */
export const GridComponent: Grid = Object.assign(GridParent, {
  Item: GridItem,
});

GridComponent.Item.displayName = 'Grid.Item';

export type { GridProps, GridOwnProps } from './Grid';
export type { GridSpacingValue, ResponsiveValue } from '../LayoutWrapper/utils';
export type { GridItemProps, GridItemOwnProps } from './GridItem';
export { GridComponent as Grid, GridItem };
export { LayoutProvider } from '../LayoutWrapper/LayoutWrapper';
export { useLayoutValues } from '../LayoutWrapper/useLayoutValues';
