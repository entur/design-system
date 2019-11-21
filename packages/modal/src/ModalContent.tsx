import React from 'react';
import classNames from 'classnames';
import { DialogContent } from '@reach/dialog';

type ModalContentProps = {
  /** Innholdet i modalen */
  children: React.ReactNode;
} & React.HTMLProps<HTMLDivElement>;

export const ModalContent: React.FC<ModalContentProps> = ({
  className,
  ...rest
}) => (
  <DialogContent
    className={classNames('eds-modal__content', className)}
    {...rest}
  />
);
