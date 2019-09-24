import React from 'react';
import './DoAndDont.scss';

type DoAndDontProps = {
  doPicture: string;
  doList: string[];
  dontPicture: string;
  dontList: string[];
};

function DoAndDont(props: DoAndDontProps) {
  return (
    <div className="do-and-dont-wrapper">
      <div className="do-or-dont-container">
        <div className="do-and-dont-image-wrapper">
          <img className="do-and-dont-image-container" src={props.doPicture} />
        </div>
        <Divider color="green" />
        <div className="do-header">Do</div>
        <ul className="do-and-dont-list">
          {props.doList.map((doElement, index) => (
            <li key={index}>{doElement}</li>
          ))}
        </ul>
      </div>
      <div className="do-or-dont-container">
        <div className="do-and-dont-image-wrapper">
          <img
            className="do-and-dont-image-container"
            src={props.dontPicture}
          />
        </div>
        <Divider color="red" />
        <div className="dont-header">Don't</div>
        <ul className="do-and-dont-list">
          {props.dontList.map((dontElement, index) => (
            <li key={index}>{dontElement}</li>
          ))}
        </ul>
      </div>
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

export default DoAndDont;
