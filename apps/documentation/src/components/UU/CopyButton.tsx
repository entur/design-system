import React from 'react';
import { useToast } from '@entur/alert';
import copy from 'copy-text-to-clipboard';
import { SecondaryButton } from '@entur/button';
import { CopyIcon } from '@entur/icons';

import './CopyButton.scss';

type Props = {
  textToCopy: string;
  children: React.ReactNode;
};

export const CopyButton: React.FC<Props> = ({ textToCopy, children }) => {
  const [isCopied, setCopied] = React.useState(false);
  const { addToast } = useToast();

  React.useEffect(() => {
    let id: NodeJS.Timeout;
    if (isCopied) {
      id = setTimeout(() => setCopied(false), 1000);
    }
    return () => clearTimeout(id);
  }, [isCopied]);
  return (
    <SecondaryButton
      size="small"
      onClick={() => {
        copy(textToCopy);
        setCopied(true);
        addToast({
          title: 'Kopiert!',
          content: 'Tokenet ble kopiert til utklippstavla',
        });
      }}
      className="eds-copy-button"
    >
      <span>{children} </span>
      <CopyIcon aria-label=", trykk for å kopiere til utklippstavlen" />
    </SecondaryButton>
  );
};
