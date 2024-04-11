import { BaseExpand, ExpandArrow } from '@entur/expand/';
import { VariantType } from '@entur/utils';

import classNames from 'classnames';
import React from 'react';
import { BannerAlertBoxProps } from './BannerAlertBox';
import { BaseAlertBox } from './BaseAlertBox';
import './ExpandableAlertBox.scss';
import { SmallAlertBoxProps } from './SmallAlertBox';

export type SmallExpandableAlertBoxProps = ExpandableAlertBoxProps &
  SmallAlertBoxProps;

export const SmallExpandableAlertBox: React.FC<SmallExpandableAlertBoxProps> =
  props => {
    return <ExpandableAlertBox size="small" {...props} />;
  };

export type BannerExpandableAlertBoxProps = ExpandableAlertBoxProps &
  BannerAlertBoxProps;

export const BannerExpandableAlertBox: React.FC<BannerExpandableAlertBoxProps> =
  props => {
    return <ExpandableAlertBox size="banner" {...props} />;
  };

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

type ExpandableAlertBoxProps = {
  /**Farge og uttrykk på alert-boksen*/
  variant: VariantType | typeof info | typeof error;
  /** Tittelen til ExpandableAlertBox */
  title: React.ReactNode;
  /**Innhold som vises ved ekspandering */
  children: React.ReactNode;
  /**Ekstra klassenavn */
  className?: string;
  /** Tekst som vises på ekspanderingsknappen før åpning
   * @default "Les mer"
   */
  openLabel?: string;
  /** Tekst som vises på ekspanderingsknappen når den er åpnet
   * @default "Lukk"
   */
  closeLabel?: string;
  [key: string]: any;
};

const ExpandableAlertBox: React.FC<ExpandableAlertBoxProps> = ({
  variant,
  title,
  children,
  size,
  className,
  openLabel,
  closeLabel,
  ...rest
}) => {
  const [open, setopen] = React.useState(false);
  return (
    <BaseAlertBox
      size={size}
      variant={variant}
      className={classNames('eds-expandable-alert-box', className)}
      title={
        <ExpandableAlertBoxTitle
          open={open}
          title={title}
          onClick={() => setopen(!open)}
          openLabel={openLabel}
          closeLabel={closeLabel}
        />
      }
      {...rest}
    >
      <BaseExpand open={open}>{children}</BaseExpand>
    </BaseAlertBox>
  );
};

type ExpandableAlertBoxTitleProps = {
  title: React.ReactNode;
  open: boolean;
  openLabel?: string;
  closeLabel?: string;
  onClick: (e: React.MouseEvent) => void;
};

const ExpandableAlertBoxTitle: React.FC<ExpandableAlertBoxTitleProps> = ({
  title,
  open,
  openLabel = 'Les mer',
  closeLabel = 'Lukk',
  onClick,
}) => {
  return (
    <div className="eds-expandable-alert-box__title">
      <div>{title}</div>
      <button
        className="eds-expandable-alert-box__button"
        onClick={onClick}
        type="button"
      >
        {open ? closeLabel : openLabel}
        <ExpandArrow open={open} inline />
      </button>
    </div>
  );
};
