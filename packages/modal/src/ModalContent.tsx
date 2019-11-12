import React from 'react';
import classNames from 'classnames';
import { DialogContent } from '@reach/dialog';

type Props = {
  /** Innholdet i modalen */
  children: React.ReactNode;
} & React.HTMLProps<HTMLDivElement>;

export const ModalContent: React.FC<Props> = ({ className, ...rest }) => (
  <DialogContent
    className={classNames('eds-modal__content', className)}
    {...rest}
  />
);
