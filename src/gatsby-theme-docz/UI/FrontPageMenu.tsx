import React from 'react';
import { Link } from 'docz';
<<<<<<< HEAD:src/gatsby-theme-docz/UI/FrontPageMenu.tsx
import LogoDark from '~/components/logoDark.svg';
=======
import { NavBarItem } from '@entur/menu';
import LogoDark from 'src/components/logoDark.svg';
>>>>>>> fix(NavBarItem): proper usage of navbaritem in docs:docs/src/gatsby-theme-docz/UI/FrontPageMenu.tsx
import './FrontPageMenu.scss';

function FrontPageMenu() {
  return (
    <nav className="frontpage-menu-navbar">
      <Link to="/" className="frontpage--logo">
        <img src={LogoDark} alt="Entur logo" />
      </Link>
      <div className="frontpage-tab-link-container">
        <NavBarItem as={Link} to="/kom-i-gang">
          Kom i gang
        </NavBarItem>
        <NavBarItem as={Link} to="/design-prinsipper">
          Designprinsipper
        </NavBarItem>
        <NavBarItem as={Link} to="/visuell-identitet">
          Visuell Identitet
        </NavBarItem>
        <NavBarItem as={Link} to="/komponenter">
          Komponenter
        </NavBarItem>
      </div>
    </nav>
  );
}

export default FrontPageMenu;
