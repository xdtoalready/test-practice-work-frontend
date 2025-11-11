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
      // Получаем PDF blob с responseType: 'blob'
      const response = await apiClient2.get(`/api/cabinet/bills/${billId}`, {
        responseType: 'blob',
      });

      // Извлекаем filename из кастомного заголовка X-Filename
      const filename = response.headers['x-filename'] || `bill-${billId}`;

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

      // Извлекаем filename из кастомного заголовка X-Filename
      const filename = response.headers['x-filename'] || `act-${actId}`;

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

      // Извлекаем filename из кастомного заголовка X-Filename
      const filename = response.headers['x-filename'] || `report-${reportId}`;

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
