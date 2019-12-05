import React from 'react';
import { Switch } from './Switch';
// import classNames from 'classnames';
import { colors } from '@entur/tokens';
import {
  BusIcon,
  FerryIcon,
  TramIcon,
  PlaneIcon,
  TrainIcon,
  BicycleIcon,
  ScooterIcon,
  SubwayIcon,
} from '@entur/icons';
import './Switch.scss';

export type TravelSwitchProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Om switchen er checked eller ikke */
  checked?: boolean;
  children?: React.ReactNode;
  mode:
    | 'bus'
    | 'metro'
    | 'plane'
    | 'tram'
    | 'train'
    | 'ferry'
    | 'bike'
    | 'scooter';
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: 'medium' | 'large';
  [key: string]: any;
};

export const TravelSwitch: React.FC<TravelSwitchProps> = ({
  className,
  children,
  mode,
  size = 'medium',
  ...rest
}) => {
  const { color, contrast, Icon } = ModeCalc(mode);
  return (
    <Switch
      className={className}
      color={color}
      contrastColor={contrast}
      icon={<Icon />}
      size={size}
      {...rest}
    >
      {children}
    </Switch>
  );
};

function ModeCalc(mode: string) {
  switch (mode) {
    case 'bus':
      return {
        Icon: BusIcon,
        color: colors.transport.default.bus,
        contrast: colors.transport.contrast.bus,
      }; //Her skal begge fargene returneres
    case 'metro':
      return {
        Icon: SubwayIcon,
        color: colors.transport.default.metro,
        contrast: colors.transport.contrast.metro,
      };
    case 'plane':
      return {
        Icon: PlaneIcon,
        color: colors.transport.default.plane,
        contrast: colors.transport.contrast.plane,
      };
    case 'tram':
      return {
        Icon: TramIcon,
        color: colors.transport.default.tram,
        contrast: colors.transport.contrast.tram,
      };
    case 'train':
      return {
        Icon: TrainIcon,
        color: colors.transport.default.train,
        contrast: colors.transport.contrast.train,
      };
    case 'ferry':
      return {
        Icon: FerryIcon,
        color: colors.transport.default.ferry,
        contrast: colors.transport.contrast.ferry,
      };
    case 'bike':
      return {
        Icon: BicycleIcon,
        color: colors.transport.default.bicycle,
        contrast: colors.transport.contrast.bicycle,
      };
    case 'scooter':
      return {
        Icon: ScooterIcon,
        color: colors.transport.default.bicycle,
        contrast: colors.transport.contrast.bicycle,
      };
    default:
      return {
        Icon: BusIcon,
        color: colors.validation.mintContrast,
        contrast: colors.validation.mintContrast,
      };
  }
}
