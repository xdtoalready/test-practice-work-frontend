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

  // Методы для просмотра PDF файлов (print)
  getBillPdf: async (billId) => {
    try {
      const response = await apiClient2.get(
        `/api/cabinet/bills/${billId}/print`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching bill PDF:", error);
      throw error;
    }
  },

  getActPdf: async (actId) => {
    try {
      const response = await apiClient2.get(
        `/api/cabinet/acts/${actId}/print`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching act PDF:", error);
      throw error;
    }
  },

  getReportPdf: async (reportId) => {
    try {
      const response = await apiClient2.get(
        `/api/cabinet/reports/${reportId}/print`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching report PDF:", error);
      throw error;
    }
  },

  // Методы для получения URL для скачивания PDF файлов
  getBillDownloadUrl: (billId) => {
    const baseUrl = process.env.REACT_APP_API_URL_2 || "";
    return `${baseUrl}/api/cabinet/bills/${billId}/download`;
  },

  getActDownloadUrl: (actId) => {
    const baseUrl = process.env.REACT_APP_API_URL_2 || "";
    return `${baseUrl}/api/cabinet/acts/${actId}/download`;
  },

  getReportDownloadUrl: (reportId) => {
    const baseUrl = process.env.REACT_APP_API_URL_2 || "";
    return `${baseUrl}/api/cabinet/reports/${reportId}/download`;
  },
};
