import React from 'react';
import './ComponentPresenter.scss';

type ComponentPresenterProps = {
  children: React.ReactNode;
  variantHeader?: string;
  presentationHeader?: string;
};
function ComponentPresenter(props: ComponentPresenterProps): React.ReactNode {
  return (
    <div className="variant-presenter">
      <div className="presenter-header-wrapper presenter-grid">
        <div>{props.variantHeader}</div>
        <div>{props.presentationHeader}</div>
      </div>

      <div className="presenter-grid">{props.children}</div>
    </div>
  );
}

type ComponentProps = {
  children: React.ReactNode;
};
function Component(props: ComponentProps) {
  return <div className="component-presenter">{props.children}</div>;
}

type PresentationProps = {
  children: React.ReactNode;
  header: string;
};
function Presentation(props: PresentationProps) {
  return (
    <div className="presentation-text">
      <div className="presententation-header">{props.header}:</div>
      {props.children}
    </div>
  );
}

ComponentPresenter.Component = Component;
ComponentPresenter.Presentation = Presentation;
export default ComponentPresenter;
