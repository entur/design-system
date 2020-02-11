import React from 'react';
import { LegBone } from './LegBone';
import { colors } from '@entur/tokens';
import { useContrast } from '@entur/layout';

export type TravelLegProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Hviklen type reise som skal vises riktig farge og linjetype */
  transport:
    | 'bus'
    | 'metro'
    | 'plane'
    | 'tram'
    | 'train'
    | 'ferry'
    | 'bike'
    | 'scooter'
    | 'walk';
  /** Retningen på komponenten */
  direction: 'horizontal' | 'vertical';
  [key: string]: any;
};

export const TravelLeg: React.FC<TravelLegProps> = ({
  className,
  transport,
  direction,
  ...rest
}) => {
  const { color, contrast, pattern } = modeCalc(transport);
  const isContrast = useContrast();

  return (
    <LegBone
      direction={direction}
      pattern={pattern}
      color={isContrast ? contrast : color}
      className={className}
      {...rest}
    />
  );
};

type modeCalcResult = {
  color: string;
  contrast: string;
  pattern: 'line' | 'wave' | 'dashed' | 'dotted';
};

function modeCalc(mode: string): modeCalcResult {
  switch (mode) {
    case 'bus':
      return {
        color: colors.transport.default.bus,
        contrast: colors.transport.contrast.bus,
        pattern: 'dashed',
      };
    case 'metro':
      return {
        color: colors.transport.default.metro,
        contrast: colors.transport.contrast.metro,
        pattern: 'line',
      };
    case 'plane':
      return {
        color: colors.transport.default.plane,
        contrast: colors.transport.contrast.plane,
        pattern: 'line',
      };
    case 'tram':
      return {
        color: colors.transport.default.tram,
        contrast: colors.transport.contrast.tram,
        pattern: 'line',
      };
    case 'train':
      return {
        color: colors.transport.default.train,
        contrast: colors.transport.contrast.train,
        pattern: 'line',
      };
    case 'ferry':
      return {
        color: colors.transport.default.ferry,
        contrast: colors.transport.contrast.ferry,
        pattern: 'wave',
      };
    case 'bike':
      return {
        color: colors.transport.default.mobility,
        contrast: colors.transport.contrast.mobility,
        pattern: 'line',
      };
    case 'scooter':
      return {
        color: colors.transport.default.mobility,
        contrast: colors.transport.contrast.mobility,
        pattern: 'line',
      };
    case 'walk':
      return {
        color: colors.transport.default.walk,
        contrast: colors.transport.contrast.walk,
        pattern: 'dotted',
      };
    default:
      throw Error('Plese select a valid transport for the TravelLeg.');
  }
}
