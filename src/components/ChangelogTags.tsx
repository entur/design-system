import React from 'react';
import { Tag } from '@entur/layout';
import { BugIcon, NewIcon, ColorPickerIcon, WarningIcon } from '@entur/icons';

export const Bug: React.FC<{ children: React.ReactNode; pck?: string }> = ({
  children,
  pck,
}) => {
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <Tag style={{ marginRight: '0.5rem' }}>
        <BugIcon inline />
        {pck && '@entur/' + pck}
      </Tag>
      {children}
    </div>
  );
};

export const Feature: React.FC<{ children: React.ReactNode; pck?: string }> = ({
  children,
  pck,
}) => {
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <Tag style={{ marginRight: '0.5rem' }}>
        <NewIcon inline />
        {pck && '@entur/' + pck}
      </Tag>
      {children}
    </div>
  );
};

export const Styling: React.FC<{ children: React.ReactNode; pck?: string }> = ({
  children,
  pck,
}) => {
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <Tag style={{ marginRight: '0.5rem' }}>
        <ColorPickerIcon inline />
        {pck && '@entur/' + pck}
      </Tag>
      {children}
    </div>
  );
};

export const Breaking: React.FC<{
  children: React.ReactNode;
  pck?: string;
}> = ({ children, pck }) => {
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <Tag style={{ marginRight: '0.5rem' }}>
        <WarningIcon inline />
        {pck && '@entur/' + pck}
      </Tag>
      {children}
    </div>
  );
};
