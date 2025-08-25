import React from "react";

const PageTable = ({
  children,
  withPagination = false,
  pagination = null,
  onPageChange,
}) => {
  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const renderPagination = () => {
    if (
      !withPagination ||
      !pagination ||
      !pagination.meta
      // pagination.meta.last_page <= 1
    ) {
      return null;
    }

    const { current_page, last_page } = pagination.meta;
    const pages = [];

    // Кнопка "Предыдущая"
    pages.push(
      <div
        key="prev"
        className={`reports__pagination-item reports__pagination-item-text ${current_page === 1 ? "_disabled" : ""}`}
        onClick={() => current_page > 1 && handlePageChange(current_page - 1)}
      >
        Предыдущая
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.207 17.7929C11.5975 18.1834 11.5975 18.8166 11.207 19.2071C10.8164 19.5976 10.1833 19.5976 9.79274 19.2071L3.99985 13.4142C3.2188 12.6332 3.2188 11.3668 3.99985 10.5858L9.79274 4.79289C10.1833 4.40237 10.8164 4.40237 11.207 4.79289C11.5975 5.18342 11.5975 5.81658 11.207 6.20711L6.41406 11H20.4998C21.0521 11 21.4998 11.4477 21.4998 12C21.4998 12.5523 21.0521 13 20.4998 13H6.41406L11.207 17.7929Z"
            fill="#6F767E"
          />
        </svg>
      </div>,
    );

    // Номера страниц
    for (let i = 1; i <= last_page; i++) {
      pages.push(
        <div
          key={i}
          className={`reports__pagination-item reports__pagination-item-num ${current_page === i ? "_active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </div>,
      );
    }

    // Кнопка "Следующая"
    pages.push(
      <div
        key="next"
        className={`reports__pagination-item reports__pagination-item-text ${current_page === last_page ? "_disabled" : ""}`}
        onClick={() =>
          current_page < last_page && handlePageChange(current_page + 1)
        }
      >
        Следующая
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.7929 17.7929C13.4024 18.1834 13.4024 18.8166 13.7929 19.2071C14.1834 19.5976 14.8166 19.5976 15.2071 19.2071L21 13.4142C21.781 12.6332 21.781 11.3668 21 10.5858L15.2071 4.79289C14.8166 4.40237 14.1834 4.40237 13.7929 4.79289C13.4024 5.18342 13.4024 5.81658 13.7929 6.20711L18.5858 11H4.5C3.94772 11 3.5 11.4477 3.5 12C3.5 12.5523 3.94772 13 4.5 13H18.5858L13.7929 17.7929Z"
            fill="#6F767E"
          />
        </svg>
      </div>,
    );

    return <div className="reports__pagination">{pages}</div>;
  };

  return (
    <>
      <div className={"reports__table doc__table"}>{children}</div>
      {renderPagination()}
    </>
  );
};

export default PageTable;
