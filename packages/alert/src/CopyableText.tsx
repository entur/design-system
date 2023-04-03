import React from 'react';

import copy from 'copy-text-to-clipboard';

import { useToast } from './ToastProvider';
import { CopyIcon } from '@entur/icons';
import { PreformattedText } from '@entur/typography';

import './CopyableText.scss';

export type CopyableTextProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Tekstinnhold som vises og kopieres */
  children: string;
  /** Hvis du ønsker å kopiere noe annet enn
   * innholdet i children kan du legge det inn her */
  textToCopy?: string;
  /** Overskrift i toast-varselet */
  successHeading?: string;
  /** Bekreftelsesmelding i toast-varselet */
  successMessage?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export const CopyableText = ({
  children,
  successHeading = 'Kopiert!',
  successMessage = 'Innholdet ble kopiert til utklippstavlen.',
  textToCopy,
  className,
  ...rest
}: CopyableTextProps): JSX.Element => {
  const { addToast } = useToast();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    buttonRef.current &&
      copy(textToCopy !== undefined ? textToCopy : children, {
        target: buttonRef.current,
      }) &&
      addToast({ title: successHeading, content: successMessage });
  };
  return (
    <button
      className={'copyable-text ' + className}
      style={{ ...rest.style }}
      type="button"
      onClick={handleClick}
      ref={buttonRef}
      aria-label="Kopier innhold"
      {...rest}
    >
      <PreformattedText>{children}</PreformattedText>
      <CopyIcon className="copyable-text__icon" />
    </button>
  );
};
