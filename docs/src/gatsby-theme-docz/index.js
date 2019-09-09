import React from 'react';
import { theme, ComponentsProvider } from 'docz';
import './index.scss';
import '@entur/fonts/index.css';
import TabMenu from './UI/TabMenu';
import { Location } from '@reach/router';

const compomentMap = {};

const Theme = ({ children }) => {
  return (
    <div>
      <ComponentsProvider components={compomentMap}>
        <div className="components-provider-wrapper">
          <Location>
            {({ location }) => (
              <React.Fragment>
                <TabMenu currentPath={location.pathname} />
                <div className="content-wrapper">
                  <div className="content-container">{children}</div>
                </div>
              </React.Fragment>
            )}
          </Location>
        </div>
      </ComponentsProvider>
      ;
    </div>
  );
};

export default theme()(Theme);
