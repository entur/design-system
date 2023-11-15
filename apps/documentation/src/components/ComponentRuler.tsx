import React from 'react';
import './ComponentRuler.scss';

type ComponentRulerProps = {
  children: React.ReactNode;
  xName?: string;
  xNumber: string;
  yName?: string;
  yNumber: string;
};

function ComponentRuler(props: ComponentRulerProps): React.ReactNode {
  return (
    <div className="component-ruler-container">
      <div className="hortizontal-ruler-wrapper">
        {props.children}
        <div className="horizontal-ruler-container">
          <div
            className="horizontal-ruler-line"
            style={{ width: props.xNumber }}
          />
        </div>
        <div className="horizontal-ruler-information-wrapper">
          <div>{`${props?.xName ? props.xName + ': ' : ''}${
            props?.xNumber
          }`}</div>
        </div>
      </div>
      <div className="vertical-ruler-wrapper">
        <div>
          <div
            className="vertical-ruler-line"
            style={{ height: props.yNumber }}
          />
        </div>
      </div>
      <div>{`${props?.yName ? props.yName + ': ' : ''}${props?.yNumber}`}</div>
    </div>
  );
}

type WrapperProps = {
  children: React.ReactNode;
  direction: 'vertical' | 'horizontal';
};

function Wrapper(props: WrapperProps) {
  return (
    <div
      className={`component-ruler-wrapper component-ruler-wrapper--${props.direction}`}
    >
      {props.children}
    </div>
  );
}

ComponentRuler.Wrapper = Wrapper;

export default ComponentRuler;
