import { warnAboutMissingStyles } from '@entur/utils';
import './index.scss';
warnAboutMissingStyles('modal', 'icons', 'typography', 'a11y', 'button');

export { Drawer } from './Drawer';
export { Modal } from './Modal';
export { headingsMap, ModalContent } from './ModalContent';
export { ModalOverlay } from './ModalOverlay';

export type { DrawerProps } from './Drawer';
export type { ModalProps } from './Modal';
export type { ModalContentProps } from './ModalContent';
export type { ModalOverlayProps } from './ModalOverlay';
