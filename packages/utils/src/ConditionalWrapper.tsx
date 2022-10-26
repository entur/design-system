import React from 'react';

type ConditionalWrapperType = {
  condition: boolean;
  wrapper: any;
  children: any;
};

export const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: ConditionalWrapperType) => (condition ? wrapper(children) : <>{children}</>);
