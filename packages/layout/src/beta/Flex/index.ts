import { Flex as FlexParent } from './Flex';
import { FlexSpacer } from './FlexSpacer';

type Flex = typeof FlexParent & {
  /**
   * A spacer element that fills available space in Flex.
   *
   * @example
   * <Flex>
   *   <Button>Left</Button>
   *   <Flex.Spacer />
   *   <Button>Right</Button>
   * </Flex>
   */
  Spacer: typeof FlexSpacer & { displayName?: string };
};

/**
 * A Flex component for organizing content in a flexible layout.
 */
export const FlexComponent: Flex = Object.assign(FlexParent, {
  Spacer: FlexSpacer,
});

FlexComponent.Spacer.displayName = 'Flex.Spacer';

export type { FlexProps, FlexOwnProps, FlexSpacingValue } from './Flex';
export type { FlexSpacerProps, FlexSpacerOwnProps } from './FlexSpacer';
export { FlexComponent as Flex, FlexSpacer };
