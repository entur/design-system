import React from 'react';

import { IconButton } from '@entur/button';
import { CopyIcon } from '@entur/icons';
import { PreformattedText } from '@entur/typography';

import { useToast } from './ToastProvider';

import './CopyableText.scss';

export type CopyableTextProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Tekstinnhold som vises og kopieres */
  children: string;
  /** Hvis du ønsker å kopiere noe annet enn
   * innholdet i children kan du legge det inn her */
  textToCopy?: string;
  /** Overskrift i toast-varselet
   * @default 'Kopiert!'
   */
  successHeading?: string;
  /** Bekreftelsesmelding i toast-varselet
   * @default `${textToCopy} ble kopiert til utklippstavlen.`
   */
  successMessage?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLDivElement>, 'children'>;

export const CopyableText = ({
  children,
  successHeading = 'Kopiert!',
  successMessage,
  textToCopy,
  className,
  onClick,
  'aria-label': ariaLabel = `Kopier ${
    textToCopy ?? children
  } til utklippstavlen`,
  ...rest
}: CopyableTextProps): JSX.Element => {
  const { addToast } = useToast();
  const _textToCopy = textToCopy ?? children;
  const _successMessage =
    successMessage ?? `${_textToCopy} ble kopiert til utklippstavlen.`;
  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    try {
      await navigator.clipboard.writeText(_textToCopy);
      addToast({ title: successHeading, content: _successMessage });
    } catch {
      addToast({
        title: 'Kopiering feilet',
        content: 'Kunne ikke kopiere til utklippstavlen.',
        variant: 'information',
      });
    }
    onClick?.(e);
  };
  return (
    <div
      className={'eds-copyable-text ' + className}
      style={{ ...rest.style }}
      type="button"
      onClick={handleClick}
      tabIndex={-1}
      aria-label=""
      {...rest}
    >
      <PreformattedText className="eds-copyable-text__preformatted-text">
        <span className="eds-copyable-text__displayed-text">{children}</span>
        <IconButton
          className="eds-copyable-text__button"
          aria-label={ariaLabel}
          type="button"
        >
          <CopyIcon className={'eds-copyable-text__button__icon'} />
        </IconButton>
      </PreformattedText>
    </div>
  );
};
