import React from 'react';
import classNames from 'classnames';
import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { PaginationPage } from './PaginationPage';
import './Pagination.scss';
import { Menu, MenuList, MenuButton } from '@reach/menu-button';
import { DownArrowIcon, UpArrowIcon } from '@entur/icons';
import { PaginationInput } from './PaginationInput';
import { Label } from '@entur/typography';
import { OverflowMenuItem } from './OverflowMenu';
import { useContrast } from '@entur/layout';

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
  /** Label som vises til venstre for input-feltet som vises om `showInput` er true
   * @default "Gå til side"
   */
  inputLabel?: string;

  resultsPerPage?: number;
  /**
   * @default [10,25,50]
   */
  resultsPerPageOptions?: number[];
  onResultsPerPageChange?: (e: number) => void;
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

  resultsPerPage,
  resultsPerPageOptions = [10, 25, 50],
  onResultsPerPageChange,

  nextPageLabel = 'Gå til neste side',
  ...rest
}) => {
  const isContrast = useContrast();
  if (pageCount < 1) {
    return null;
  }

  const isFirstPostSelected = currentPage === 1;
  const isLastPostSelected = currentPage === pageCount;
  const showLeadingEllipsis = currentPage > 5 && pageCount > 7;
  const showTrailingEllipsis = pageCount - currentPage > 4 && pageCount > 7;

  let entries: Array<number | '…'> = Array(pageCount)
    .fill(null)
    .map((_, i) => i + 1);

  if (showLeadingEllipsis) {
    entries = [
      1,
      '…',
      currentPage - 2,
      currentPage - 1,
      currentPage,
      ...entries.slice(currentPage),
    ];
  }
  if (showTrailingEllipsis) {
    const currentPageIndex = entries.indexOf(currentPage);
    entries = [
      ...entries.slice(0, currentPageIndex),
      currentPage,
      currentPage + 1,
      currentPage + 2,
      '…',
      pageCount,
    ];
  }

  return (
    <div className={classNames('eds-pagination', className)} {...rest}>
      {resultsPerPage && (
        <div className="eds-pagination__results">
          {onResultsPerPageChange && (
            <Menu>
              {({ isOpen }) => (
                <>
                  <Label>Vis</Label>
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
          <Label>
            Viser resultat {(currentPage - 1) * resultsPerPage + 1} -{' '}
            {currentPage * resultsPerPage} av {pageCount * resultsPerPage}
          </Label>
        </div>
      )}
      <div className="eds-pagination__controls">
        {!isFirstPostSelected && (
          <PaginationPage
            onClick={() => onPageChange(currentPage - 1)}
            aria-label={previousPageLabel}
          >
            <LeftArrowIcon />
          </PaginationPage>
        )}
        {entries.map((entry, index) =>
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
    </div>
  );
};

const Ellipsis: React.FC = () => (
  <span className="eds-pagination__ellipsis" aria-hidden="true">
    …
  </span>
);
