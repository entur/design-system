import React from 'react';
import classNames from 'classnames';
import { DialogContent, DialogContentProps } from '@reach/dialog';

export const ModalContent: React.FC<DialogContentProps> = ({
  className,
  ...rest
}) => (
  <DialogContent
    className={classNames('entur-modal__content', className)}
    {...rest}
  />
);
