import React from 'react';
import * as allTokens from '@entur/tokens';

export type FlattenedTokens = Record<string, string>;

export type SemanticTokenProps = {
  category: string;
  formattedVariable: string;
  value: string;
  copyValue: string;
};

export type PrimitiveTokenProps = {
  formattedVariable: string;
  value: string;
  copyValue: string;
  className?: string;
  Example?: React.ComponentType<{ value: string; className?: string }>;
};

export type DataTokenProps = {
  formattedVariable: string;
  value: string;
  copyValue: string;
};

export type TransportTokenProps = {
  formattedVariable: string;
  value: string;
  copyValue: string;
};

export type Props = {
  tokenKey: keyof typeof allTokens;
  example?: React.ComponentType<{ value: string; className?: string }>;
};
