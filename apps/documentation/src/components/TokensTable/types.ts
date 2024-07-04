import React from 'react';
import * as allTokens from '@entur/tokens';

export type FlattenedTokens = Record<string, string>;

export type TokenProps = {
  showValue: string;
  hexValue: string;
  copyValue: string;
  iconCategory?: string;
  className?: string;
  PrimitiveExample?: React.ComponentType<{ value: string; className?: string }>;
};

export type TokensTableProps = {
  tokens: FlattenedTokens;
  tokenKey?: keyof typeof allTokens;
  PrimitiveExample?: React.ComponentType<{ value: string; className?: string }>;
};

export type AllTokensTableProps = {
  tokenKey: keyof typeof allTokens;
  example?: React.ComponentType<{ value: string; className?: string }>;
};
