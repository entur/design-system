import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useRandomId, mergeRefs } from '@entur/utils';
import { VisuallyHidden } from '@entur/a11y';

export type TableProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Setter tettheten mellom rader og kolonner. Bruk gjerne middle og small for for sider med høy informasjonstetthet
   * @default "default"
   */
  spacing?: 'default' | 'middle' | 'small';
  /** Setter kolonne-layout til å være uavhengig av innhold
   * @default false
   */
  fixed?: boolean;
  /** Om header-raden skal bli værende på skjermen når man skroller tabellen
   * @default false
   */
  stickyHeader?: boolean;
  /** Innholdet i tabellen */
  children: React.ReactNode;
  [key: string]: any;
};
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      fixed = false,
      spacing = 'default',
      sortable = false,
      changeSortDescription = 'Tabelloverskrifter med knapper kan trykkes på for å endre sortering,',
      stickyHeader = false,
      ...rest
    },
    ref,
  ) => {
    const sortableHeaderId = useRandomId('sortable-header');

    const tableRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
      if (stickyHeader) {
        /* We check when an inserted div above the header 
          is outside our scrolling container to determine when
          the table header becomes sticky. This is necessary
          to conditionally add our box-shadow when the 
          header is overlapping table rows */
        const tableElement = tableRef.current;
        const observerElement = document.createElement('div');
        observerElement.classList.add('sticky-observer');

        tableElement?.parentNode?.insertBefore(observerElement, tableElement);

        const observer = new IntersectionObserver(
          entries => {
            tableElement?.classList.toggle(
              'eds-table--sticky-header--active',
              !entries[0].isIntersecting,
            );
          },
          { threshold: [0, 1] },
        );

        observer.observe(observerElement);

        return () => {
          observer.unobserve(observerElement);
          observerElement.remove();
        };
      }
    }, [stickyHeader]);

    return (
      <>
        <table
          className={classNames(
            'eds-table',
            { 'eds-table--fixed': fixed },
            { 'eds-table--middle': spacing === 'middle' },
            { 'eds-table--small': spacing === 'small' },
            { 'eds-table--sortable': sortable },
            { 'eds-table--sticky-header': stickyHeader },
            className,
          )}
          ref={mergeRefs(ref, tableRef)}
          aria-describedby={sortable ? sortableHeaderId : undefined}
          {...rest}
        />
        {sortable && (
          <VisuallyHidden id={sortableHeaderId}>
            {changeSortDescription}
          </VisuallyHidden>
        )}
      </>
    );
  },
);
