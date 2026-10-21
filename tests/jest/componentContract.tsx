import React from 'react';
import { RenderResult, render } from '@testing-library/react';

type ContractProps = Record<string, unknown>;

export type ComponentContractOptions = {
  /** Renders the component with the given extra props merged in. */
  render: (props: ContractProps) => React.ReactElement;
  /** Returns the element that receives className, style, rest props and ref. */
  getElement: (result: RenderResult) => HTMLElement;
  /** The component's own BEM class, checked to survive a consumer className. */
  baseClassName?: string;
  /** Element constructor the forwarded ref resolves to. Omit to skip the ref check. */
  refElement?: abstract new () => HTMLElement;
  /** Tag name rendered by `as`. Omit to skip the polymorphic check. */
  as?: keyof JSX.IntrinsicElements;
  /** Skip the `style` check for components that own their inline style. */
  style?: boolean;
};

/**
 * Checks the props every consumer relies on: className merging, style and
 * rest-prop forwarding, ref forwarding and the polymorphic `as` prop.
 */
export function describeComponentContract(
  name: string,
  {
    render: renderComponent,
    getElement,
    baseClassName,
    refElement,
    as,
    style = true,
  }: ComponentContractOptions,
) {
  describe(`${name} component contract`, () => {
    test('merges a consumer className with its own classes', () => {
      const element = getElement(
        render(renderComponent({ className: 'consumer-class' })),
      );
      expect(element).toHaveClass('consumer-class');
      if (baseClassName) expect(element).toHaveClass(baseClassName);
    });

    test('forwards rest props', () => {
      const element = getElement(
        render(renderComponent({ 'data-consumer': 'value' })),
      );
      expect(element).toHaveAttribute('data-consumer', 'value');
    });

    if (style) {
      test('forwards style', () => {
        const element = getElement(
          render(renderComponent({ style: { marginTop: '7px' } })),
        );
        expect(element).toHaveStyle({ marginTop: '7px' });
      });
    }

    if (refElement) {
      test('forwards ref to the rendered element', () => {
        const ref = React.createRef<HTMLElement>();
        const element = getElement(render(renderComponent({ ref })));
        expect(ref.current).toBeInstanceOf(refElement);
        expect(ref.current).toBe(element);
      });
    }

    if (as) {
      test(`renders as <${as}> through the as prop`, () => {
        const element = getElement(render(renderComponent({ as })));
        expect(element.tagName.toLowerCase()).toBe(as);
      });
    }
  });
}
