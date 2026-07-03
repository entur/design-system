import classNames from 'classnames';
import { BaseSkeleton } from './BaseSkeleton';
export type SkeletonRectangleProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Bredden til komponenten. Er 100% som default.
   * @default '100%'
   */
  width?: string | number;
  /** Høyden til komponenten. 1rem som default.
   * @default '1rem'
   */
  height?: string | number;
  [key: string]: any;
};

export const SkeletonRectangle = ({
  className,
  width,
  height,
  ...rest
}: SkeletonRectangleProps) => {
  return (
    <BaseSkeleton
      className={classNames('eds-skeleton-rectangle', className)}
      style={{ width, height, ...rest.style }}
      {...rest}
    />
  );
};
