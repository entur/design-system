import { warnAboutMissingStyles } from '@entur/utils';
import './index.scss';
warnAboutMissingStyles('travel');

export { LegBone } from './LegBone';
export { LegLine } from './LegLine';
export { TravelHeader } from './TravelHeader';
export { TravelLeg } from './TravelLeg';
export { TravelSwitch } from './TravelSwitch';
export { TravelTag } from './TravelTag';
export { getTransportStyle } from './utils';

export type { LegBoneProps } from './LegBone';
export type { LegLineProps } from './LegLine';
export type { TravelHeaderProps } from './TravelHeader';
export type { TravelLegProps } from './TravelLeg';
export type { TravelSwitchProps } from './TravelSwitch';
export type { TravelTagProps } from './TravelTag';
export type { Transport } from './utils';
