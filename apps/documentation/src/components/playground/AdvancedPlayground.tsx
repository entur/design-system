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
import { BaseCard, Contrast } from '@entur/layout';
import { Heading5 } from '@entur/typography';
import {
  AdvancedProps,
  PropsList,
  useAdvancedPlaygroundCode,
} from './playground-utils';
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
  const [isContrast, setContrast] = React.useState(false);
  const [showCode, setShowCode] = React.useState(false);

  const { code, setCode, handleChange } = useAdvancedPlaygroundCode(
    __code,
    props,
  );

  const transformCode = (codeToTransform: string) => {
    if (codeToTransform.startsWith('()') || codeToTransform.startsWith('class'))
      return codeToTransform;
    return `<React.Fragment>${codeToTransform}</React.Fragment>`;
  };

  const icons = { AdjustmentsIcon, BellIcon, DestinationIcon };
  const Element = isContrast ? Contrast : 'div';
  return (
    <LiveProvider
      code={code}
      scope={{ ...scope, ...icons }}
      transformCode={transformCode}
      theme={theme}
    >
      <div className="eds-advanced__wrapper">
        <Element className="eds-advanced__playground">
          <LivePreview
            style={style}
            className="eds-advanced__playground-live-preview"
          ></LivePreview>
        </Element>
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
