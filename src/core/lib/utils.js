// Функция для установки активной услуги в sessionStorage
export const setActiveServiceInStorage = (serviceId) => {
  if (serviceId) {
    sessionStorage.setItem("serviceId", serviceId);
  }
};

export const setActiveServiceTypeInStorage = (serviceType) => {
  const currId = sessionStorage.getItem("serviceId");
  if (currId !== null) {
    sessionStorage.setItem("serviceType", serviceType);
  }
};

// Функция для получения активной услуги из sessionStorage
export const getActiveServiceFromStorage = () => {
  return sessionStorage.getItem("serviceId");
};

// Функция для получения активной услуги из sessionStorage
export const getActiveServiceTypeFromStorage = () => {
  return sessionStorage.getItem("serviceType");
};

const serviceTypesWithStats = ["seo", "context"];

export const serviceHasMetricsData = (serviceType) =>
  serviceTypesWithStats.includes(serviceType);

export const noStatsServiceTypes = [
  "development",
  "improvements",
  "marketplace",
    "support"
];

export const openNewTab = (url) => {
  window.open(url, "_blank");
};

export function formatCurrency(value) {
  if (typeof value !== "number") return "";

  return (
    value
      .toFixed(2) // два знака после запятой
      .replace(".", ",") // точку меняем на запятую
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + // пробелы для тысяч
    " ₽"
  ); // добавляем символ рубля
}
