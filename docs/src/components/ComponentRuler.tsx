import React, { Component } from 'react';
import './ComponentRuler.scss';

type ComponentRulerProps = {
  children: React.ReactNode;
  xName?: string;
  xNumber?: string;
  yName?: string;
  yNumber?: string;
};

function ComponentRuler(props: ComponentRulerProps) {
  return (
    <div className="ruler-container">
      <div className="y-ruler-wrapper">
        {props.yName && <div className="yName">{`${props.yName}:`}</div>}
        {props.yNumber && <div className="yNumber">{props.yNumber}</div>}
        <div>
          <div className="ruler-mask hortizontal-end" />
          <div
            className="ruler-mask y-ruler-line"
            style={{ height: props.yNumber }}
          />
          <div className="ruler-mask hortizontal-end" />
        </div>
      </div>
      <div className="x-ruler-wrapper">
        {props.children}
        <div className="x-ruler">
          <div className="ruler-mask vertical-end" />
          <div
            className="ruler-mask x-ruler-line"
            style={{ width: props.xNumber }}
          />
          <div className="ruler-mask vertical-end" />
        </div>
        <div className="x-info-wrapper">
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
  return <div className="ruler-wrapper">{props.children}</div>;
}

ComponentRuler.Wrapper = Wrapper;

export default ComponentRuler;
