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
      // Получаем JSON ответ с file и filename
      const response = await apiClient2.get(`/api/cabinet/bills/${billId}`);

      const { file, filename } = response.data;

      if (!file) {
        throw new Error("PDF file not found in response");
      }

      // Конвертируем file в blob
      // file может быть base64 string или binary data
      let blob;
      if (typeof file === 'string') {
        // Если это base64 строка
        const base64Data = file.includes('base64,') ? file.split('base64,')[1] : file;
        const binaryString = window.atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        blob = new Blob([bytes], { type: 'application/pdf' });
      } else {
        // Если это уже binary data
        blob = new Blob([file], { type: 'application/pdf' });
      }

      return {
        blob,
        filename: filename ? `${filename}.pdf` : `bill-${billId}.pdf`
      };
    } catch (error) {
      console.error("Error fetching bill PDF:", error);
      throw error;
    }
  },

  getActPdf: async (actId) => {
    try {
      // Получаем JSON ответ с file и filename
      const response = await apiClient2.get(`/api/cabinet/acts/${actId}`);

      const { file, filename } = response.data;

      if (!file) {
        throw new Error("PDF file not found in response");
      }

      // Конвертируем file в blob
      let blob;
      if (typeof file === 'string') {
        // Если это base64 строка
        const base64Data = file.includes('base64,') ? file.split('base64,')[1] : file;
        const binaryString = window.atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        blob = new Blob([bytes], { type: 'application/pdf' });
      } else {
        blob = new Blob([file], { type: 'application/pdf' });
      }

      return {
        blob,
        filename: filename ? `${filename}.pdf` : `act-${actId}.pdf`
      };
    } catch (error) {
      console.error("Error fetching act PDF:", error);
      throw error;
    }
  },

  getReportPdf: async (reportId) => {
    try {
      // Получаем JSON ответ с file и filename
      const response = await apiClient2.get(`/api/cabinet/reports/${reportId}`);

      const { file, filename } = response.data;

      if (!file) {
        throw new Error("PDF file not found in response");
      }

      // Конвертируем file в blob
      let blob;
      if (typeof file === 'string') {
        // Если это base64 строка
        const base64Data = file.includes('base64,') ? file.split('base64,')[1] : file;
        const binaryString = window.atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        blob = new Blob([bytes], { type: 'application/pdf' });
      } else {
        blob = new Blob([file], { type: 'application/pdf' });
      }

      return {
        blob,
        filename: filename ? `${filename}.pdf` : `report-${reportId}.pdf`
      };
    } catch (error) {
      console.error("Error fetching report PDF:", error);
      throw error;
    }
  },
};
