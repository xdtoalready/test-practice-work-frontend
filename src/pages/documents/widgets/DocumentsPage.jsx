import React, { useCallback, useEffect, useRef } from "react";
import { Layout } from "../../../shared/ui/layout";
import PageTtile from "../../../widgets/common/ui/PageTtile";
import PageTable from "../../../widgets/common/ui/PageTable";
import DocumentsCategories from "./DocumentsCategories";
import { useDocumentsStore } from "../state/documents.store";
import { SwipeContainer } from "../../../widgets/swipe/ui/SwipeContainer";
import "../../../widgets/swipe/ui/swipe.css";
import TasksColumns from "../../tasks/ui/TasksColumns";
import PageTableItem from "../../../widgets/common/ui/PageTableItem";
import { Button } from "../../../shared/ui/button";
import { openNewTab } from "../../../core/lib/utils";
export const DocumentsPage = () => {
  const {
    docTypes,
    selectedDocType,
    setSelectedDocType,
    getDocTypes,
    fetchDocuments,
    isLoading,
    documents,
    pagination,
    setCurrentPage,
  } = useDocumentsStore();
  const categoriesContainerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        getDocTypes();
        fetchDocuments();
      }
    };

    loadData();
  }, [getDocTypes]);

  const handleDocTypeClick = useCallback(
    (key, index) => {
      const newCategory = selectedDocType === key ? null : key;
      if (!categoriesContainerRef.current) return;

      const container = categoriesContainerRef.current;
      const items = container.querySelectorAll(".swiper-slide");

      if (items[index]) {
        container.scrollTo({
          left: items[index].offsetLeft,
          behavior: "smooth",
        });
      }

      setSelectedDocType(newCategory);
    },
    [setSelectedDocType, selectedDocType],
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const itemForDocMapping = {
    date: "Дата",
    sum: "Сумма",
    status: "Статус",
    number: "Номер",
    reportType: "Тип отчета",
  };

  const itemsForDocTable = documents.map((el) => {
    return Object.entries(el)
      .map(([key, value]) => {
        if (key === "link") {
          return {
            value: (
              <div>
                <Button
                  onClick={() => {
                    openNewTab(value);
                  }}
                >
                  Открыть
                </Button>
              </div>
            ),
            label: itemForDocMapping[key],
            className: el.className,
          };
        }
        return key === "type" || itemForDocMapping[key]
          ? { value, label: itemForDocMapping[key], className: el.className }
          : null;
      })
      .filter(Boolean);
  });

  console.log(pagination, "pags");

  return (
    <Layout>
      <div className="page__inner reports-page">
        <PageTtile className={"reports__title"} title={"Документы"} />
        <div className={"shop__control"}>
          <div className={"shop__nav shop__nav-links"}>
            <div
              ref={categoriesContainerRef}
              className="shop-links__wrap"
              style={{
                overflowX: "auto",
                display: "flex",
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
              }}
            >
              <DocumentsCategories
                availableDocTypes={docTypes}
                selectedDocType={selectedDocType}
                setSelectedDocType={handleDocTypeClick}
              />
            </div>
          </div>
        </div>
        <div className="tasks__wrap">
          {isLoading ? (
            <div className="loading-placeholder">Загрузка документов...</div>
          ) : documents.length === 0 ? (
            <div className="empty-placeholder">Документы не найдены</div>
          ) : (
            <PageTable
              withPagination={true}
              pagination={pagination}
              onPageChange={handlePageChange}
            >
              {itemsForDocTable.map((items, index) => (
                <PageTableItem
                  key={index}
                  items={items}
                  columnClassName={"reports__item-column"}
                  itemClassName={"reports__item"}
                />
              ))}
            </PageTable>
          )}
        </div>
      </div>
    </Layout>
  );
};
