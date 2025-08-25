import { create } from "zustand";
import { signinApi } from "../api/signin.api";
import { useCompanyStore } from "../../company";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (phone) => {
    set({ isLoading: true, error: null });
    try {
      await signinApi.login(phone);
      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error(error);

      set({
        error: error.response?.data?.message || "Ошибка при входе",
        isLoading: false,
      });
      return false;
    }
  },

  loginByEmail: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const {checkAuth} = get()
      const response = await signinApi.loginByEmail(email, password);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("one_time_token", response.data.chat_one_time_token);
      checkAuth()
      return true;
    } catch (error) {
      console.error(error);

      set({
        error: error.response?.data?.message || "Ошибка при входе",
        isLoading: false,
      });
      return false;
    }
  },

  verifyCode: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await signinApi.verify(code);
      localStorage.setItem("authToken", response.data.token);

      set({
        isAuthenticated: true,
        user: response.data.user,
        isLoading: false,
      });

      const { fetchCompanyData } = useCompanyStore.getState();
      fetchCompanyData();

      return true;
    } catch (error) {
      console.error(error);

      set({
        error: error.response?.data?.message || "Неверный код",
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("one_time_token");
    localStorage.removeItem('serviceId')
    localStorage.removeItem('serviceType')
    sessionStorage.removeItem('serviceId')
    sessionStorage.removeItem('serviceType')
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("oneTimeAuthExecuted_")) {
        localStorage.removeItem(key);
      }
    });

    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await signinApi.me();
      set({
        isAuthenticated: true,
        user: response.data,
        isLoading: false,
      });
      const { fetchCompanyData } = useCompanyStore.getState();
      fetchCompanyData();

      return true;
    } catch (error) {
      console.error(error);

      // localStorage.removeItem("authToken");
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      return false;
    }
  },
}));
