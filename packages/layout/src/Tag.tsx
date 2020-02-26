import React from 'react';
import classNames from 'classnames';
import './Tag.scss';
export type TagProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default 'div'
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
};

export const Tag: React.FC<TagProps> = ({
  as: Element = 'div',
  className,
  children,
  ...rest
}) => {
  const childrenArray = React.Children.toArray(children);
  const hasLeadingIcon =
    childrenArray.length > 1 && typeof childrenArray[0] !== 'string';
  const hasTrailingIcon =
    childrenArray.length > 1 &&
    typeof childrenArray[childrenArray.length - 1] !== 'string';

  return (
    <Element
      className={classNames('eds-tag', className, {
        'eds-tag--leading-icon': hasLeadingIcon,
        'eds-tag--trailing-icon': hasTrailingIcon,
      })}
      {...rest}
    >
      {children}
    </Element>
  );
};
