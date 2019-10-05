import React from 'react';
import classNames from 'classnames';
import {
  Playground as DoczPlayground,
  PlaygroundProps as DoczPlaygroundProps,
} from 'docz';
import ToggleSwitch from './ToggleSwitch';
import './Playground.scss';

type PlaygroundProps = {
  defaultContrast?: boolean;
  hideContrastOption?: boolean;
  children: React.ReactNode;
  // These three props are injected by MDX and required by DoczPlayground
  __code: string;
  __position: number;
  __scope: Record<string, any>;
  [key: string]: any;
};

export const Playground: React.FC<PlaygroundProps & DoczPlaygroundProps> = ({
  defaultContrast = false,
  hideContrastOption = false,
  ...playgroundProps
}) => {
  const [isContrast, setContrast] = React.useState(defaultContrast);
  return (
    <>
      <div
        className={classNames('playground', { 'entur-contrast': isContrast })}
      >
        <DoczPlayground {...playgroundProps} />
      </div>
      <div>
        {!hideContrastOption && (
          <ToggleSwitch
            checked={isContrast}
            onChange={() => setContrast(prev => !prev)}
          >
            Kontrast
          </ToggleSwitch>
        )}
      </div>
    </>
  );
};
