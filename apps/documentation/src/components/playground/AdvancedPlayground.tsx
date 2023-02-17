/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import classNames from 'classnames';
import { LiveEditor, LivePreview, LiveProvider } from 'react-live';
import { BaseExpand } from '@entur/expand';
import { Switch } from '@entur/form';
import {
  SourceCodeIcon,
  AdjustmentsIcon,
  BellIcon,
  DestinationIcon,
} from '@entur/icons';
import { BaseCard } from '@entur/layout';
import { Heading5 } from '@entur/typography';
import { AdvancedProps, PropsList } from './playground-utils';
// @ts-expect-error mangler typer for theme-fil
import theme from './themeForPlayground';
import './AdvancedPlayground.scss';

type AdvancedPlaygroundProps = {
  props: AdvancedProps[];
  [key: string]: any;
};

export const AdvancedPlayground: React.FC<AdvancedPlaygroundProps> = ({
  props,
  code: __code,
  scope,
  style,
}) => {
  const componentName = /([A-Z][a-z]+)+/.exec(__code)[0];

  const [isContrast, setContrast] = React.useState(false);
  const [code, setCode] = React.useState<string>(__code);
  const [showCode, setShowCode] = React.useState(false);
  const [propState, setPropState] = React.useState(
    props.map(p => {
      const name = p.name;
      const df = p.defaultValue;
      return { [name]: df };
    }),
  );

  const handleChange = (name, value) => {
    const prevState = propState;
    setPropState(
      prevState.map(prev => {
        return Object.keys(prev)[0] === name ? { [name]: value } : prev;
      }),
    );
  };

  React.useEffect(() => {
    const FormatChildren = (code: string) => {
      const childrenContent = propState.find(prop => prop['children']);

      if (childrenContent) {
        // Regex for alle typer innhold til children
        const childrenRegex = new RegExp(`>(?!})(([\\W\\w\\s])+)?<`);
        // console.log(childrenRegex.exec(code));

        return code.replace(
          childrenRegex,
          `>${childrenContent?.children ? childrenContent.children : ''}<`,
        );
      } else {
        return code;
      }
    };
    const pattern = `<([A-Z][a-z]+)+(\\s?>|\\s[\\s\\S]*?>(?!}))`;
    const componentPropsRegex = new RegExp(pattern);
    const propString = Object.entries(props)
      .reduce((accumulator, [, value]) => {
        if (value.name === 'children') {
          return accumulator;
        }
        const thisone = propState.find(prop => {
          return prop[value.name];
        });

        if (value.type === 'icon' && thisone !== undefined) {
          return `${accumulator} ${value.name}={<${thisone[value.name]}/>}`;
        }
        if (value.type === 'boolean' && thisone !== undefined) {
          return `${accumulator} ${value.name}`;
        }
        if (thisone !== undefined) {
          return `${accumulator} ${value.name}="${thisone[value.name]}"`;
        }
        return accumulator;
      }, '')
      .concat('');

    setCode(prev => {
      const codeWithProps = prev.replace(
        componentPropsRegex,
        `<${componentName}${propString}>`,
      );
      return FormatChildren(codeWithProps);
    });
  }, [propState]);

  const transformCode = (codeToTransform: string) => {
    if (codeToTransform.startsWith('()') || codeToTransform.startsWith('class'))
      return codeToTransform;
    return `<React.Fragment>${codeToTransform}</React.Fragment>`;
  };

  const icons = { AdjustmentsIcon, BellIcon, DestinationIcon };
  return (
    <LiveProvider
      code={code}
      scope={{ ...scope, ...icons }}
      transformCode={transformCode}
      theme={theme}
    >
      <div className="eds-advanced__wrapper">
        <div
          className={classNames('eds-advanced__playground', {
            'eds-contrast': isContrast,
          })}
        >
          <LivePreview
            style={style}
            className="eds-advanced__playground-live-preview"
          ></LivePreview>
        </div>
        <Switch
          className={classNames('eds-advanced__contrast-switch', {
            'eds-contrast': isContrast,
          })}
          name="contrast"
          checked={isContrast}
          onChange={() => setContrast(prev => !prev)}
        >
          Contrast
        </Switch>
        <div className="eds-advanced__props">
          <Heading5 as="div" margin="bottom">
            Props
          </Heading5>
          <PropsList props={props} handleChange={handleChange} />
        </div>
      </div>
      <div className="eds-advanced__show-code-wrapper">
        <BaseCard className="eds-advanced__show-code">
          <button
            className="eds-advanced__show-code-button"
            onClick={() => setShowCode(prev => !prev)}
          >
            <SourceCodeIcon /> Vis kode
          </button>
          <div style={{ width: '100%' }}>
            <BaseExpand open={showCode}>
              <LiveEditor
                className="eds-advanced__code"
                onChange={updatedCode => setCode(updatedCode)}
              ></LiveEditor>
            </BaseExpand>
          </div>
        </BaseCard>
      </div>
    </LiveProvider>
  );
};
