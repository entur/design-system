import React from 'react';
import classNames from 'classnames';
import {
  CloseIcon,
  ValidationCheckIcon,
  ValidationExclamationIcon,
  ValidationInfoIcon,
  ValidationErrorIcon,
} from '@entur/icons';
import './styles.scss';

const iconsMap = {
  success: ValidationCheckIcon,
  info: ValidationInfoIcon,
  warning: ValidationExclamationIcon,
  error: ValidationErrorIcon,
};

type BaseAlertBoxProps = {
  /** Innholdet i alert-boksen */
  children: React.ReactNode;
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
  onClose = () => {},
  size,
  title,
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
  const Icon = iconsMap[variant];
  return (
    <div
      className={classNames(
        'eds-alert-box',
        `eds-alert-box--${size}`,
        `eds-alert-box--${variant}`,
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
      <Icon className="eds-alert-box__icon" />
      <div
        className={classNames('eds-alert-box__content', {
          'eds-alert-box__content--no-title': !title,
        })}
      >
        {title && <p className="eds-alert-box__title">{title}</p>}
        {children}
      </div>
    </div>
  );
};
