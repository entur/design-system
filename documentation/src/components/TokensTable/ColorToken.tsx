import React from 'react';
import { formatTokenValue } from '../../utils/formatVariable';
import { TokenProps } from './types';
import { CopyableText } from '@entur/alert';
// TODO This function is not exported from travel. So we include it here directly
// import { getTransportStyle } from '@entur/travel';

import FillIcon from './tokenIcons/FillIcon';
import StrokeIcon from './tokenIcons/StrokeIcon';
import ShapeIcon from './tokenIcons/ShapeIcon';
import TextIcon from './tokenIcons/TextIcon';
import {
  BicycleIcon,
  BusIcon,
  CablewayIcon,
  CarferryIcon,
  ChartFilledIcon,
  FerryIcon,
  FunicularIcon,
  HelicopterIcon,
  IconProps,
  MetroIcon,
  MobilityIcon,
  PlaneIcon,
  TaxiIcon,
  TrainIcon,
  TramIcon,
  WalkIcon,
} from '@entur/icons';

const categoryIcons = {
  chart: ChartFilledIcon,
  frame: FillIcon,
  fill: FillIcon,
  text: TextIcon,
  stroke: StrokeIcon,
  shape: ShapeIcon,
};

const getIconComponent = (
  iconCategory: string | undefined,
  showValue: string,
) => {
  if (!iconCategory) {
    return undefined;
  }

  if (iconCategory === 'transport') {
    const iconNameWords = showValue.split('-');
    const { Icon } = getTransportStyle(iconNameWords[0]);
    return Icon;
  }

  return categoryIcons[iconCategory as keyof typeof categoryIcons];
};

const ColorToken: React.FC<TokenProps> = ({
  iconCategory,
  showValue,
  hexValue,
  copyValue,
  PrimitiveExample,
  className,
}) => {
  const IconComponent = getIconComponent(iconCategory, showValue);
  return (
    <div className="token">
      <div
        className={`token-content ${
          !iconCategory
            ? 'token-content__grid-item--primitive'
            : 'token-content__grid-item'
        }`}
      >
        {IconComponent && iconCategory && (
          <div className="token-content__icon" id={iconCategory}>
            <IconComponent color={hexValue} />
          </div>
        )}

        {PrimitiveExample && (
          <PrimitiveExample className={className} value={hexValue} />
        )}
        <div
          className={`${
            !iconCategory
              ? 'token-content__codetext--primitive'
              : 'token-content__codetext'
          }`}
        >
          <CopyableText textToCopy={copyValue}>{showValue}</CopyableText>
          {formatTokenValue(hexValue)}
        </div>
      </div>
    </div>
  );
};

export default ColorToken;

// Util copied from @entur/travel

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
    case 'neutral':
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
    case 'citybike':
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
    case 'airportlinkbus':
      return {
        Icon: BusIcon,
        pattern: 'dashed',
        ariaLabel: 'Flybuss',
      };
    case 'airportLinkRail':
    case 'airportlinkrail':
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
