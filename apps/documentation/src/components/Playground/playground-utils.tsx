import { useEffect, useState } from 'react';

export type AdvancedProps = {
  type: 'icon' | 'boolean' | 'segmented' | 'string' | 'dropdown' | 'children';
  name: string;
  value: string | boolean;
  defaultValue: string | boolean;
  label?: string;
  options?: string[];
};

export type InitialAdvancedProp = Omit<AdvancedProps, 'value'>;

export const useAdvancedPlaygroundCode = (
  codeFromMDXInjection: string,
  initialProps?: InitialAdvancedProp[],
) => {
  const [codeWithUpdatedProps, setCodeWithUpdatedProps] =
    useState<string>(codeFromMDXInjection);
  const [propsState, setPropsState] = useState<AdvancedProps[] | undefined>(
    initialProps?.map(prop => {
      return { ...prop, value: prop.defaultValue };
    }),
  );
  const componentName = /([A-Z][a-z]+)+/.exec(codeFromMDXInjection)?.[0];

  const updatePropState = (name: string, value: string | boolean) => {
    setPropsState(
      propsState?.map(prev => (prev.name === name ? { ...prev, value } : prev)),
    );
  };

  useEffect(() => {
    if (!initialProps) return;
    const componentPropsRegex = new RegExp(
      `<([A-Z][a-z]+)+(\\s?>|\\s[\\s\\S]*?>(?!}))`,
    );

    const propStringToInject = propsState
      ?.map(prop => {
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
      const childrenContent = propsState?.find(
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
  }, [propsState, componentName, initialProps]);

  return {
    codeWithUpdatedProps,
    setCodeWithUpdatedProps,
    propsState,
    updatePropState,
    componentName,
  };
};

export const capitalize = (s: string) => {
  return s && s[0].toUpperCase() + s.slice(1);
};

// react-live can't run import statements, and every component is already in
// scope, so the imports at the top of a snippet are only shown in the editor
// and stripped before running.
const LEADING_IMPORTS =
  /^(?:\s*import\s+(?:[^;'"]*?\s+from\s+)?['"][^'"]+['"];?)+/;

export const wrapCodeInFragmentIfNecessary = (code: string) => {
  const codeToWrap = code.replace(LEADING_IMPORTS, '').trim();
  if (codeToWrap.startsWith('()') || codeToWrap.startsWith('class'))
    return codeToWrap;
  return `<>${codeToWrap}</>`;
};
