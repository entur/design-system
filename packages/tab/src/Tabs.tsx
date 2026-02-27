import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import classNames from 'classnames';

export type TabsProps = {
  /** Overskriften til taben */
  children: React.ReactNode;
  /** Kalles når taben endres */
  onChange?: (index: number) => void;
  /** Hvilken tab som skal være åpen by default */
  defaultIndex?: number;
  /** Den åpne indexen */
  index?: number;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;

  [key: string]: any;
};

export const Tabs: React.FC<TabsProps> = ({
  className,
  index,
  defaultIndex,
  onChange,
  as: _as,
  ...rest
}) => {
  const value = index !== undefined ? String(index) : undefined;
  const defaultValue =
    defaultIndex !== undefined ? String(defaultIndex) : '0';
  const onValueChange = onChange
    ? (val: string) => onChange(Number(val))
    : undefined;

  return (
    <RadixTabs.Root
      className={classNames('eds-tabs', className)}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onValueChange={onValueChange}
      {...rest}
    />
  );
};
