import React from 'react';
import copy from 'copy-text-to-clipboard';
import { ReportsIcon } from '@entur/icons';
import { PreformattedText } from '@entur/typography';
import { useToast } from '@entur/alert';

import './CopyablePreformattedText.scss';

type Props = {
  /** The content to show and copy */
  children: string;
  /** Config is directly passed to addToast */
  successMessage: string;
};

export const CopyablePreformattedText: React.FC<Props> = ({
  children,
  successMessage,
}) => {
  const { addToast } = useToast();
  const handleClick = () => {
    copy(children);
    addToast({ title: 'Kopiert!', content: successMessage });
  };
  return (
    <button
      className="copyable-preformatted-text"
      type="button"
      onClick={handleClick}
    >
      <PreformattedText>{children}</PreformattedText>
      <ReportsIcon
        className="copyable-preformatted-text__icon"
        aria-label="Kopier innhold"
      />
    </button>
  );
};
