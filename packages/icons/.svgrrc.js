module.exports = {
  icon: true,
  replaceAttrValues: {
    '#181E53': 'currentColor',
    '#181C56': 'currentColor',
  },
  svgProps: {
    className: 'entur-icon',
  },
  template(
    { template },
    opts,
    { imports, componentName, props, jsx, exports },
  ) {
    const typeScriptTpl = template.smart({ plugins: ['typescript'] });
    return typeScriptTpl.ast`
    import React, { SVGProps } from 'react';
    const ${componentName} = (props: SVGProps<SVGSVGElement>) => ${jsx};
    export default ${componentName};
  `;
  },
};
