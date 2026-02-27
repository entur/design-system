import React from 'react';

export const ModalContext = React.createContext<{
  initialFocusRef?: React.RefObject<HTMLElement>;
}>({});
