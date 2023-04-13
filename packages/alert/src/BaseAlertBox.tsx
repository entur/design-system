import React from 'react';
import classNames from 'classnames';
import {
  CloseIcon,
  OutlinedValidationCheckIcon,
  OutlinedValidationExclamationIcon,
  OutlinedValidationInfoIcon,
  OutlinedValidationErrorIcon,
} from '@entur/icons';
import './styles.scss';

const iconsMap = {
  success: {
    icon: OutlinedValidationCheckIcon,
    description: 'Suksessmelding',
  },
  info: { icon: OutlinedValidationInfoIcon, description: 'Infomelding' },
  warning: {
    icon: OutlinedValidationExclamationIcon,
    description: 'Varselmelding',
  },
  error: { icon: OutlinedValidationErrorIcon, description: 'Feilmelding' },
};

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
  variant: 'success' | 'info' | 'warning' | 'error';
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
      {closable && (
        <button
          aria-label={closeButtonLabel}
          className="eds-alert-box__close-button"
          type="button"
          onClick={handleClose}
        >
          <CloseIcon />
        </button>
      )}
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
    </div>
  );
};
