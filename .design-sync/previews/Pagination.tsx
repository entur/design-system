import React, { useState } from 'react';
import { Pagination } from '@entur/linje';

export const Default = () => {
  const [page, setPage] = useState(3);
  return (
    <Pagination pageCount={12} currentPage={page} onPageChange={setPage} />
  );
};

export const WithResultsPerPage = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const total = 148;
  return (
    <div style={{ width: 640 }}>
      <Pagination
        pageCount={Math.ceil(total / perPage)}
        numberOfResults={total}
        currentPage={page}
        onPageChange={setPage}
        resultsPerPage={perPage}
        onResultsPerPageChange={setPerPage}
      />
    </div>
  );
};

export const WithInput = () => {
  const [page, setPage] = useState(24);
  return (
    <Pagination
      pageCount={50}
      currentPage={page}
      onPageChange={setPage}
      showInput
      inputLabel="Gå til side"
    />
  );
};

export const FewPages = () => {
  const [page, setPage] = useState(1);
  return <Pagination pageCount={3} currentPage={page} onPageChange={setPage} />;
};
