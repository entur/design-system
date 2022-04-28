import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Menu, MenuList, MenuButton } from '@reach/menu-button';

import {
  LeftArrowIcon,
  RightArrowIcon,
  DownArrowIcon,
  UpArrowIcon,
} from '@entur/icons';
import { Label } from '@entur/typography';
import { useContrast } from '@entur/layout';

import { PaginationPage } from './PaginationPage';
import { PaginationInput } from './PaginationInput';
import { OverflowMenuItem } from './OverflowMenu';

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
  nubmerOfResults?: number;
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
  showInput,

  numberOfResults,
  resultsPerPage,
  resultsPerPageOptions = [10, 25, 50],
  onResultsPerPageChange,

  showNumberOfResultsLabel = 'Vis',
  nextPageLabel = 'Gå til neste side',
  showingResultsLabel = (minPage, maxPage, pageCount) =>
    `Viser resultat ${minPage} - ${maxPage} av ${pageCount}`,
  hideNextButton = false,
  hidePrevButton = false,
  ...rest
}) => {
  const isContrast = useContrast();
  if (pageCount < 1) {
    return null;
  }

  const [listedEntries, setListedEntries] = useState<Array<number | '…'>>([]);

  const isFirstPostSelected = currentPage === 1;
  const isLastPostSelected = currentPage === pageCount;
  const noEllipsis = pageCount <= 7;
  const onlyLeadingEllipsis = !noEllipsis && currentPage < 5;
  const onlyTrailingEllipsis = !noEllipsis && pageCount - currentPage <= 3;

  useEffect(() => {
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
  }, [currentPage, pageCount]);

  return (
    <div className={classNames('eds-pagination', className)} {...rest}>
      {resultsPerPage && numberOfResults && (
        <div className="eds-pagination__results">
          {onResultsPerPageChange && (
            <Menu>
              {({ isOpen }) => (
                <>
                  <Label>{showNumberOfResultsLabel}</Label>
                  <MenuButton
                    className={classNames('eds-pagination-menu__menu-button', {
                      'eds-pagination-menu__menu-button--open': isOpen,
                    })}
                  >
                    {resultsPerPage}
                    {isOpen ? <UpArrowIcon /> : <DownArrowIcon />}
                  </MenuButton>
                  <MenuList
                    className={classNames(
                      'eds-pagination-menu__menu-list',
                      'eds-overflow-menu__menu-list',
                      { 'eds-contrast': isContrast },
                    )}
                  >
                    {resultsPerPageOptions.map(
                      (option: number, key: number) => (
                        <OverflowMenuItem
                          key={key}
                          onSelect={() => onResultsPerPageChange(option)}
                        >
                          {option}
                        </OverflowMenuItem>
                      ),
                    )}
                  </MenuList>
                </>
              )}
            </Menu>
          )}
          <Label className="eds-pagination__results-label">
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
            disabled={isFirstPostSelected}
          >
            <LeftArrowIcon />
          </PaginationPage>
        )}
        {listedEntries.map((entry, index) =>
          entry === '…' ? (
            <Ellipsis key={`ellipsis-${index}`} />
          ) : (
            <PaginationPage
              selected={entry === currentPage}
              onClick={() => onPageChange(entry)}
              aria-label={pageLabel(entry)}
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
            disabled={isLastPostSelected}
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
    </div>
  );
};

const Ellipsis: React.FC = () => (
  <span className="eds-pagination__ellipsis" aria-hidden="true">
    …
  </span>
);
