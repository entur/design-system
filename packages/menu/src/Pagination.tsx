import React from 'react';
import classNames from 'classnames';
import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { PaginationPage } from './PaginationPage';
import './Pagination.scss';
import { PaginationInput } from './PaginationInput';

export type PaginationProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Sidenummeret som er aktivt nå */
  currentPage: number;
  /** Callback for når man ønsker å gå til en ny side */
  onPageChange: (requestedPage: number) => void;
  /** Antall sider totalt */
  pageCount: number;
  /**
   * Hva som blir lest opp når brukere av skjermlesere navigerer til "forrige side knappen"
   * @default "Gå til forrige side"
   */
  previousPageLabel?: string;
  /**
   * Hva som blir lest opp når brukere av skjermlesere navigerer til "neste side knappen"
   * @default "Gå til neste side"
   */
  nextPageLabel?: string;
  /**
   * Hva som blir lest opp når brukere av skjermlesere navigerer til "forrige side knappen"
   * @default pageNumber => `Gå til side ${pageNumber}`,
   */
  pageLabel?: (pageNumber: number) => string;
  /** Vis et felt til høyre for pagineringen hvor man kan angi siden man
   * ønsker å vise i et tekstfelt.
   *
   * @default false
   */
  showInput?: boolean;
  /** Label som vises til venstre for input-feltet som vises om `showInput` er true */
  [key: string]: any;
};

export const Pagination: React.FC<PaginationProps> = ({
  className,
  currentPage,
  inputLabel,
  onPageChange,
  pageCount,
  pageLabel = pageNumber => `Gå til side ${pageNumber}`,
  previousPageLabel = 'Gå til forrige side',
  showInput,
  nextPageLabel = 'Gå til neste side',
  ...rest
}) => {
  if (!pageCount) {
    return null;
  }

  const isFirstPostSelected = currentPage === 1;
  const isLastPostSelected = currentPage === pageCount;
  const showLeadingEllipsis = currentPage > 3 && pageCount > 4;
  const showTrailingEllipsis = pageCount - currentPage > 2 && pageCount > 4;

  // This might look a bit complex, but calculates which numbers to show between
  // the start and end numbers.
  let middlePages: number[] = [];
  if (![1, pageCount].includes(currentPage)) {
    middlePages = [currentPage];
  }
  if (!showLeadingEllipsis) {
    middlePages = [2, 3, ...middlePages];
  }
  if (!showTrailingEllipsis) {
    middlePages = [...middlePages, pageCount - 2, pageCount - 1];
  }
  middlePages = Array.from(new Set(middlePages)).sort(); // Remove any doubles

  return (
    <div className={classNames('eds-pagination', className)} {...rest}>
      {!isFirstPostSelected && (
        <PaginationPage
          onClick={() => onPageChange(currentPage - 1)}
          aria-label={previousPageLabel}
        >
          <LeftArrowIcon />
        </PaginationPage>
      )}
      <PaginationPage
        selected={currentPage === 1}
        onClick={() => onPageChange(1)}
        aria-label={pageLabel(1)}
      >
        1
      </PaginationPage>
      {showLeadingEllipsis && <Ellipsis />}
      {middlePages.map(pageNumber => (
        <PaginationPage
          selected={pageNumber === currentPage}
          onClick={() => onPageChange(pageNumber)}
          aria-label={pageLabel(pageNumber)}
          key={pageNumber}
        >
          {pageNumber}
        </PaginationPage>
      ))}
      {showTrailingEllipsis && <Ellipsis />}
      {pageCount > 1 && (
        <PaginationPage
          selected={currentPage === pageCount}
          onClick={() => onPageChange(pageCount)}
          aria-label={pageLabel(pageCount)}
        >
          {pageCount}
        </PaginationPage>
      )}
      {!isLastPostSelected && (
        <PaginationPage
          onClick={() => onPageChange(currentPage + 1)}
          aria-label={nextPageLabel}
        >
          <RightArrowIcon />
        </PaginationPage>
      )}
      {showInput && (
        <PaginationInput
          pageCount={pageCount}
          currentPage={currentPage}
          onPageChange={onPageChange}
          label={inputLabel}
        />
      )}
    </div>
  );
};

const Ellipsis: React.FC = () => (
  <span className="eds-pagination__ellipsis" aria-hidden="true">
    …
  </span>
);
