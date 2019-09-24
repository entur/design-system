import React from 'react';
import './DoAndDont.scss';

function DoAndDont(props: any) {
  return <div className="do-and-dont-wrapper">{props.children}</div>;
}

type DoProps = {
  doPicture: string;
  children: React.ReactNode;
};

function Do(props: DoProps) {
  return (
    <div className="do-or-dont-container">
      <div className="do-and-dont-image-wrapper">
        <img className="do-and-dont-image-container" src={props.doPicture} />
      </div>
      <Divider color="green" />
      <div className="do-header">Do</div>
      <ul className="do-and-dont-list">{props.children}</ul>
    </div>
  );
}

type DontProps = {
  dontPicture: string;
  children: React.ReactNode;
};

function Dont(props: DontProps) {
  return (
    <div className="do-or-dont-container">
      <div className="do-and-dont-image-wrapper">
        <img className="do-and-dont-image-container" src={props.dontPicture} />
      </div>
      <Divider color="red" />
      <div className="dont-header">Don't</div>
      <ul className="do-and-dont-list">{props.children}</ul>
    </div>
  );
}

function Divider(props: any) {
  return (
    <div
      className={`do-and-dont-divider do-and-dont-divider--${props.color}`}
    />
  );
}

DoAndDont.Do = Do;
DoAndDont.Dont = Dont;

export default DoAndDont;
