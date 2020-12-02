import React from 'react';

export declare type IconProps = {
  /**Ekstra klassenavn */
  className?: string;
  /** Om ikonet skal brukes inline i tekst
   * @default false
   */
  inline?: boolean;
  /**Størrelse til ikonet. Trumfer `width` og `height`  */
  size?: string | number;
  /** Bredde til ikonet. Streng tar CSS-verdier, tall blir kalkulert som pixler */
  width?: string | number;
  /** Høyden til ikonet. Streng tar CSS-verdier, tall blir kalkulert som pixler */
  height?: string | number;
  /** Overskriver fargen til ikonet */
  color?: string;
  [key: string]: any;
};
