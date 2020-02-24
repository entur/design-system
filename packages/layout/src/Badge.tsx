import React from 'react';
import classNames from 'classnames';
import './Badge.scss';

export type BadgeProps = {
  /** Elementet som wrapper badgen og children
   * @default "span"
   */
  as?: 'span' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Elementet som badge vil legges relativt til */
  children: React.ReactNode;
  variant: 'primary' | 'success' | 'warning' | 'danger';
  content: number | string;
  showZero?: boolean;
  [key: string]: any;
};

export const Badge: React.FC<BadgeProps> = ({
  as: Element = 'span',
  children,
  className,
  content,
  max = 99,
  variant,
  showZero,
  invisible: invisibleProp = null,
  ...rest
}) => {
  let invisible = invisibleProp;

  if (
    invisibleProp == null &&
    ((content === 0 && !showZero) || content == null)
  ) {
    invisible = true;
  }
  let displayValue;
  if (typeof content === 'number') {
    displayValue = content > max ? `${max}+` : content;
  } else {
    displayValue = content;
  }

  const classList = classNames(
    'eds-badge',
    { 'eds-badge--invisible': invisible, 'eds-badge--show-zero': showZero },
    `eds-badge--variant-${variant}`,
  );

  return (
    <Element className="eds-badge__wrapper" {...rest}>
      {children}
      <span className={classList}>{displayValue}</span>
    </Element>
  );
};
