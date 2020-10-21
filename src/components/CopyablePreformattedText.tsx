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
  isDrawer?: boolean;
};

export const CopyablePreformattedText: React.FC<Props> = ({
  children,
  successMessage,
  isDrawer = false,
}) => {
  const { addToast } = useToast();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    !isDrawer &&
      copy(children) &&
      addToast({ title: 'Kopiert!', content: successMessage });

    isDrawer &&
      buttonRef.current &&
      copy(children, {
        target: buttonRef.current,
      }) &&
      addToast({ title: 'Kopiert!', content: successMessage });
  };
  return (
    <button
      className="copyable-preformatted-text"
      type="button"
      onClick={handleClick}
      ref={buttonRef}
    >
      <PreformattedText>{children}</PreformattedText>
      <ReportsIcon
        className="copyable-preformatted-text__icon"
        aria-label="Kopier innhold"
      />
    </button>
  );
};
