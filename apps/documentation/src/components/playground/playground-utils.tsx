import { useEffect, useState } from 'react';

export type AdvancedProps = {
  type: 'icon' | 'boolean' | 'segmented' | 'string' | 'dropdown' | 'children';
  name: string;
  value: string | boolean;
  defaultValue: string | boolean;
  label?: string;
  options?: string[];
};

export const useAdvancedPlaygroundCode = (
  codeFromMDXInjection: string,
  initialProps: AdvancedProps[],
) => {
  const [codeWithUpdatedProps, setCodeWithUpdatedProps] =
    useState<string>(codeFromMDXInjection);
  const [propsState, setPropsState] = useState(
    initialProps.map(prop => {
      return { ...prop, value: prop.defaultValue };
    }),
  );
  const componentName = /([A-Z][a-z]+)+/.exec(codeFromMDXInjection)?.[0];

  const updatePropState = (name: string, value: string | boolean) => {
    setPropsState(
      propsState.map(prev => (prev.name === name ? { ...prev, value } : prev)),
    );
  };

  useEffect(() => {
    const componentPropsRegex = new RegExp(
      `<([A-Z][a-z]+)+(\\s?>|\\s[\\s\\S]*?>(?!}))`,
    );

    const propStringToInject = propsState
      .map(prop => {
        if (prop.name === 'children' || !prop.value) return '';

        switch (prop.type) {
          case 'icon':
            return ` ${prop.name}={<${prop.value}/>}`;
          case 'boolean':
            return ` ${prop.name}`;
          default:
            return ` ${prop.name}="${prop.value}"`;
        }
      })
      .join('');

    const addChildContentIfAvailable = (codeToFormat: string) => {
      const childrenContent = propsState.find(
        prop => prop.name === 'children',
      )?.value;

      if (!childrenContent) return codeToFormat;

      const regexForChildContent = new RegExp(`>(?!})(([\\W\\w\\s])+)?<`);
      return codeToFormat.replace(regexForChildContent, `>${childrenContent}<`);
    };

    setCodeWithUpdatedProps(prev => {
      const codeWithProps = prev.replace(
        componentPropsRegex,
        `<${componentName}${propStringToInject}>`,
      );
      return addChildContentIfAvailable(codeWithProps);
    });
  }, [propsState, componentName]);

  return {
    codeWithUpdatedProps,
    setCodeWithUpdatedProps,
    propsState,
    updatePropState,
  };
};

export const capitalize = (s: string) => {
  return s && s[0].toUpperCase() + s.slice(1);
};

export const wrapCodeInFragmentIfNecessary = (codeToWrap: string) => {
  if (codeToWrap.startsWith('()') || codeToWrap.startsWith('class'))
    return codeToWrap;
  return `<>${codeToWrap}</>`;
};
