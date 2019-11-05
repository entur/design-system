import React from 'react';
import { Link } from 'docz';
import classNames from 'classnames';
import LogoDark from 'src/components/logoDark.svg';
// import LandingIllustration from 'src/content/visuell-identitet/illustrations/Landingssider/2250x580_Partner Dialog.jpg':
import './FrontPageMenu.scss';
const getLinkProps = ({ isPartiallyCurrent }: any) => ({
  className: classNames('tab-link', {
    'active-tab-link': isPartiallyCurrent,
  }),
});

function FrontPageMenu() {
  return (
    <nav className="frontpage-menu-navbar">
      <Link to="/" className="frontpage--logo">
        <img src={LogoDark} alt="Entur logo" />
      </Link>
      <div className="frontpage-tab-link-container">
        <Link to="/kom-i-gang" getProps={getLinkProps}>
          Kom i gang
        </Link>
        <Link to="/design-prinsipper" getProps={getLinkProps}>
          Designprinsipper
        </Link>
        <Link to="/visuell-identitet" getProps={getLinkProps}>
          Visuell Identitet
        </Link>
        <Link to="/komponenter" getProps={getLinkProps}>
          Komponenter
        </Link>
      </div>
    </nav>
  );
}

export default FrontPageMenu;
