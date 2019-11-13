import React from 'react';
import './ComponentRuler.scss';

type ComponentRulerProps = {
  children: React.ReactNode;
  xName?: string;
  xNumber: string;
  yName?: string;
  yNumber: string;
};

function ComponentRuler(props: ComponentRulerProps) {
  return (
    <div className="component-ruler-container">
      <div className="vertical-ruler-wrapper">
        {props.yName && <div className="yName">{`${props.yName}:`}</div>}
        {props.yNumber && <div className="yNumber">{props.yNumber}</div>}
        <div>
          <div
            className="vertical-ruler-line"
            style={{ height: props.yNumber }}
          />
        </div>
      </div>
      <div className="hortizontal-ruler-wrapper">
        {props.children}
        <div className="horizontal-ruler-container">
          <div
            className="horizontal-ruler-line"
            style={{ width: props.xNumber }}
          />
        </div>
        <div className="horizontal-ruler-information-wrapper">
          {props.xName && <div> {`${props.xName}: `}</div>}
          {props.xNumber && <div>{props.xNumber}</div>}
        </div>
      </div>
    </div>
  );
}

type WrapperProps = {
  children: React.ReactNode;
};

function Wrapper(props: WrapperProps) {
  return <div className="component-ruler-wrapper">{props.children}</div>;
}

ComponentRuler.Wrapper = Wrapper;

export default ComponentRuler;
