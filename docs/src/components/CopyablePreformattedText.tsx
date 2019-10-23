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
  copiedToastMessage: string | { title?: string; content: React.ReactNode };
};

export const CopyablePreformattedText: React.FC<Props> = ({
  children,
  copiedToastMessage,
}) => {
  const { addToast } = useToast();
  const handleClick = () => {
    copy(children);
    addToast(copiedToastMessage);
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
        aria-label="Kopier"
      />
    </button>
  );
};
