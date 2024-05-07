import classNames from 'classnames';
import React from 'react';
import './Spinner.scss';

export type SpinnerProps = {
  /**Ekstra klassenavn */
  className?: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const Spinner: React.FC<SpinnerProps> = ({ className, ...rest }) => {
  return (
    <>
      <div
        className={classNames('eds-spinner', className)}
        style={{ ...rest.style }}
        {...rest}
      ></div>
    </>
  );
};
