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
  closeButtonLabel = 'Lukk',
  variant,
  onClose,
  size,
  title,
  ...rest
}) => {
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
      {onClose && (
        <button
          aria-label={closeButtonLabel}
          className="entur-alert-box__close-button"
          type="button"
          onClick={onClose}
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
