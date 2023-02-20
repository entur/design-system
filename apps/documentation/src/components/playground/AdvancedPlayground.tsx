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
  useAdvancedPlaygroundCode,
  wrapCodeInFragmentIfNecessary,
} from './playground-utils';
import { PropsList } from './PropsList';
// @ts-expect-error mangler typer for theme-fil
import theme from './themeForPlayground';
import type { AdvancedProps } from './playground-utils';

import './AdvancedPlayground.scss';

type AdvancedPlaygroundProps = {
  code: string;
  scope: Record<string, any>;
  props: AdvancedProps[];
  [key: string]: any;
};

export const AdvancedPlayground: React.FC<AdvancedPlaygroundProps> = ({
  props,
  code: codeFromMDXInjection,
  scope,
  style,
}) => {
  const [isContrast, setContrast] = React.useState(false);
  const [showCode, setShowCode] = React.useState(false);

  const {
    codeWithUpdatedProps,
    setCodeWithUpdatedProps,
    propsState,
    updatePropState,
  } = useAdvancedPlaygroundCode(codeFromMDXInjection, props);

  // Icons need to be included in scope to be accessible in LivePreview
  const icons = { AdjustmentsIcon, BellIcon, DestinationIcon };
  const Element = isContrast ? Contrast : 'div';
  return (
    <LiveProvider
      code={codeWithUpdatedProps}
      scope={{ ...scope, ...icons }}
      transformCode={wrapCodeInFragmentIfNecessary}
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
          <PropsList
            propsState={propsState}
            updatePropState={updatePropState}
          />
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
                onChange={updatedCode => setCodeWithUpdatedProps(updatedCode)}
              ></LiveEditor>
            </BaseExpand>
          </div>
        </BaseCard>
      </div>
    </LiveProvider>
  );
};
