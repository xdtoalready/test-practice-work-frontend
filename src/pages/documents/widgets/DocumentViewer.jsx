import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { documentsApi } from "../api/documents.api";
import "./DocumentViewer.css";

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
        } else if (err.response?.status === 401) {
          // Редирект на страницу входа при неавторизованном доступе
          navigate("/signin");
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
  }, [type, id, navigate]);

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

  // Устанавливаем заголовок страницы
  useEffect(() => {
    document.title = getDocumentTitle();
  }, [type, id]);

  // Простой лоадер без UI
  if (isLoading) {
    return (
      <div className="pdf-viewer-loading">
        <div className="pdf-viewer-spinner"></div>
      </div>
    );
  }

  // Сообщение об ошибке без UI
  if (error) {
    return (
      <div className="pdf-viewer-error">
        <p>{error}</p>
      </div>
    );
  }

  // Чистый iframe с PDF на весь экран
  return (
    <iframe
      src={pdfUrl}
      className="pdf-viewer-iframe"
      title={getDocumentTitle()}
    />
  );
};
