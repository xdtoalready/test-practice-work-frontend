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

  // Функция для скачивания файла
  const handleDownload = () => {
    let downloadUrl;
    switch (type) {
      case "bills":
        downloadUrl = documentsApi.getBillDownloadUrl(id);
        break;
      case "acts":
        downloadUrl = documentsApi.getActDownloadUrl(id);
        break;
      case "reports":
        downloadUrl = documentsApi.getReportDownloadUrl(id);
        break;
      default:
        return;
    }

    // Получаем токен для авторизации
    const token = localStorage.getItem("authToken");
    if (token) {
      // Открываем URL с токеном в заголовках через fetch и создаем blob для скачивания
      fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `document_${id}.pdf`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error downloading file:", error);
        });
    }
  };

  // Функция для открытия просмотра в новой вкладке
  const handleView = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
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

  // Чистый iframe с PDF на весь экран и кнопками просмотра и скачивания
  return (
    <div className="pdf-viewer-container">
      <div className="pdf-viewer-buttons">
        <button className="pdf-view-button" onClick={handleView}>
          Просмотр
        </button>
        <button className="pdf-download-button" onClick={handleDownload}>
          Скачать
        </button>
      </div>
      <iframe
        src={pdfUrl}
        className="pdf-viewer-iframe"
        title={getDocumentTitle()}
      />
    </div>
  );
};
