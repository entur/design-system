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

type AlertBoxProps = {
  children: React.ReactNode;
  className?: string;
  closeButtonLabel?: string;
  onClose?: () => void;
  closable?: boolean;
  title?: string;
  variant: 'success' | 'info' | 'warning' | 'error';
  [key: string]: any;
};

type InternalAlertBoxProps = AlertBoxProps & {
  size: 'banner' | 'toast' | 'small';
};

const InternalAlertBox: React.FC<InternalAlertBoxProps> = ({
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
        'entur-alert-box',
        `entur-alert-box--${size}`,
        `entur-alert-box--${variant}`,
        className,
      )}
      {...rest}
    >
      {closable && (
        <button
          aria-label={closeButtonLabel}
          className="entur-alert-box__close-button"
          type="button"
          onClick={handleClose}
        >
          <CloseIcon />
        </button>
      )}
      <Icon className="entur-alert-box__icon" />
      <div className="entur-alert-box__content">
        {title && <p className="entur-alert-box__title">{title}</p>}
        {children}
      </div>
    </div>
  );
};

export const BannerAlertBox: React.FC<AlertBoxProps> = props => (
  <InternalAlertBox {...props} size="banner" />
);

export const ToastAlertBox: React.FC<AlertBoxProps> = props => (
  <InternalAlertBox {...props} size="toast" role="status" />
);

export const SmallAlertBox: React.FC<AlertBoxProps> = props => (
  <InternalAlertBox {...props} size="small" />
);
