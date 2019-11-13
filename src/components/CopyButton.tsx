import React from 'react';
import { useToast } from '@entur/alert';
import copy from 'copy-text-to-clipboard';
import { Button } from '@entur/button';
import { CheckIcon, ReportsIcon } from '@entur/icons';

type Props = {
  textToCopy: string;
};

export const CopyButton: React.FC<Props> = ({ textToCopy }) => {
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
    <Button
      onClick={() => {
        copy(textToCopy);
        setCopied(true);
        addToast({
          title: 'Kopiert!',
          content: 'Tokenet ble kopiert til utklippstavla',
        });
      }}
      type="button"
      variant={isCopied ? 'success' : 'secondary'}
      width="square"
    >
      {isCopied ? <CheckIcon /> : <ReportsIcon />}
    </Button>
  );
};
