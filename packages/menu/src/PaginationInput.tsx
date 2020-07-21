import React from 'react';

export type PaginationInputProps = {
  currentPage: number;
  label?: string;
  onPageChange: (pageNumber: number) => void;
  pageCount: number;
};

export const PaginationInput: React.FC<PaginationInputProps> = ({
  currentPage,
  pageCount,
  label = 'Gå til side',
  onPageChange,
}) => {
  const [input, setInput] = React.useState(String(currentPage));
  // If the currentPage prop changes, we want to reset the input field
  React.useEffect(() => {
    setInput(String(currentPage));
  }, [currentPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let pageNumber = Number(input);
    if (pageNumber === currentPage) {
      return;
    }
    if (Number.isNaN(pageNumber)) {
      pageNumber = currentPage;
      setInput(String(currentPage));
      return;
    }
    if (pageNumber > pageCount) {
      pageNumber = pageCount;
      setInput(String(pageCount));
    } else if (pageNumber < 1) {
      pageNumber = 1;
      setInput(String(1));
    }
    onPageChange(pageNumber);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="form">
      <label>
        <span className="eds-pagination__input-label">{label}</span>
        <input
          type="number"
          max={pageCount}
          className="eds-pagination__input-field"
          value={input}
          onChange={handleChange}
        />
      </label>
    </form>
  );
};
