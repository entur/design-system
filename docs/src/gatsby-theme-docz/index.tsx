import React from 'react';
import { theme, ComponentsProvider } from 'docz';
import './index.scss';
import '@entur/fonts/index.css';
import { Location } from '@reach/router';
import Menu from './UI/Menu';

const compomentMap = {};

const Theme = ({ children }) => {
  return (
    <div>
      <ComponentsProvider components={compomentMap}>
        <div className="components-provider-wrapper">
          <Location>
            {({ location }) => (
              <React.Fragment>
                <Menu currentPath={location} />
                <div className="content-wrapper">
                  <div className="content-container">{children}</div>
                </div>
              </React.Fragment>
            )}
          </Location>
        </div>
      </ComponentsProvider>
    </div>
  );
};

export default theme()(Theme);
