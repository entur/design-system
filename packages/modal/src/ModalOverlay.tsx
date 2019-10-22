import React from 'react';
import classNames from 'classnames';
import { DialogOverlay, DialogOverlayProps } from '@reach/dialog';

export const ModalOverlay: React.FC<DialogOverlayProps> = ({
  className,
  ...rest
}) => (
  <DialogOverlay
    className={classNames('entur-modal__overlay', className)}
    {...rest}
  />
);
