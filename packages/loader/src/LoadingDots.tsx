import classNames from 'classnames';
import React from 'react';
import './LoadingDots.scss';

export type LoadingDotsProps = {
  /** Valg av farge (brand-blue eller brand-white)
   * @default "blue"
   */
  color?: 'blue' | 'white';
  /**Ekstra klassenavn */
  className?: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  color = 'blue',
  className,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        'eds-loading-dots',
        `eds-loading-dots--color-${color}`,
        className,
      )}
      style={{ ...rest.style }}
      {...rest}
    >
      <LoadingDot dotNumber="one" />
      <LoadingDot dotNumber="two" />
      <LoadingDot dotNumber="three" />
    </div>
  );
};

type LoadingDotProps = {
  dotNumber: string;
};

const LoadingDot: React.FC<LoadingDotProps> = ({ dotNumber }) => {
  return (
    <span
      className={classNames(
        'eds-loading-dots__dot',
        `eds-loading-dots__dot--${dotNumber}`,
      )}
    />
  );
};
