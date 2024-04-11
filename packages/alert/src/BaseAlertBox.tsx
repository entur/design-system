import React from 'react';
import classNames from 'classnames';
import {
  CloseIcon,
  ValidationSuccessIcon,
  ValidationExclamationIcon,
  ValidationInfoIcon,
  ValidationErrorIcon,
} from '@entur/icons';
import { IconButton } from '@entur/button';
import { Tooltip } from '@entur/tooltip';
import { VariantType } from '@entur/utils';

import './BaseAlertBox.scss';

const iconsMap = {
  success: {
    icon: ValidationSuccessIcon,
    description: 'Suksessmelding',
  },
  information: { icon: ValidationInfoIcon, description: 'Infomelding' },
  warning: {
    icon: ValidationExclamationIcon,
    description: 'Varselmelding',
  },
  negative: { icon: ValidationErrorIcon, description: 'Feilmelding' },
  //deprecated
  info: { icon: ValidationInfoIcon, description: 'Infomelding' },
  error: { icon: ValidationErrorIcon, description: 'Feilmelding' },
};

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

type BaseAlertBoxProps = {
  /** Innholdet i alert-boksen */
  children?: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Skjermleser-label for lukkeknappen, om den vises
   * @default "Lukk"
   */
  closeButtonLabel?: string;
  /** Callback som kalles når man lukker boksen
   * @default () => {}
   */
  onClose?: () => void;
  /** Om denne er true, vil boksen få en lukkeknapp i høyre hjørne
   * @default false
   */
  closable?: boolean;
  /** Tittel på boksen - oppsummer virkning */
  title?: React.ReactNode;
  /** Farge og uttrykk på alert-boksen */
  variant: VariantType | typeof info | typeof error;
  /** Typen boks (internt bruk) */
  size: 'banner' | 'toast' | 'small';
  [key: string]: any;
};

export const BaseAlertBox: React.FC<BaseAlertBoxProps> = ({
  children,
  className,
  closable = false,
  closeButtonLabel = 'Lukk',
  variant,
  onClose = () => ({}),
  size,
  title,
  toastIsBeingRemoved,
  ...rest
}) => {
  const [isClosed, setClosed] = React.useState(false);
  if (isClosed) {
    return null;
  }
  const handleClose = () => {
    setClosed(true);
    onClose();
  };
  const Icon = iconsMap[variant].icon;
  return (
    <div
      className={classNames(
        'eds-alert-box',
        `eds-alert-box--${size}`,
        `eds-alert-box--${variant}`,
        { 'eds-alert-box--toast--exit-animation': toastIsBeingRemoved },
        className,
      )}
      {...rest}
    >
      <Icon
        role="img"
        className="eds-alert-box__icon"
        aria-label={iconsMap[variant].description}
      />
      <div
        className={classNames('eds-alert-box__content', {
          'eds-alert-box__content--no-title': !title,
          'eds-alert-box__content--no-children': !children,
        })}
      >
        {title && <div className="eds-alert-box__title">{title}</div>}
        {children && children}
      </div>
      {closable && (
        <Tooltip
          className="eds-alert-box__tooltip"
          aria-hidden
          placement="bottom"
          content="Lukk"
        >
          <IconButton
            data-color-mode="light"
            className="eds-alert-box__close-button"
            aria-label={closeButtonLabel}
            onClick={handleClose}
            type="button"
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};
