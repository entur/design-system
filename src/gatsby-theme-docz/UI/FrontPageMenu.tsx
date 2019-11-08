import React from 'react';
import { Link } from 'docz';
import LogoDark from '~/components/logoDark.svg';
import './FrontPageMenu.scss';

function FrontPageMenu() {
  return (
    <nav className="frontpage-menu-navbar">
      <Link to="/" className="frontpage--logo">
        <img src={LogoDark} alt="Entur logo" />
      </Link>
      <div className="frontpage-tab-link-container">
        <Link className="tab-link" to="/kom-i-gang">
          Kom i gang
        </Link>
        <Link className="tab-link" to="/design-prinsipper">
          Designprinsipper
        </Link>
        <Link className="tab-link" to="/visuell-identitet">
          Visuell Identitet
        </Link>
        <Link className="tab-link" to="/komponenter">
          Komponenter
        </Link>
      </div>
    </nav>
  );
}

export default FrontPageMenu;
