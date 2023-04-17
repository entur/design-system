import React from 'react';
import { colors } from '@entur/tokens';
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
  backgroundColor: string;
  textColor: string;
  contrastBackgroundColor: string;
  contrastTextColor: string;
  pattern: 'line' | 'wave' | 'dashed' | 'dotted';
  ariaLabel: string;
};

export const getTransportStyle = (mode: string): transportStyleResult => {
  switch (mode) {
    case 'metro':
      return {
        Icon: MetroIcon,
        backgroundColor: colors.transport.default.metro,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.metro,
        contrastTextColor: colors.brand.white,
        pattern: 'line',
        ariaLabel: 'T-bane',
      };
    case 'bus':
      return {
        Icon: BusIcon,
        backgroundColor: colors.transport.default.bus,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.bus,
        contrastTextColor: colors.brand.white,
        pattern: 'dashed',
        ariaLabel: 'Buss',
      };
    case 'plane':
    case 'air':
      return {
        Icon: PlaneIcon,
        backgroundColor: colors.transport.default.plane,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.plane,
        contrastTextColor: colors.brand.white,
        pattern: 'line',
        ariaLabel: 'Fly',
      };
    case 'helicopter':
      return {
        Icon: HelicopterIcon,
        backgroundColor: colors.transport.default.helicopter,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.helicopter,
        contrastTextColor: colors.brand.white,
        pattern: 'line',
        ariaLabel: 'Helikopter',
      };
    case 'tram':
      return {
        Icon: TramIcon,
        backgroundColor: colors.transport.default.tram,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.tram,
        contrastTextColor: colors.brand.white,
        pattern: 'line',
        ariaLabel: 'Trikk',
      };
    case 'funicular':
      return {
        Icon: FunicularIcon,
        backgroundColor: colors.transport.default.funicular,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.funicular,
        contrastTextColor: colors.brand.white,
        pattern: 'line',
        ariaLabel: 'Taubane',
      };
    case 'cableway':
      return {
        Icon: CablewayIcon,
        backgroundColor: colors.transport.default.cableway,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.cableway,
        contrastTextColor: colors.brand.white,
        pattern: 'line',
        ariaLabel: 'Gondol',
      };
    case 'taxi':
      return {
        Icon: TaxiIcon,
        backgroundColor: colors.transport.default.taxi,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.taxi,
        contrastTextColor: colors.brand.white,
        pattern: 'dashed',
        ariaLabel: 'Taxi',
      };
    case 'bicycle':
      return {
        Icon: BicycleIcon,
        backgroundColor: colors.transport.default.bicycle,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.bicycle,
        contrastTextColor: colors.brand.white,
        pattern: 'line',
        ariaLabel: 'Sykkel',
      };
    case 'walk':
      return {
        Icon: WalkIcon,
        backgroundColor: colors.transport.default.walk,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.walk,
        contrastTextColor: colors.brand.white,
        pattern: 'dotted',
        ariaLabel: 'Gange',
      };
    case 'train':
    case 'rail':
      return {
        Icon: TrainIcon,
        backgroundColor: colors.transport.default.train,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.train,
        contrastTextColor: colors.brand.white,
        pattern: 'line',
        ariaLabel: 'Tog',
      };
    case 'ferry':
    case 'water':
      return {
        Icon: FerryIcon,
        backgroundColor: colors.transport.default.ferry,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.ferry,
        contrastTextColor: colors.brand.white,
        pattern: 'wave',
        ariaLabel: 'Ferge',
      };
    case 'carferry':
      return {
        Icon: CarferryIcon,
        backgroundColor: colors.transport.default.carferry,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.carferry,
        contrastTextColor: colors.brand.white,
        pattern: 'wave',
        ariaLabel: 'Bilferge',
      };
    case 'mobility':
      return {
        Icon: MobilityIcon,
        backgroundColor: colors.transport.default.mobility,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.mobility,
        contrastTextColor: colors.brand.white,
        pattern: 'line',
        ariaLabel: 'El-sparkesykkel',
      };
    case 'airportLinkBus':
      return {
        Icon: BusIcon,
        backgroundColor: colors.transport.default.plane,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.plane,
        contrastTextColor: colors.brand.white,
        pattern: 'dashed',
        ariaLabel: 'Flybuss',
      };
    case 'airportLinkRail':
      return {
        Icon: TrainIcon,
        backgroundColor: colors.transport.default.plane,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.transport.contrast.plane,
        contrastTextColor: colors.brand.white,
        pattern: 'line',
        ariaLabel: 'Flytog',
      };
    case 'none':
      return {
        Icon: React.Fragment,
        backgroundColor: colors.brand.blue,
        textColor: colors.brand.white,
        contrastBackgroundColor: colors.brand.white,
        contrastTextColor: colors.brand.white,
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
