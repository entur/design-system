import React from 'react';
import './DoAndDont.scss';

function DoAndDont(props: any) {
  return <div className="do-and-dont-wrapper">{props.children}</div>;
}

type DoProps = {
  image?: string;
  children: React.ReactNode;
};

function Do(props: DoProps) {
  return (
    <div className="do-or-dont-container">
      {props.image && (
        <div className="do-and-dont-image-wrapper">
          <img className="do-and-dont-image-container" src={props.image} />
        </div>
      )}
      <Divider color="green" />
      <div className="do-header">Do</div>
      <div className="do-and-dont-list">{props.children}</div>
    </div>
  );
}

type DontProps = {
  image?: string;
  children: React.ReactNode;
};

function Dont(props: DontProps) {
  return (
    <div className="do-or-dont-container">
      {props.image && (
        <div className="do-and-dont-image-wrapper">
          <img className="do-and-dont-image-container" src={props.image} />
        </div>
      )}
      <Divider color="red" />
      <div className="dont-header">Don't</div>
      <div className="do-and-dont-list">{props.children}</div>
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
