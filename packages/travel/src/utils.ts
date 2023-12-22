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
  contrastBackgroundColor: string;
  pattern: 'line' | 'wave' | 'dashed' | 'dotted';
  ariaLabel: string;
};

export const getTransportStyle = (mode: string): transportStyleResult => {
  switch (mode) {
    case 'metro':
      return {
        Icon: MetroIcon,
        backgroundColor: colors.transport.default.metro,
        contrastBackgroundColor: colors.transport.contrast.metro,
        pattern: 'line',
        ariaLabel: 'T-bane',
      };
    case 'bus':
      return {
        Icon: BusIcon,
        backgroundColor: colors.transport.default.bus,
        contrastBackgroundColor: colors.transport.contrast.bus,
        pattern: 'dashed',
        ariaLabel: 'Buss',
      };
    case 'plane':
    case 'air':
      return {
        Icon: PlaneIcon,
        backgroundColor: colors.transport.default.plane,
        contrastBackgroundColor: colors.transport.contrast.plane,
        pattern: 'line',
        ariaLabel: 'Fly',
      };
    case 'helicopter':
      return {
        Icon: HelicopterIcon,
        backgroundColor: colors.transport.default.helicopter,
        contrastBackgroundColor: colors.transport.contrast.helicopter,
        pattern: 'line',
        ariaLabel: 'Helikopter',
      };
    case 'tram':
      return {
        Icon: TramIcon,
        backgroundColor: colors.transport.default.tram,
        contrastBackgroundColor: colors.transport.contrast.tram,
        pattern: 'line',
        ariaLabel: 'Trikk',
      };
    case 'funicular':
      return {
        Icon: FunicularIcon,
        backgroundColor: colors.transport.default.funicular,
        contrastBackgroundColor: colors.transport.contrast.funicular,
        pattern: 'line',
        ariaLabel: 'Taubane',
      };
    case 'cableway':
      return {
        Icon: CablewayIcon,
        backgroundColor: colors.transport.default.cableway,
        contrastBackgroundColor: colors.transport.contrast.cableway,
        pattern: 'line',
        ariaLabel: 'Gondol',
      };
    case 'taxi':
      return {
        Icon: TaxiIcon,
        backgroundColor: colors.transport.default.taxi,
        contrastBackgroundColor: colors.transport.contrast.taxi,
        pattern: 'dashed',
        ariaLabel: 'Taxi',
      };
    case 'bicycle':
      return {
        Icon: BicycleIcon,
        backgroundColor: colors.transport.default.bicycle,
        contrastBackgroundColor: colors.transport.contrast.bicycle,
        pattern: 'line',
        ariaLabel: 'Sykkel',
      };
    case 'walk':
      return {
        Icon: WalkIcon,
        backgroundColor: colors.transport.default.walk,
        contrastBackgroundColor: colors.transport.contrast.walk,
        pattern: 'dotted',
        ariaLabel: 'Gange',
      };
    case 'train':
    case 'rail':
      return {
        Icon: TrainIcon,
        backgroundColor: colors.transport.default.train,
        contrastBackgroundColor: colors.transport.contrast.train,
        pattern: 'line',
        ariaLabel: 'Tog',
      };
    case 'ferry':
    case 'water':
      return {
        Icon: FerryIcon,
        backgroundColor: colors.transport.default.ferry,
        contrastBackgroundColor: colors.transport.contrast.ferry,
        pattern: 'wave',
        ariaLabel: 'Ferge',
      };
    case 'carferry':
      return {
        Icon: CarferryIcon,
        backgroundColor: colors.transport.default.carferry,
        contrastBackgroundColor: colors.transport.contrast.carferry,
        pattern: 'wave',
        ariaLabel: 'Bilferge',
      };
    case 'mobility':
      return {
        Icon: MobilityIcon,
        backgroundColor: colors.transport.default.mobility,
        contrastBackgroundColor: colors.transport.contrast.mobility,
        pattern: 'line',
        ariaLabel: 'El-sparkesykkel',
      };
    case 'airportLinkBus':
      return {
        Icon: BusIcon,
        backgroundColor: colors.transport.default.plane,
        contrastBackgroundColor: colors.transport.contrast.plane,
        pattern: 'dashed',
        ariaLabel: 'Flybuss',
      };
    case 'airportLinkRail':
      return {
        Icon: TrainIcon,
        backgroundColor: colors.transport.default.plane,
        contrastBackgroundColor: colors.transport.contrast.plane,
        pattern: 'line',
        ariaLabel: 'Flytog',
      };
    case 'none':
      return {
        Icon: React.Fragment,
        backgroundColor: colors.brand.blue,
        contrastBackgroundColor: colors.brand.white,
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
