import React from 'react';

type UseControllableProp<T> = (args: {
  prop?: T;
  updater?: (value?: T) => void;
  defaultValue: T;
}) => [T, Function];

export const useControllableProp: UseControllableProp<any> = ({
  prop,
  updater = () => {},
  defaultValue,
}) => {
  const [internalState, setInternalState] = React.useState(defaultValue);
  React.useEffect(() => {
    if (prop !== undefined) {
      setInternalState(prop);
    }
  }, [prop]);
  return prop === undefined
    ? [internalState, setInternalState]
    : [prop, updater];
};
