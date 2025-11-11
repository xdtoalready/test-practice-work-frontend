// documents.api.js
import apiClient, { apiClient2 } from "../../../shared/api/client";
import { mapDocumentsFromApi } from "../lib/documents.mapper";

/**
 * Декодирует UTF-8 строку из HTTP заголовка
 * Заголовки передаются как ISO-8859-1, но содержат UTF-8 байты
 */
const decodeUtf8Header = (headerValue) => {
  if (!headerValue) return null;

  try {
    // Конвертируем строку в массив байтов
    const bytes = [];
    for (let i = 0; i < headerValue.length; i++) {
      bytes.push(headerValue.charCodeAt(i) & 0xff);
    }

    // Декодируем UTF-8 байты
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(new Uint8Array(bytes));
  } catch (e) {
    console.error('Error decoding UTF-8 header:', e);
    return headerValue; // Возвращаем как есть если не получилось декодировать
  }
};

export const documentsApi = {
  getDocuments: async (type = null, page = 1) => {
    try {
      const params = { page };
      if (type) params.type = type;

      const response = await apiClient2.get("/api/cabinet/company/documents", {
        params,
      });
      return {
        documents: mapDocumentsFromApi(response.data.data),
        pagination: {
          links: response.data.links,
          meta: response.data.meta,
        },
      };
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  },

  // Методы для загрузки PDF файлов
  getBillPdf: async (billId) => {
    try {
      // Получаем PDF blob с responseType: 'blob'
      const response = await apiClient2.get(`/api/cabinet/bills/${billId}`, {
        responseType: 'blob',
      });

      // Извлекаем filename из кастомного заголовка X-Filename и декодируем UTF-8
      const rawFilename = response.headers['x-filename'];
      const filename = rawFilename
        ? decodeUtf8Header(rawFilename)
        : `bill-${billId}`;

      return {
        blob: response.data,
        filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`
      };
    } catch (error) {
      console.error("Error fetching bill PDF:", error);
      throw error;
    }
  },

  getActPdf: async (actId) => {
    try {
      // Получаем PDF blob с responseType: 'blob'
      const response = await apiClient2.get(`/api/cabinet/acts/${actId}`, {
        responseType: 'blob',
      });

      // Извлекаем filename из кастомного заголовка X-Filename и декодируем UTF-8
      const rawFilename = response.headers['x-filename'];
      const filename = rawFilename
        ? decodeUtf8Header(rawFilename)
        : `act-${actId}`;

      return {
        blob: response.data,
        filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`
      };
    } catch (error) {
      console.error("Error fetching act PDF:", error);
      throw error;
    }
  },

  getReportPdf: async (reportId) => {
    try {
      // Получаем PDF blob с responseType: 'blob'
      const response = await apiClient2.get(`/api/cabinet/reports/${reportId}`, {
        responseType: 'blob',
      });

      // Извлекаем filename из кастомного заголовка X-Filename и декодируем UTF-8
      const rawFilename = response.headers['x-filename'];
      const filename = rawFilename
        ? decodeUtf8Header(rawFilename)
        : `report-${reportId}`;

      return {
        blob: response.data,
        filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`
      };
    } catch (error) {
      console.error("Error fetching report PDF:", error);
      throw error;
    }
  },
};
