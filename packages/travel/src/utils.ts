import React from 'react';

import {
  BusIcon,
  FerryIcon,
  CarferryIcon,
  TramIcon,
  PlaneIcon,
  TrainIcon,
  BicycleIcon,
  MobilityIcon,
  MetroIcon,
  HelicopterIcon,
  FunicularIcon,
  CablewayIcon,
  TaxiIcon,
  WalkIcon,
} from '@entur/icons';

import type { IconProps } from '@entur/icons';

export type Transport =
  | 'metro'
  | 'bus'
  | 'plane'
  | 'helicopter'
  | 'tram'
  | 'funicular'
  | 'cableway'
  | 'taxi'
  | 'bicycle'
  | 'walk'
  | 'train'
  | 'ferry'
  | 'carferry'
  | 'mobility'
  | 'airportLinkBus'
  | 'airportLinkRail'
  | 'rail'
  | 'water'
  | 'air'
  | 'none';

type transportStyleResult = {
  Icon: React.FC<IconProps>;
  backgroundColor?: string;
  contrastBackgroundColor?: string;
  errorBackgroundColor?: string;
  errorTextColor?: string;
  errorContrastTextColor?: string;
  errorContrastBackgroundColor?: string;
  pattern: 'line' | 'wave' | 'dashed' | 'dotted';
  ariaLabel: string;
};

export const getTransportStyle = (mode: string): transportStyleResult => {
  switch (mode) {
    case 'metro':
      return {
        Icon: MetroIcon,
        pattern: 'line',
        ariaLabel: 'T-bane',
      };
    case 'bus':
      return {
        Icon: BusIcon,
        pattern: 'dashed',
        ariaLabel: 'Buss',
      };
    case 'plane':
    case 'air':
      return {
        Icon: PlaneIcon,
        pattern: 'line',
        ariaLabel: 'Fly',
      };
    case 'helicopter':
      return {
        Icon: HelicopterIcon,
        pattern: 'line',
        ariaLabel: 'Helikopter',
      };
    case 'tram':
      return {
        Icon: TramIcon,
        pattern: 'line',
        ariaLabel: 'Trikk',
      };
    case 'funicular':
      return {
        Icon: FunicularIcon,
        pattern: 'line',
        ariaLabel: 'Taubane',
      };
    case 'cableway':
      return {
        Icon: CablewayIcon,
        pattern: 'line',
        ariaLabel: 'Gondol',
      };
    case 'taxi':
      return {
        Icon: TaxiIcon,
        pattern: 'dashed',
        ariaLabel: 'Taxi',
      };
    case 'bicycle':
      return {
        Icon: BicycleIcon,
        pattern: 'dashed',
        ariaLabel: 'Sykkel',
      };
    case 'walk':
      return {
        Icon: WalkIcon,
        pattern: 'dotted',
        ariaLabel: 'Gange',
      };
    case 'train':
    case 'rail':
      return {
        Icon: TrainIcon,
        pattern: 'line',
        ariaLabel: 'Tog',
      };
    case 'ferry':
    case 'water':
      return {
        Icon: FerryIcon,
        pattern: 'wave',
        ariaLabel: 'Ferge',
      };
    case 'carferry':
      return {
        Icon: CarferryIcon,
        pattern: 'wave',
        ariaLabel: 'Bilferge',
      };
    case 'mobility':
      return {
        Icon: MobilityIcon,
        pattern: 'line',
        ariaLabel: 'El-sparkesykkel',
      };
    case 'airportLinkBus':
      return {
        Icon: BusIcon,
        pattern: 'dashed',
        ariaLabel: 'Flybuss',
      };
    case 'airportLinkRail':
      return {
        Icon: TrainIcon,
        pattern: 'line',
        ariaLabel: 'Flytog',
      };
    case 'none':
      return {
        Icon: React.Fragment,
        pattern: 'line',
        ariaLabel: '',
      };
    case 'scooter':
      throw Error(
        `transport type 'scooter' is deprecated: Please use 'mobility' instead.`,
      );
    case 'bike':
      throw Error(
        `transport type 'bike' is deprecated: Please use 'bicycle' instead.`,
      );
    case 'car':
      throw Error(
        `transport type 'car' is deprecated: Please use 'taxi' instead.`,
      );
    case 'foot':
      throw Error(
        `transport type 'foot' is deprecated: Please use 'walk' instead.`,
      );
    default:
      throw Error('Please select a transport for the Travel component.');
  }
};
