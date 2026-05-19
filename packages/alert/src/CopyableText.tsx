import React from 'react';
import classNames from 'classnames';
import copy from 'copy-text-to-clipboard';

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
  /** Størrelse på CopyableText */
  size?: 'small' | 'medium';
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;

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
  size = 'medium',
  ...rest
}: CopyableTextProps): JSX.Element => {
  const { addToast } = useToast();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const _textToCopy = textToCopy ?? children;
  const _successMessage =
    successMessage ?? `${_textToCopy} ble kopiert til utklippstavlen.`;
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    buttonRef.current &&
      copy(_textToCopy, {
        target: buttonRef.current,
      }) &&
      addToast({ title: successHeading, content: _successMessage });
    onClick?.(e);
  };
  return (
    <div
      className={classNames(
        'eds-copyable-text',
        className,
        `eds-copyable-text--size-${size}`,
      )}
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
          size={size}
          ref={buttonRef}
        >
          <CopyIcon className={'eds-copyable-text__button__icon'} />
        </IconButton>
      </PreformattedText>
    </div>
  );
};
