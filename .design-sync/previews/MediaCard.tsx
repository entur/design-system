import React from 'react';
import { MediaCard } from '@entur/linje';

const landscape = (sky: string, hill: string, hill2: string, vehicle: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice">
      <rect width="480" height="300" fill="${sky}"/>
      <circle cx="380" cy="70" r="34" fill="#ffd66e"/>
      <path d="M0 190 L90 110 L170 180 L260 90 L360 190 L480 120 L480 300 L0 300 Z" fill="${hill2}"/>
      <path d="M0 230 Q120 180 240 220 T480 210 L480 300 L0 300 Z" fill="${hill}"/>
      <rect x="0" y="246" width="480" height="6" fill="#2a2a4a"/>
      <rect x="150" y="206" width="160" height="40" rx="10" fill="${vehicle}"/>
      <rect x="166" y="214" width="26" height="16" rx="3" fill="#e6f3ff"/>
      <rect x="200" y="214" width="26" height="16" rx="3" fill="#e6f3ff"/>
      <rect x="234" y="214" width="26" height="16" rx="3" fill="#e6f3ff"/>
      <rect x="268" y="214" width="30" height="16" rx="3" fill="#e6f3ff"/>
    </svg>`,
  );

const mountains = landscape('#bfe3f5', '#4f9a6a', '#7b8fa8', '#c5044e');
const fjord = landscape('#9fd0ea', '#1c6d8f', '#5d7f96', '#ffffff');
const valley = landscape('#fde2d4', '#6fae7c', '#9aa6c0', '#0b3b82');

export const Default = () => (
  <MediaCard
    title="Hva gjør Entur?"
    description="Entur eier og styrer salgssystemet for togbilletter og samler data om kollektivtrafikken i Norge."
    category="Transport"
    href="#"
    style={{ width: 340 }}
  >
    <img src={mountains} alt="Buss som kjører gjennom fjellandskap" />
  </MediaCard>
);

export const Horizontal = () => (
  <MediaCard
    title="Nye fergeruter på Vestlandet"
    description="Fra 1. januar kan du kjøpe billett til flere fergesamband direkte i Entur-appen."
    category="Nyheter"
    orientation="horizontal"
    hideArrow
    href="#"
    style={{ width: 620 }}
  >
    <img src={fjord} alt="Ferge på fjorden" />
  </MediaCard>
);

export const TitleOnly = () => (
  <MediaCard
    title="Slik kjøper du billett i appen"
    href="#"
    style={{ width: 300 }}
  >
    <img src={valley} alt="Tog gjennom dalen" />
  </MediaCard>
);
