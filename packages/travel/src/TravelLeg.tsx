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
    | 'air'
    | 'tram'
    | 'rail'
    | 'water'
    | 'bike'
    | 'scooter'
    | 'foot'
    | 'car';
  /** Retningen på komponenten */
  direction: 'horizontal' | 'vertical';
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

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
    case 'air':
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
    case 'rail':
      return {
        color: colors.transport.default.train,
        contrast: colors.transport.contrast.train,
        pattern: 'line',
      };
    case 'water':
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
    case 'foot':
      return {
        color: colors.transport.default.walk,
        contrast: colors.transport.contrast.walk,
        pattern: 'dotted',
      };
    case 'car':
      return {
        color: colors.transport.default.taxi,
        contrast: colors.transport.contrast.taxi,
        pattern: 'dashed',
      };
    default:
      console.error(
        'No transport modality was chosen. There is likely an error in your usage of TravelLeg.',
      );
      return {
        color: colors.brand.blue,
        contrast: colors.brand.white,
        pattern: 'line',
      };
  }
}
