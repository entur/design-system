import './Loader.scss';
import { warnAboutMissingStyles } from '@entur/utils';
import './index.scss';
warnAboutMissingStyles('loader', 'typography');

export { Loader } from './Loader';
export { LoadingDots } from './LoadingDots';
export { SkeletonCircle } from './SkeletonCircle';
export { SkeletonRectangle } from './SkeletonRectangle';
export { SkeletonWrapper } from './SkeletonWrapper';
export { Spinner } from './Spinner';

export type { LoaderProps } from './Loader';
export type { LoadingDotsProps } from './LoadingDots';
export type { SkeletonCircleProps } from './SkeletonCircle';
export type { SkeletonRectangleProps } from './SkeletonRectangle';
export type { SkeletonWrapperProps } from './SkeletonWrapper';
export type { SpinnerProps } from './Spinner';
