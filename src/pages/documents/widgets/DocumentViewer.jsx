import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../../../shared/ui/layout";
import PageTtile from "../../../widgets/common/ui/PageTtile";
import { Button } from "../../../shared/ui/button";
import { documentsApi } from "../api/documents.api";
import "../../../widgets/common/ui/document-viewer.css";

export const DocumentViewer = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let blobUrl = null;

    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let pdfBlob;
        switch (type) {
          case "bills":
            pdfBlob = await documentsApi.getBillPdf(id);
            break;
          case "acts":
            pdfBlob = await documentsApi.getActPdf(id);
            break;
          case "reports":
            pdfBlob = await documentsApi.getReportPdf(id);
            break;
          default:
            throw new Error("Неизвестный тип документа");
        }

        // Создаем blob URL для безопасного отображения
        blobUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(blobUrl);
      } catch (err) {
        console.error("Error loading PDF:", err);
        if (err.response?.status === 403) {
          setError("У вас нет доступа к этому документу");
        } else {
          setError("Ошибка загрузки документа");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();

    // Очистка blob URL при размонтировании компонента
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [type, id]);

  const getDocumentTitle = () => {
    switch (type) {
      case "bills":
        return `Счет №${id}`;
      case "acts":
        return `Акт №${id}`;
      case "reports":
        return `Отчет №${id}`;
      default:
        return "Документ";
    }
  };

  const handleBack = () => {
    navigate("/documents");
  };

  return (
    <Layout>
      <div className="page__inner document-viewer-page">
        <div className="document-viewer__header">
          <PageTtile title={getDocumentTitle()} />
          <Button onClick={handleBack} className="document-viewer__back-btn">
            Назад к документам
          </Button>
        </div>

        {isLoading && (
          <div className="document-viewer__loading">
            Загрузка документа...
          </div>
        )}

        {error && (
          <div className="document-viewer__error">
            <p>{error}</p>
            <Button onClick={handleBack}>Вернуться к списку</Button>
          </div>
        )}

        {pdfUrl && !error && (
          <div className="document-viewer__container">
            <iframe
              src={pdfUrl}
              className="document-viewer__iframe"
              title={getDocumentTitle()}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};
