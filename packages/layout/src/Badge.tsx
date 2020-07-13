import React from 'react';
import classNames from 'classnames';
import './Badge.scss';

export type BadgeProps = {
  /** Elementet som wrapper badgen
   * @default "span"
   */
  as?: 'span' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Elementet som badge vil legges relativt til */
  children: React.ReactNode;
  /** Hvilken type badge man vil ha */
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  /** Om 0 skal vises
   * @default false
   */
  showZero?: boolean;
  /** Hva som er høyeste tallet før det legges på "+"
   * @default ++
   */
  max?: number;
  [key: string]: any;
};

export const Badge: React.FC<BadgeProps> = ({
  as: Element = 'span',
  children,
  className,
  max = 99,
  variant,
  showZero = false,
  invisible: invisibleProp = false,
  ...rest
}) => {
  let invisible = invisibleProp;
  if (
    invisibleProp === false &&
    ((children === 0 && !showZero) || children == null)
  ) {
    invisible = true;
  }

  let displayValue;
  if (typeof children === 'number') {
    displayValue = children > max ? `${max}+` : children;
  } else {
    displayValue = children;
  }

  const classList = classNames(
    'eds-badge',
    { 'eds-badge--invisible': invisible, 'eds-badge--show-zero': showZero },
    `eds-badge--variant-${variant}`,
  );

  return (
    <span className={classList} {...rest}>
      {displayValue}
    </span>
  );
};
