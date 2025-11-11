import { documentsApi } from "../api/documents.api";
import { handleError, handleSubmit } from "../../../core/lib/snackbar";

/**
 * Открывает PDF документ в новом окне через blob URL
 * @param {string} type - тип документа ('bills', 'acts', 'reports')
 * @param {number|string} id - ID документа
 * @param {string} documentName - название документа для отображения
 */
export const openPdfInNewWindow = async (type, id, documentName = "Документ") => {
  try {
    let pdfBlob;

    // Загружаем PDF в зависимости от типа
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

    // Создаем blob URL
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Открываем в новом окне
    const newWindow = window.open(blobUrl, "_blank");

    if (!newWindow) {
      handleError("Не удалось открыть документ. Проверьте настройки блокировки всплывающих окон");
      URL.revokeObjectURL(blobUrl);
      return;
    }

    // Устанавливаем заголовок окна
    newWindow.document.title = documentName;

    // Очищаем blob URL через некоторое время после открытия
    // Даем время браузеру загрузить PDF
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 60000); // 60 секунд

    handleSubmit("Документ открыт в новой вкладке");
  } catch (error) {
    console.error("Error opening PDF:", error);

    if (error.response?.status === 403) {
      handleError("У вас нет доступа к этому документу");
    } else {
      handleError("Ошибка при открытии документа");
    }
  }
};

/**
 * Скачивает PDF документ
 * @param {string} type - тип документа ('bills', 'acts', 'reports')
 * @param {number|string} id - ID документа
 * @param {string} fileName - имя файла для сохранения
 */
export const downloadPdf = async (type, id, fileName = "document.pdf") => {
  try {
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

    // Создаем blob URL и ссылку для скачивания
    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Очищаем blob URL
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 100);

    handleSubmit("Документ скачан");
  } catch (error) {
    console.error("Error downloading PDF:", error);

    if (error.response?.status === 403) {
      handleError("У вас нет доступа к этому документу");
    } else {
      handleError("Ошибка при скачивании документа");
    }
  }
};
