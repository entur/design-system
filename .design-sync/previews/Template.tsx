import React from 'react';
import {
  Template,
  SideNavigation,
  Heading,
  Text,
  Tag,
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
  BulletBadge,
} from '@entur/linje';
import { UserIcon } from '@entur/icons';

const frame: React.CSSProperties & Record<string, string> = {
  '--eds-viewport-height': '560px',
  border: '1px solid var(--colors-greys-grey80, #e3e6e8)',
};

const Logo = () => (
  <Template.Portal.Sidebar.Logo>
    <Text variant="label" weight="bold" size="lg">
      Entur Partner
    </Text>
  </Template.Portal.Sidebar.Logo>
);

const User = () => (
  <Template.Portal.Sidebar.User>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-small)',
      }}
    >
      <UserIcon aria-hidden />
      <Text variant="subparagraph">Kari Nordmann</Text>
    </div>
  </Template.Portal.Sidebar.User>
);

const Nav = () => (
  <Template.Portal.Sidebar.Navigation>
    <SideNavigation>
      <SideNavigation.Item href="#" active>
        Oversikt
      </SideNavigation.Item>
      <SideNavigation.Item href="#">Billettsalg</SideNavigation.Item>
      <SideNavigation.Item href="#">Stoppesteder</SideNavigation.Item>
      <SideNavigation.Item href="#">Avvik</SideNavigation.Item>
      <SideNavigation.Item href="#">Rapporter</SideNavigation.Item>
    </SideNavigation>
  </Template.Portal.Sidebar.Navigation>
);

const MainContent = () => (
  <>
    <Heading as="h1" variant="title-2">
      Oversikt
    </Heading>
    <Text variant="paragraph">Avganger fra Oslo S de neste 30 minuttene.</Text>
    <Table>
      <TableHead>
        <TableRow>
          <HeaderCell>Avgang</HeaderCell>
          <HeaderCell>Linje</HeaderCell>
          <HeaderCell>Til</HeaderCell>
          <HeaderCell>Status</HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <DataCell>14:32</DataCell>
          <DataCell>F4</DataCell>
          <DataCell>Bergen</DataCell>
          <DataCell>
            <BulletBadge variant="success">I rute</BulletBadge>
          </DataCell>
        </TableRow>
        <TableRow>
          <DataCell>14:41</DataCell>
          <DataCell>R10</DataCell>
          <DataCell>Lillehammer</DataCell>
          <DataCell>
            <BulletBadge variant="warning">Forsinket</BulletBadge>
          </DataCell>
        </TableRow>
        <TableRow>
          <DataCell>14:50</DataCell>
          <DataCell>L2</DataCell>
          <DataCell>Ski</DataCell>
          <DataCell>
            <BulletBadge variant="negative">Innstilt</BulletBadge>
          </DataCell>
        </TableRow>
      </TableBody>
    </Table>
  </>
);

export const Default = () => (
  <Template.Portal style={frame}>
    <Template.Portal.Sidebar>
      <Logo />
      <User />
      <Nav />
      <Template.Portal.Sidebar.Footer>
        <Text variant="caption">Versjon 5.1.1</Text>
      </Template.Portal.Sidebar.Footer>
    </Template.Portal.Sidebar>
    <Template.Portal.Main>
      <MainContent />
    </Template.Portal.Main>
  </Template.Portal>
);

export const WithStatusBar = () => (
  <Template.Portal style={frame}>
    <Template.Portal.StatusBar>
      <div
        style={{
          background: 'var(--colors-brand-peach)',
          padding: 'var(--space-extra-small) var(--space-default)',
          display: 'flex',
          gap: 'var(--space-small)',
          alignItems: 'center',
        }}
      >
        <Tag size="small" variant="warning">
          Testmiljø
        </Tag>
        <Text variant="subparagraph" as="span">
          Du er logget inn i staging
        </Text>
      </div>
    </Template.Portal.StatusBar>
    <Template.Portal.Sidebar>
      <Logo />
      <Nav />
    </Template.Portal.Sidebar>
    <Template.Portal.Main>
      <MainContent />
    </Template.Portal.Main>
  </Template.Portal>
);

export const CollapsibleSidebar = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <Template.Portal style={frame}>
      <Template.Portal.Sidebar
        collapsed={collapsed}
        onCollapseToggle={setCollapsed}
      >
        <Logo />
        <User />
        <Nav />
      </Template.Portal.Sidebar>
      <Template.Portal.Main>
        <MainContent />
      </Template.Portal.Main>
    </Template.Portal>
  );
};

export const LightSidebar = () => (
  <Template.Portal style={frame}>
    <Template.Portal.Sidebar contrast={false}>
      <Logo />
      <Nav />
    </Template.Portal.Sidebar>
    <Template.Portal.Main>
      <MainContent />
    </Template.Portal.Main>
  </Template.Portal>
);
