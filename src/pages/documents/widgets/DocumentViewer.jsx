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
  const [filename, setFilename] = useState("");

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

        const { blob, filename: pdfFilename } = pdfData;

        // Сохраняем filename для использования в title
        setFilename(pdfFilename);

        // Создаем File объект с правильным именем (для корректного скачивания)
        const file = new File([blob], pdfFilename, { type: "application/pdf" });

        // Создаем blob URL для безопасного отображения
        blobUrl = URL.createObjectURL(file);
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

  // Устанавливаем заголовок страницы используя filename из API
  useEffect(() => {
    if (filename) {
      // Убираем расширение .pdf для более красивого отображения
      const titleWithoutExt = filename.replace(/\.pdf$/i, "");
      document.title = titleWithoutExt;
    }
  }, [filename]);

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
      title={filename || "PDF документ"}
    />
  );
};
