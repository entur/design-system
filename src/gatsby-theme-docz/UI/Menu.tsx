import React from 'react';
import { Link } from 'docz';
import { TocNavigation } from 'src/components/TocNavigation';
import { SiteSidebar } from 'src/components/SiteSidebar';
import { NavBarItem } from '@entur/menu';
import './Menu.scss';

export default function Menus() {
  return (
    <>
      <nav className="site-navbar">
        <div className="tab-link-container">
          <NavItem to="/kom-i-gang">Kom i gang</NavItem>
          <NavItem to="/design-prinsipper">Designprinsipper</NavItem>
          <NavItem to="/visuell-identitet">Visuell Identitet</NavItem>
          <NavItem to="/komponenter">Komponenter</NavItem>
        </div>
      </nav>
      <SiteSidebar />
      <nav className="heading-navigator-wrapper">
        <TocNavigation />
      </nav>
    </>
  );
}

type NavItemProps = {
  children: React.ReactNode;
  [key: string]: any;
};
const NavItem: React.FC<NavItemProps> = ({ children, ...rest }) => {
  const [selected, setSelected] = React.useState(false);
  return (
    <NavBarItem
      as={Link}
      selected={selected}
      getProps={({ isPartiallyCurrent }: any) => {
        console.log('Kjøres');
        setSelected(isPartiallyCurrent);
      }}
      {...rest}
    >
      {children}
    </NavBarItem>
  );
};
