import React from 'react';
import classNames from 'classnames';
import { Heading5, SmallText } from '@entur/typography';

export type LoaderProps = {
  /** Tekst som beskriver prosessen */
  children?: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Tall mellom 0-100, eller "indeterminate" om man ikke vet
   * @default 'indeterminate'
   */
  progress?: number | 'indeterminate';
  [key: string]: any;
};

export const Loader: React.FC<LoaderProps> = ({
  children,
  className,
  progress = 'indeterminate',
  ...rest
}) => {
  const isIndeterminate = progress === 'indeterminate';
  let styles = {};
  if (!isIndeterminate) {
    styles = {
      '--loader-width': `${progress}%`,
    } as React.CSSProperties;
  }
  return (
    <div
      className={classNames('eds-loader', className)}
      role="alert"
      aria-busy={true}
      aria-live="polite"
      {...rest}
    >
      {children && (
        <Heading5 as="div" className="eds-loader__label">
          {children}
        </Heading5>
      )}
      <div
        className={classNames('eds-loader__bar', {
          'eds-loader__bar--indeterminate': isIndeterminate,
        })}
        style={styles}
      />
      {progress !== 'indeterminate' && (
        <SmallText className="eds-loader__percentage">{progress} %</SmallText>
      )}
    </div>
  );
};
