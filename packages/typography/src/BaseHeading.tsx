import React from 'react';
import classNames from 'classnames';

type BaseHeadingProps = {
  /** HTML-elementet eller React-komponenten som rendres */
  as: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Hvor du vil ha marginer */
  margin: 'top' | 'bottom' | 'both' | 'none';
  /** Nivået på overskriften  */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  [key: string]: any;
};

export const BaseHeading: React.FC<BaseHeadingProps> = ({
  as: Element = 'h1',
  className,
  level,
  margin,
  ...rest
}) => {
  const baseClass = `eds-h${level}`;

  return (
    <Element
      className={classNames(
        baseClass,
        {
          [`${baseClass}--margin-top`]: margin === 'top',
          [`${baseClass}--margin-bottom`]: margin === 'bottom',
          [`${baseClass}--margin-none`]: margin === 'none',
        },
        className,
      )}
      {...rest}
    />
  );
};
