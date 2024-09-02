import { Placement as FloatingUIPlacement } from '@floating-ui/react-dom';

export type Placement =
  | 'top'
  | 'top-left'
  | 'top-start'
  | 'top-right'
  | 'top-end'
  | 'left'
  | 'right'
  | 'bottom-left'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-right'
  | 'bottom-end';

export function standardisePlacement(placement: string): FloatingUIPlacement {
  switch (placement) {
    case 'top-left':
      return 'top-start';
    case 'top-right':
      return 'top-end';
    case 'bottom-left':
      return 'bottom-start';
    case 'bottom-right':
      return 'bottom-end';
    default:
      return placement as FloatingUIPlacement;
  }
}
