// documents.api.js
import apiClient, { apiClient2 } from "../../../shared/api/client";
import { mapDocumentsFromApi } from "../lib/documents.mapper";

/**
 * Извлекает и декодирует имя файла из кастомного заголовка X-Filename
 * Бэкенд отправляет имя файла в URL-encoded формате (rawurlencode)
 */
const extractFilenameFromXHeader = (xFilename) => {
  if (!xFilename) {
    return null;
  }

  try {
    return decodeURIComponent(xFilename);
  } catch (e) {
    console.error("Error decoding X-Filename:", e);
    return null;
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

  // Методы для просмотра PDF файлов (print)
  getBillPdf: async (billId) => {
    try {
      const response = await apiClient2.get(`/api/cabinet/bills/${billId}/print`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching bill PDF:", error);
      throw error;
    }
  },

  getActPdf: async (actId) => {
    try {
      const response = await apiClient2.get(`/api/cabinet/acts/${actId}/print`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching act PDF:", error);
      throw error;
    }
  },

  getReportPdf: async (reportId) => {
    try {
      const response = await apiClient2.get(`/api/cabinet/reports/${reportId}/print`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching report PDF:", error);
      throw error;
    }
  },

  // Методы для скачивания PDF файлов (download)
  downloadBillPdf: async (billId) => {
    try {
      const token = localStorage.getItem("authToken");
      const url = `${apiClient2.defaults.baseURL}/api/cabinet/bills/${billId}/download`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Извлечение имени файла из кастомного заголовка X-Filename
      const xFilename = response.headers.get("X-Filename");
      const filename = extractFilenameFromXHeader(xFilename) || `bill_${billId}.pdf`;

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading bill PDF:", error);
      throw error;
    }
  },

  downloadActPdf: async (actId) => {
    try {
      const token = localStorage.getItem("authToken");
      const url = `${apiClient2.defaults.baseURL}/api/cabinet/acts/${actId}/download`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Извлечение имени файла из кастомного заголовка X-Filename
      const xFilename = response.headers.get("X-Filename");
      const filename = extractFilenameFromXHeader(xFilename) || `act_${actId}.pdf`;

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading act PDF:", error);
      throw error;
    }
  },

  downloadReportPdf: async (reportId) => {
    try {
      const token = localStorage.getItem("authToken");
      const url = `${apiClient2.defaults.baseURL}/api/cabinet/reports/${reportId}/download`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Извлечение имени файла из кастомного заголовка X-Filename
      const xFilename = response.headers.get("X-Filename");
      const filename = extractFilenameFromXHeader(xFilename) || `report_${reportId}.pdf`;

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading report PDF:", error);
      throw error;
    }
  },
};
