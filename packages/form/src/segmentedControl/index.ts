import { SegmentedControl as SegmentedControlParent } from './SegmentedControl';
import { SegmentedChoice } from './SegmentedChoice';

type SegmentedControl = typeof SegmentedControlParent & {
  /**
   * Et valg i en SegmentedControl.
   *
   * @example
   * <SegmentedControl.Item value='1'>Item 1</SegmentedControl.Item>
   */
  Item: typeof SegmentedChoice & { displayName?: string };
};

/**
 * Vis en gruppe med nært beslektede valg som påvirker et objekt, en tilstand eller en visning.
 *
 * @example
 * <SegmentedControl onChange={(value) => console.log(value)}>
 *   <SegmentedControl.Item value='1'>Item 1</SegmentedControl.Item>
 *   <SegmentedControl.Item value='2'>Item 2</SegmentedControl.Item>
 *   <SegmentedControl.Item value='3'>Item 3</SegmentedControl.Item>
 * </SegmentedControl>
 */
export const SegmentedControlComponent: SegmentedControl = Object.assign(
  SegmentedControlParent,
  {
    Item: SegmentedChoice,
  },
);

SegmentedControlComponent.Item.displayName = 'SegmentedControl.Item';

export type { SegmentedControlProps } from './SegmentedControl';
export type { SegmentedChoiceProps } from './SegmentedChoice';
export { SegmentedControlComponent as SegmentedControl, SegmentedChoice };
