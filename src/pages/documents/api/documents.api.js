// documents.api.js
import apiClient, { apiClient2 } from "../../../shared/api/client";
import { mapDocumentsFromApi } from "../lib/documents.mapper";

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
      const response = await apiClient2.get(`/api/cabinet/bills/${billId}`, {
        responseType: "blob",
      });

      // Извлекаем filename из Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = `bill-${billId}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
          // Декодируем если закодировано в UTF-8
          if (filename.includes('UTF-8')) {
            const utf8Match = filename.match(/UTF-8''(.*)/);
            if (utf8Match) {
              filename = decodeURIComponent(utf8Match[1]);
            }
          }
        }
      }

      return { blob: response.data, filename };
    } catch (error) {
      console.error("Error fetching bill PDF:", error);
      throw error;
    }
  },

  getActPdf: async (actId) => {
    try {
      const response = await apiClient2.get(`/api/cabinet/acts/${actId}`, {
        responseType: "blob",
      });

      // Извлекаем filename из Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = `act-${actId}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
          // Декодируем если закодировано в UTF-8
          if (filename.includes('UTF-8')) {
            const utf8Match = filename.match(/UTF-8''(.*)/);
            if (utf8Match) {
              filename = decodeURIComponent(utf8Match[1]);
            }
          }
        }
      }

      return { blob: response.data, filename };
    } catch (error) {
      console.error("Error fetching act PDF:", error);
      throw error;
    }
  },

  getReportPdf: async (reportId) => {
    try {
      const response = await apiClient2.get(`/api/cabinet/reports/${reportId}`, {
        responseType: "blob",
      });

      // Извлекаем filename из Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = `report-${reportId}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
          // Декодируем если закодировано в UTF-8
          if (filename.includes('UTF-8')) {
            const utf8Match = filename.match(/UTF-8''(.*)/);
            if (utf8Match) {
              filename = decodeURIComponent(utf8Match[1]);
            }
          }
        }
      }

      return { blob: response.data, filename };
    } catch (error) {
      console.error("Error fetching report PDF:", error);
      throw error;
    }
  },
};
