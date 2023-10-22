import React from "react";
import {
  BiLastPage,
  BiFirstPage,
  BiLeftArrow,
  BiRightArrow,
} from "react-icons/bi";

const Pagination = ({ currentPage, setCurrentPage, pages, currentItems }) => {
  return (
    <div className="pagination">
      <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
        <BiFirstPage />
      </button>
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <BiLeftArrow />
      </button>
      {pages.length > 0 ? (
        pages.map((item, index) => {
          return (
            <button
              className={currentPage === index + 1 ? "active" : null}
              key={index}
              onClick={() => setCurrentPage(index + 1)}
            >
              {item}
            </button>
          );
        })
      ) : (
        <span> ... </span>
      )}
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === pages.length || currentItems.length === 0}
      >
        <BiRightArrow />
      </button>
      <button
        onClick={() => setCurrentPage(pages[pages.length - 1])}
        disabled={currentPage === pages.length || currentItems.length === 0}
      >
        <BiLastPage />
      </button>
    </div>
  );
};

export default Pagination;
