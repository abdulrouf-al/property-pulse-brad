import React from "react";

const Pagination = ({ totalProperties, page, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalProperties / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };
  return (
    <section className="container mx-auto flex justify-center items-center my-8">
      <button
        onClick={() => handlePageChange(page - 1)}
        className="mr-2 px-2 py-1 border border-gray-300 rounded"
        disabled={page === 1}
      >
        Previous
      </button>
      <span className="mx-2">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(page + 1)}
        className="ml-2 px-2 py-1 border border-gray-300 rounded"
        disabled={page === totalPages}
      >
        Next
      </button>
    </section>
  );
};

export default Pagination;
