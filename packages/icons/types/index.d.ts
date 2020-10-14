import React from 'react';
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '@entur/icons';

export declare type IconProps = {
  /**Ekstra klassenavn */
  className?: string;
  /** Om ikonet skal brukes inline i tekst
   * @default false
   */
  inline?: boolean;
  /**Størrelse til ikonet. Trumfer `width` og `size`  */
  size?: string;
  /** Bredde til ikonet (i px, em o.l.) */
  width?: string;
  /** Høden til ikonet (i px, em o.l.) */
  height?: string;
  /** Overskriver fargen til ikonet */
  color?: string;
  [key: string]: any;
};
