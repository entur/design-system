import React from 'react';
import { SideNavigation, Tag } from '@entur/linje';
import {
  UserIcon,
  ValidTicketIcon,
  HistoryIcon,
  SettingsIcon,
} from '@entur/icons';

export const Default = () => (
  <div style={{ width: 280 }}>
    <SideNavigation>
      <SideNavigation.Item href="#" active>
        Mine reiser
      </SideNavigation.Item>
      <SideNavigation.Item href="#">Billetter</SideNavigation.Item>
      <SideNavigation.Item href="#">Betalingskort</SideNavigation.Item>
      <SideNavigation.Item disabled>Reisekonto</SideNavigation.Item>
    </SideNavigation>
  </div>
);

export const WithIcons = () => (
  <div style={{ width: 280 }}>
    <SideNavigation>
      <SideNavigation.Item href="#" active icon={<UserIcon />}>
        Min profil
      </SideNavigation.Item>
      <SideNavigation.Item href="#" icon={<ValidTicketIcon />}>
        Billetter
      </SideNavigation.Item>
      <SideNavigation.Item href="#" icon={<HistoryIcon />}>
        Kjøpshistorikk
      </SideNavigation.Item>
      <SideNavigation.Item href="#" icon={<SettingsIcon />}>
        Innstillinger
      </SideNavigation.Item>
    </SideNavigation>
  </div>
);

export const Groups = () => (
  <div style={{ width: 280 }}>
    <SideNavigation>
      <SideNavigation.Group title="Min side">
        <SideNavigation.Item href="#" active>
          Oversikt
        </SideNavigation.Item>
        <SideNavigation.Item href="#">Billetter</SideNavigation.Item>
      </SideNavigation.Group>
      <SideNavigation.Group title="Innstillinger">
        <SideNavigation.Item href="#">Varsler</SideNavigation.Item>
        <SideNavigation.Item href="#">Personvern</SideNavigation.Item>
      </SideNavigation.Group>
    </SideNavigation>
  </div>
);

export const ExpandableItem = () => (
  <div style={{ width: 280 }}>
    <SideNavigation>
      <SideNavigation.Item href="#" icon={<UserIcon />}>
        Min profil
      </SideNavigation.Item>
      <SideNavigation.ExpandableItem
        title="Billetter"
        icon={<ValidTicketIcon />}
        defaultOpen
      >
        <SideNavigation.Item href="#" active>
          Aktive billetter
        </SideNavigation.Item>
        <SideNavigation.Item href="#">Periodebilletter</SideNavigation.Item>
        <SideNavigation.Item href="#">Utløpte billetter</SideNavigation.Item>
      </SideNavigation.ExpandableItem>
      <SideNavigation.ExpandableItem
        title="Kjøpshistorikk"
        icon={<HistoryIcon />}
      >
        <SideNavigation.Item href="#">Kvitteringer</SideNavigation.Item>
        <SideNavigation.Item href="#">Refusjoner</SideNavigation.Item>
      </SideNavigation.ExpandableItem>
    </SideNavigation>
  </div>
);

export const BadgeAndAlert = () => (
  <div style={{ width: 280 }}>
    <SideNavigation>
      <SideNavigation.Item href="#" active>
        Reiseplanlegger
      </SideNavigation.Item>
      <SideNavigation.Item
        href="#"
        badge={
          <Tag variant="neutral" size="small">
            Ny
          </Tag>
        }
      >
        Periodebillett
      </SideNavigation.Item>
      <SideNavigation.Item href="#" alert>
        Varsler
      </SideNavigation.Item>
    </SideNavigation>
  </div>
);
