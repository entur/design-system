import React from 'react';
import { Switch } from '@entur/form';
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
import './TravelSwitch.scss';

export type TravelSwitchProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Om switchen er checked eller ikke */
  checked?: boolean;
  /** Label for TravelSwitch-en. */
  children?: React.ReactNode;
  /** Posisjonen til label for TravelSwitch-en.
   * @default "right"
   */
  labelPlacement?: 'right' | 'bottom';
  /** Hvilken type reise som skal vises rikig ikon og farge for */
  transport: // When adding a new submode, check https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/825393529/Norwegian+submodes+and+their+definitions for names
  | 'bus'
    | 'metro'
    | 'air'
    | 'tram'
    | 'rail'
    | 'water'
    | 'bike'
    | 'airportLinkBus'
    | 'airportLinkRail'
    | 'scooter';
  /** Callback for når verdien endres */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Størrelsen på Switchen
   * @default "medium"
   */
  size?: 'medium' | 'large';
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const TravelSwitch: React.FC<TravelSwitchProps> = ({
  className,
  children,
  labelPlacement = 'right',
  transport,
  size,
  ...rest
}) => {
  const { color, contrast, Icon } = modeCalc(transport);
  return (
    <Switch
      className={className}
      labelPlacement={labelPlacement}
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
    case 'air':
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
    case 'rail':
      return {
        Icon: TrainIcon,
        color: colors.transport.default.train,
        contrast: colors.transport.contrast.train,
      };
    case 'water':
      return {
        Icon: FerryIcon,
        color: colors.transport.default.ferry,
        contrast: colors.transport.contrast.ferry,
      };
    case 'bike':
      return {
        Icon: BicycleIcon,
        color: colors.transport.default.mobility,
        contrast: colors.transport.contrast.mobility,
      };
    case 'scooter':
      return {
        Icon: ScooterIcon,
        color: colors.transport.default.mobility,
        contrast: colors.transport.contrast.mobility,
      };
    case 'airportLinkBus':
      return {
        Icon: BusIcon,
        color: colors.transport.default.plane,
        contrast: colors.transport.contrast.plane,
      };
    case 'airportLinkRail':
      return {
        Icon: TrainIcon,
        color: colors.transport.default.plane,
        contrast: colors.transport.contrast.plane,
      };
    default:
      throw Error('Please select a transport for the TravelSwitch.');
  }
}
