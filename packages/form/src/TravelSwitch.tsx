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
  /** Label for TravelSwitchen, som vises ved høyre side. */
  children?: React.ReactNode;
  /** Hvilken type reise som skal vises rikig ikon og farge for */
  transportMode:
    | 'bus'
    | 'metro'
    | 'plane'
    | 'tram'
    | 'train'
    | 'ferry'
    | 'bike'
    | 'scooter';
  /** Callback for når verdien endres */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Størrelsen på Switchen
   * @default "medium"
   */
  size?: 'medium' | 'large';
  [key: string]: any;
};

export const TravelSwitch: React.FC<TravelSwitchProps> = ({
  className,
  children,
  transportMode = 'bus',
  size = 'medium',
  ...rest
}) => {
  const { color, contrast, Icon } = modeCalc(transportMode);
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

function modeCalc(mode: string) {
  switch (mode) {
    case 'bus':
      return {
        Icon: BusIcon,
        color: colors.transport.default.bus,
        contrast: colors.transport.contrast.bus,
      };
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
      return {};
  }
}
