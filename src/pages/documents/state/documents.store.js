// documents.store.js
import { docTypes, docTypesRu } from "../lib/constants";
import { create } from "zustand";
import { documentsApi } from "../api/documents.api";

export const useDocumentsStore = create((set, get) => ({
  docTypes: [],
  documents: [],
  selectedDocType: null,
  pagination: null,
  currentPage: 1,

  isLoading: false,
  error: null,

  setSelectedDocType: (type) => {
    set({ selectedDocType: type, currentPage: 1 });
    get().fetchDocuments(type, 1);
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().fetchDocuments(get().selectedDocType, page);
  },

  fetchDocuments: async (type = null, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const { documents, pagination } = await documentsApi.getDocuments(
        type,
        page,
      );
      set({ documents, pagination, isLoading: false });
    } catch (error) {
      set({
        error: error.message || "Произошла ошибка при загрузке документов",
        isLoading: false,
        documents: [],
        pagination: null,
      });
    }
  },

  getDocTypes: () => {
    try {
      const categories = Object.keys(docTypes).map((key) => ({
        id: key,
        key,
        label: docTypesRu[key],
      }));
      set({ docTypes: categories });
    } catch (error) {
      set({
        error:
          error.message || "Произошла ошибка при загрузке типов документов",
        docTypes: [],
      });
    }
  },
}));
