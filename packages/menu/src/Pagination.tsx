import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { DownArrowIcon, LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { VisuallyHidden } from '@entur/a11y';
import { Label } from '@entur/typography';
import { useRandomId } from '@entur/utils';

import { PaginationPage } from './PaginationPage';
import { PaginationInput } from './PaginationInput';
import { OverflowMenu, OverflowMenuItem } from './OverflowMenu';

import './Pagination.scss';

export type PaginationProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Sidenummeret som er aktivt nå (1-indeksert) */
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
  /**
   * @default "Nåværende side:"
   */
  currentPageLabelForScreenreader?: string;
  /** Vis et felt til høyre for pagineringen hvor man kan angi siden man
   * ønsker å vise i et tekstfelt.
   *
   * @default false
   */
  showInput?: boolean;
  /** Label som vises til venstre for input-feltet som vises om `showInput` er true
   * @default "Gå til side"
   */
  inputLabel?: string;

  /** Hvor mange resultater man har totalt */
  numberOfResults?: number;
  /** Hvor mange resultater som vises per side */
  resultsPerPage?: number;
  /**
   * @default [10,25,50]
   */
  resultsPerPageOptions?: number[];
  /** Callback for når resultater per side oppdateres */
  onResultsPerPageChange?: (e: number) => void;
  /** Brukes for å skjule "neste side"-knappen
   * @default false
   */
  hideNextButton?: boolean;
  /** Brukes for å skjule "forrige side"-knappen
   * @default false
   */
  hidePrevButton?: boolean;
  /** Teksten som vises for hvilke resultater av sideantallet man viser.
   * @default `Viser resultat ${minPage} - ${maxPage} av ${pageCount}`
   */
  showingResultsLabel?: (
    minPage: number,
    maxPage: number,
    pageCount: number,
  ) => string;
  /** Teksten som vises før "resultsPerPage"-velgeren
   * @default "Vis"
   */
  showNumberOfResultsLabel?: string;
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
  currentPageLabelForScreenreader = 'Nåværende side:',
  lastPageLabelForScreenreader = ', siste side',
  showInput,

  numberOfResults,
  resultsPerPage,
  resultsPerPageOptions = [10, 25, 50],
  onResultsPerPageChange,

  showNumberOfResultsLabel = 'Vis',
  nextPageLabel = 'Gå til neste side',
  showingResultsLabel = (minPage, maxPage, pageCount) =>
    `Viser resultat ${minPage}–${maxPage} av ${pageCount}`,
  changeNumberOfResultsLabelForScreenreader = `Viser ${resultsPerPage} resultater. Trykk for å endre antall. Åpner en flervalgsmeny.`,
  hideNextButton = false,
  hidePrevButton = false,
  ...rest
}) => {
  const [listedEntries, setListedEntries] = useState<Array<number | '…'>>([]);
  const paginationId = useRandomId('eds-pagination');

  const isFirstPostSelected = currentPage === 1;
  const isLastPostSelected = currentPage === pageCount;
  const noEllipsis = pageCount <= 7;
  const onlyLeadingEllipsis = !noEllipsis && currentPage < 5;
  const onlyTrailingEllipsis = !noEllipsis && pageCount - currentPage <= 3;

  useEffect(() => {
    if (pageCount < 1) return;
    if (noEllipsis) {
      setListedEntries(
        Array(pageCount)
          .fill(null)
          .map((_, i) => i + 1),
      );
    } else if (onlyLeadingEllipsis) {
      setListedEntries([1, 2, 3, 4, 5, '…', pageCount]);
    } else if (onlyTrailingEllipsis) {
      setListedEntries([
        1,
        '…',
        pageCount - 4,
        pageCount - 3,
        pageCount - 2,
        pageCount - 1,
        pageCount,
      ]);
    } else {
      // leading and trailing ellipsis
      setListedEntries([
        1,
        '…',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '…',
        pageCount,
      ]);
    }
  }, [
    noEllipsis,
    onlyLeadingEllipsis,
    onlyTrailingEllipsis,
    currentPage,
    pageCount,
  ]);

  if (pageCount < 1) {
    return null;
  }

  return (
    <nav
      className={classNames('eds-pagination', className)}
      aria-label="Paginering"
      {...rest}
    >
      {resultsPerPage && numberOfResults && (
        <div className="eds-pagination__results">
          {onResultsPerPageChange && (
            <>
              <Label as="p" aria-hidden="true">
                {showNumberOfResultsLabel}
              </Label>
              <OverflowMenu
                className="eds-pagination__results__change-number-of-results"
                buttonIcon={
                  <>
                    {resultsPerPage}{' '}
                    <DownArrowIcon
                      className="eds-pagination__results__change-number-of-results__arrow"
                      aria-hidden="true"
                    />
                  </>
                }
                aria-label={changeNumberOfResultsLabelForScreenreader}
                placement="bottom-end"
              >
                {resultsPerPageOptions.map((option: number, key: number) => (
                  <OverflowMenuItem
                    key={key}
                    onSelect={() => onResultsPerPageChange(option)}
                  >
                    {option}
                  </OverflowMenuItem>
                ))}
              </OverflowMenu>
            </>
          )}
          <Label as="p">
            {showingResultsLabel(
              (currentPage - 1) * resultsPerPage + 1,
              currentPage * resultsPerPage > numberOfResults
                ? numberOfResults
                : currentPage * resultsPerPage,
              numberOfResults,
            )}
          </Label>
        </div>
      )}
      <div className="eds-pagination__controls">
        {!hidePrevButton && (
          <PaginationPage
            onClick={() => onPageChange(currentPage - 1)}
            aria-label={previousPageLabel}
            aria-describedby={paginationId}
            disabled={isFirstPostSelected}
          >
            <LeftArrowIcon aria-hidden="true" />
          </PaginationPage>
        )}
        {listedEntries.map((entry, index) =>
          entry === '…' ? (
            <Ellipsis key={`ellipsis-${index}`} />
          ) : (
            <PaginationPage
              selected={entry === currentPage}
              onClick={() => onPageChange(entry)}
              aria-label={`${pageLabel(entry)}${
                entry === pageCount ? lastPageLabelForScreenreader : ''
              }`}
              aria-describedby={
                entry !== currentPage ? paginationId : undefined
              }
              key={entry}
            >
              {entry}
            </PaginationPage>
          ),
        )}
        {!hideNextButton && (
          <PaginationPage
            onClick={() => onPageChange(currentPage + 1)}
            aria-label={nextPageLabel}
            aria-describedby={paginationId}
            disabled={isLastPostSelected}
          >
            <RightArrowIcon aria-hidden="true" />
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
      <VisuallyHidden id={paginationId}>
        {currentPageLabelForScreenreader} {currentPage}
      </VisuallyHidden>
    </nav>
  );
};

const Ellipsis: React.FC = () => (
  <span className="eds-pagination__controls__page__ellipsis" aria-hidden="true">
    …
  </span>
);
