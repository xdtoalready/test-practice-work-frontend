import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { documentsApi } from "../api/documents.api";
import "./DocumentViewer.css";

export const DocumentViewer = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [filename, setFilename] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let blobUrl = null;

    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let pdfData;
        switch (type) {
          case "bills":
            pdfData = await documentsApi.getBillPdf(id);
            break;
          case "acts":
            pdfData = await documentsApi.getActPdf(id);
            break;
          case "reports":
            pdfData = await documentsApi.getReportPdf(id);
            break;
          default:
            throw new Error("Неизвестный тип документа");
        }

        // Создаем blob URL для безопасного отображения
        blobUrl = URL.createObjectURL(pdfData.blob);
        setPdfUrl(blobUrl);
        setFilename(pdfData.filename);
        setPdfBlob(pdfData.blob);
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

  // Функция для скачивания файла с правильным именем
  const handleDownload = () => {
    if (!pdfBlob || !filename) return;

    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  // Чистый iframe с PDF на весь экран и кнопкой скачивания
  return (
    <div className="pdf-viewer-container">
      <button className="pdf-download-button" onClick={handleDownload}>
        Скачать {filename}
      </button>
      <iframe
        src={pdfUrl}
        className="pdf-viewer-iframe"
        title={getDocumentTitle()}
      />
    </div>
  );
};
