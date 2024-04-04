import React from 'react';
import classNames from 'classnames';
import { CloseSmallIcon } from '@entur/icons';
import './BaseChip.scss';
import './TagChip.scss';

export type TagChipProps = {
  /** Teksten som vises i TagChip */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Callback for når man klikker på krysset */
  onClose: () => void;
  /** Skjermlesertekst for X-knappen */
  closeButtonAriaLabel?: string;
  /** Størrelsen på chip
   * @default 'medium'
   */
  size?: 'small' | 'medium';
};

export const TagChip = React.forwardRef<HTMLButtonElement, TagChipProps>(
  (
    {
      children,
      className,
      onClose,
      closeButtonAriaLabel,
      size = 'medium',
      ...rest
    },
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const selectedCloseLabel =
      closeButtonAriaLabel ?? 'Fjern ' + children?.toString();

    return (
      <div
        className={classNames(
          'eds-chip',
          'eds-tag-chip',
          `eds-chip--size-${size}`,
          className,
        )}
        {...rest}
      >
        {children}
        <button
          className="eds-tag-chip__close-button"
          type="button"
          onClick={onClose}
          aria-label={selectedCloseLabel}
          ref={ref}
        >
          <CloseSmallIcon aria-hidden />
        </button>
      </div>
    );
  },
);
