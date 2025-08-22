import React from 'react';
import { CopyableText } from '@entur/alert';

type CopyableTextType = {
  text: string;
  successMessage?: string;
};

type Props = {
  value: CopyableTextType;
};

export const CopyableTextResolver = ({ value }: Props) => {
  const { text, successMessage } = value;

  return (
    <CopyableText textToCopy={text} successMessage={successMessage}>
      {text}
    </CopyableText>
  );
};
