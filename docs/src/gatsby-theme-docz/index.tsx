import React from 'react';
import { theme, ComponentsProvider } from 'docz';
import './index.scss';
import '@entur/fonts/index.css';
import Menu from './UI/Menu';

const compomentMap = {};

const Theme = ({ children }) => {
  return (
    <div>
      <ComponentsProvider components={compomentMap}>
        <div className="components-provider-wrapper">
          <Menu />
          <div className="content-wrapper">
            <div className="content-container">{children}</div>
          </div>
        </div>
      </ComponentsProvider>
    </div>
  );
};

export default theme()(Theme);
