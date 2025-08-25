import apiClient, {
  apiClient2,
  topvisorClient,
  yandexMetricaClient,
} from "../../../shared/api/client";
import {
  mapGoalsData,
  mapKeywordsData,
  mapPositionsData,
  mapRejectionsData,
  mapSummaryChartData,
  mapTopVisorPositionsData,
  mapTopVisorProjectData,
  mapVisitsData,
} from "../lib/statistics.mapper";
import {
  formatDateForYandex,
  getPreviousMonthRange,
  getPreviousWeekRange,
  getPreviousYearRange,
  getYesterday,
} from "../lib/utils";
import { getActiveServiceTypeFromStorage } from "../../../core/lib/utils";

const COUNTER_ID = process.env.REACT_APP_YANDEX_METRICA_COUNTER_ID;

const getCurrentTraficFilter = (serviceType) => {
  let trafficFilter = "(ym:s:isRobot=='No')";
  if (serviceType === "seo") {
    trafficFilter += " and (ym:s:<attribution>TrafficSource=='organic')";
  } else if (serviceType === "context") {
    // trafficFilter += " AND ym:s:<attribution>TrafficSource=='direct'";
    trafficFilter += " and (ym:s:<attribution>TrafficSource=='ad')";
  }
  return trafficFilter;
};

const   getTraficFilterObject = (serviceType) => {
  const traficFilter = getCurrentTraficFilter(serviceType);
  debugger;
  if (traficFilter !== null && traficFilter !== "") {
    return { filters: traficFilter };
  }
  return {};
};

const getPrevRangeWithFormattedDates = (period, dateRange) => {
  const getPrevRangeStartEnd = (start, end) => ({
    start: formatDateForYandex(start),
    end: formatDateForYandex(end),
  });
  let previousRange;

  switch (period) {
    case "days":
      const yesterday = getYesterday();
      previousRange = getPrevRangeStartEnd(yesterday, yesterday);
      break;
    case "weeks":
      const prevWeek = getPreviousWeekRange(dateRange);
      previousRange = getPrevRangeStartEnd(prevWeek.start, prevWeek.end);
      break;
    case "months":
      const prevMonth = getPreviousMonthRange(dateRange);
      previousRange = getPrevRangeStartEnd(prevMonth.start, prevMonth.end);
      break;
    case "period": // год
      const prevYear = getPreviousYearRange(dateRange);
      previousRange = getPrevRangeStartEnd(prevYear.start, prevYear.end);
      break;
    default:
      previousRange = dateRange;
  }
  return previousRange;
};

export const statisticsApi = {
  fetchVisits: async (period, dateRange, serviceType,serviceId) => {
    const getCurrentHeaderByServiceType = () => {
      if (serviceType === "seo") {
        return 'Визиты из поисковых систем'
      } else if (serviceType ==='context'){
        return 'Визиты по рекламе '
      }
      return 'Визиты'

    }
    try {
      // Format dates for Yandex Metrica

      const startDate = formatDateForYandex(dateRange.start);
      const endDate = formatDateForYandex(dateRange.end);
      const prevDateRange = getPrevRangeWithFormattedDates(period, dateRange);

      const commenParams = {
        // ids: process.env.REACT_APP_YANDEX_METRICA_COUNTER_ID,
        metrics: "ym:s:visits",
        dimensions: "ym:s:<attribution>TrafficSource,ym:s:date",
        lang: "ru",
        group:
          period === "months" ? "month" : period === "weeks" ? "week" : "day",
        compare_periods: "1",
        attribution:"cross_device_last_significant",
        ...getTraficFilterObject(serviceType),
      };
      const [currentData, previousData] = await Promise.all([
        apiClient2.post(`/api/cabinet/${serviceId}/yandex/stat`, {
          ...commenParams,
          date1: startDate,
          date2: endDate,
        }),
        apiClient2.post(`/api/cabinet/${serviceId}/yandex/stat`, {
          ...commenParams,
          date1: prevDateRange.start,
          date2: prevDateRange.end,
        }),
      ]);

      return {
        data: {...mapVisitsData(
          { current: currentData, previous: previousData },
          dateRange,
          prevDateRange,
        ),header:getCurrentHeaderByServiceType()},
      };
    } catch (error) {
      console.error("Error fetching visits data:", error);

      throw error;
    }
  },

  fetchRejections: async (period, dateRange, serviceType,serviceId) => {
    try {
      // Format dates for Yandex Metrica
      const getCurrentHeaderByServiceType = () => {
        if (serviceType === "seo") {
          return 'Отказы из поисковых систем'
        } else if (serviceType ==='context'){
          return 'Отказы по рекламе '
        }
        return 'Отказы'

      }
      const startDate = formatDateForYandex(dateRange.start);
      const endDate = formatDateForYandex(dateRange.end);
      const prevDateRange = getPrevRangeWithFormattedDates(period, dateRange);

      const commonParams = {
        // ids: process.env.REACT_APP_YANDEX_METRICA_COUNTER_ID,
        metrics: "ym:s:bounceRate",
        dimensions: "ym:s:<attribution>TrafficSource,ym:s:date",
        group:
          period === "months" ? "month" : period === "weeks" ? "week" : "day",
        compare_periods: "1",
        attribution:"cross_device_last_significant",

        ...getTraficFilterObject(serviceType),
      };
      // Real API call
      const [currentData, previousData] = await Promise.all([
        apiClient2.post(`/api/cabinet/${serviceId}/yandex/stat`, {
          ...commonParams,
          date1: startDate,
          date2: endDate,
        }),
        apiClient2.post(`/api/cabinet/${serviceId}/yandex/stat`, {
          ...commonParams,
          date1: prevDateRange.start,
          date2: prevDateRange.end,
        }),
      ]);

      // Map the data before returning
      return {
        data: {...mapRejectionsData(
          { current: currentData, previous: previousData },
          dateRange,
          prevDateRange,
        ),header:getCurrentHeaderByServiceType()},
      };
    } catch (error) {
      console.error("Error fetching rejections data:", error);
      // Return mock data on error for dev purposes
      // if (process.env.NODE_ENV === "development") {
      //   console.log("Using mock data due to error");
      //   return statisticsMocks.rejections;
      // }
      throw error;
    }
  },
  fetchGoalsList: async (serviceId) => {
    try {
      const response = await apiClient2.get(
        `/api/cabinet/${serviceId}/yandex/counter-goals`,
      );
      return response.data.goals || [];
    } catch (error) {
      console.error("Error fetching goals list:", error);
      return [];
    }
  },

  fetchGoalData: async (period,serviceId, params = {}) => {
    try {
      const { start, end, goalId, goalName } = params;

      if (!goalId) {
        throw new Error("Goal ID is required");
      }

      // const startDate = formatDateForYandex(start);
      // const endDate = formatDateForYandex(end);
      const dateRange = { start, end };
      const prevDateRange = getPrevRangeWithFormattedDates(period, dateRange);

      // Parameters for the API request for the specific goal
      const commonParams = {
        ids: process.env.REACT_APP_YANDEX_METRICA_COUNTER_ID,
        dimensions: "ym:s:date",
        metrics: `ym:s:goal${goalId}conversionRate`,
        group:
          period === "months" ? "month" : period === "weeks" ? "week" : "day",
      };

      // Execute API request
      const [currentData, previousData] = await Promise.all([
        apiClient2.post(`/api/cabinet/${serviceId}/yandex/stat`, {
          ...commonParams,
          date1: formatDateForYandex(dateRange.start),
          date2: formatDateForYandex(dateRange.end),
        }),
        apiClient2.post(`/api/cabinet/${serviceId}/yandex/stat`, {
          ...commonParams,
          date1: prevDateRange.start,
          date2: prevDateRange.end,
        }),
      ]);

      // Get all goals to include in the mapped data
      const goalsResponse = await apiClient2.get(
        `/api/cabinet/${serviceId}/yandex/counter-goals`,
      );
      const goalsList = goalsResponse.data.goals || [];

      // Map the data to the expected format
      const mappedData = mapGoalsData(
        { current: currentData, previous: previousData },
        { goals: goalsList },
        dateRange,
        prevDateRange,
        goalName,
      );

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error fetching goal data:", error);
      throw error;
    }
  },
  fetchGoals: async (period,serviceId, params = {}) => {
    try {
      const { start, end, conversion } = params;
      const dateRange = { start, end };
      const prevDateRange = getPrevRangeWithFormattedDates(period, dateRange);

      // Получаем список целей
      const goalsList = await statisticsApi.fetchGoalsList(serviceId);

      // Если не указана конкретная цель, используем первую
      const selectedGoal = conversion
        ? goalsList.find((goal) => goal.name === conversion)
        : goalsList[0];

      if (!selectedGoal) {
        return {
          data: {
            value: 0,
            change: 0,
            comparedTo: start,
            series: [{ name: conversion || "Конверсии", data: [] }],
            categories: [],
            conversions: goalsList.map((goal) => goal.name),
          },
        };
      }

      const commonParams = {
        ids: process.env.REACT_APP_YANDEX_METRICA_COUNTER_ID,
        dimensions: "ym:s:date",
        metrics: `ym:s:goal${selectedGoal.id}conversionRate`,
        group:
          period === "months" ? "month" : period === "weeks" ? "week" : "day",
      };

      // Делаем параллельные запросы для текущего и предыдущего периода
      const [currentData, previousData] = await Promise.all([
        apiClient2.post(`/api/cabinet/${serviceId}/yandex/stat`, {
          ...commonParams,
          date1: formatDateForYandex(dateRange.start),
          date2: formatDateForYandex(dateRange.end),
        }),
        apiClient2.post(`/api/cabinet/${serviceId}/yandex/stat`, {
          ...commonParams,
          date1: prevDateRange.start,
          date2: prevDateRange.end,
        }),
      ]);

      return {
        data: mapGoalsData(
          { current: currentData, previous: previousData },
          { goals: goalsList },
          dateRange,
          prevDateRange,
          selectedGoal.name,
        ),
      };
    } catch (error) {
      console.error("Error fetching goals data:", error);
      return {
        data: {
          value: 0,
          change: 0,
          comparedTo: params?.start,
          series: [{ name: "Конверсии", data: [] }],
          categories: [],
          conversions: [],
        },
      };
    }
  },

  fetchProjectData: async (serviceId) => {
    const response = await apiClient2.post(`/api/cabinet/${serviceId}/topvisor/projects`, {
      show_site_stat: true,
      show_searchers_and_regions: "1",
      include_positions_summary: true,
    });

    const projectData = response.data;
    const searchers = projectData?.searchers || [];

    const defaultSearcher =
      searchers.find((s) => s.name === "Yandex") ||
      (searchers.length > 0 ? searchers[0] : null);
    const regions = defaultSearcher?.regions || [];
    const defaultRegion = regions.length > 0 ? regions[0] : null;
    return {
      projectData,
      searchers,
      defaultSearcher,
      regions,
      defaultRegion,
    };
  },

  fetchPositions: async (
    period,
    dateRange,
    serviceId,
    searcherKey = null,
    regionKey = null,
    projectId = null,
  ) => {
    try {
      // Check for required parameters
      if (searcherKey === null || regionKey === null) {
        console.warn("SearcherKey or regionKey not provided to fetchPositions");
        return {
          data: {
            series: [],
            categories: [],
            stats: [],
            topDynamics: {},
            visibility: [],
          },
        };
      }

      // Get project ID
      const finalProjectId =
        projectId || process.env.REACT_APP_TOPVISOR_PROJECT_ID || "7292013";

      // Format dates for API - convert from DD.MM.YYYY to YYYY-MM-DD
      let fromDate, toDate;

      if (dateRange.start && dateRange.start.includes(".")) {
        const parts = dateRange.start.split(".");
        if (parts.length === 3) {
          fromDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      } else {
        fromDate = dateRange.apiStart || "2025-03-01";
      }

      if (dateRange.end && dateRange.end.includes(".")) {
        const parts = dateRange.end.split(".");
        if (parts.length === 3) {
          toDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      } else {
        toDate = dateRange.apiEnd || "2025-03-30";
      }

      console.log(
        `Fetching positions for searcher: ${searcherKey}, region: ${regionKey}, from: ${fromDate}, to: ${toDate}`,
      );

      // Call the new API endpoint
      const positionsResponse = await apiClient2.post(
        `/api/cabinet/${serviceId}/topvisor/summary-chart`,
        {
          // project_id: finalProjectId,
          type_range: 1,
          region_index: regionKey.toString(),
          from: fromDate,
          to: toDate,
          show_tops: 1,
          show_visibility: 1,
        },
      );

      // Use the new mapper
      const mappedData = mapSummaryChartData(
        positionsResponse.data,
        finalProjectId,
      );

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error fetching positions data:", error);
      // Return empty structure in case of error
      return {
        data: {
          series: [],
          categories: [],
          stats: [
            { title: "Топ 1-3", count: 0, percentage: 0, color: "gray" },
            { title: "Топ 1-10", count: 0, percentage: 0, color: "orange" },
            { title: "Топ 11-30", count: 0, percentage: 0, color: "purple" },
            { title: "Топ 31-50", count: 0, percentage: 0, color: "green" },
            { title: "Топ 51-100", count: 0, percentage: 0, color: "blue" },
            { title: "Топ 101+", count: 0, percentage: 0, color: "red" },
            { title: "Все запросы", count: 0, percentage: 0, color: "default" },
          ],
          topDynamics: {},
          visibility: [],
        },
      };
    }
  },

  fetchKeywordPositions: async (serviceId,params) => {
    try {
      // Convert dates to required format
      const fromDate =
        formatDateForYandex(params.from) ||
        params.apiFrom ||
        new Date().toISOString().slice(0, 10);
      const toDate =
        formatDateForYandex(params.to) ||
        params.apiTo ||
        new Date().toISOString().slice(0, 10);
      console.log(params, "params");
      // Build request body
      const requestBody = {
        regions_indexes: [params.regionIndex || 84], // Default to region index 84 if not provided
        from: fromDate,
        to: toDate,
        type_range: params.typeRange || "0", // Default type_range
        show_headers: true,
        positions_fields: ["position"],
        fields: [
          `volume:${params.regionKey || 54}:${params.searcherKey || 0}:1`,
        ],
      };

      // // Add filtering by cities if provided
      // if (params.selectedCities && params.selectedCities.length > 0) {
      //   // Note: This is a placeholder - you'd need to adjust based on how filtering is actually implemented
      //   requestBody.filter_cities = params.selectedCities;
      // }

      // // Add filtering by groups if provided
      // if (params.selectedGroups && params.selectedGroups.length > 0) {
      //   // Note: This is a placeholder - you'd need to adjust based on how filtering is actually implemented
      //   requestBody.filter_groups = params.selectedGroups;
      // }

      // Make the API call
      const response = await apiClient2.post(
        `/api/cabinet/${serviceId}/topvisor/history`,
        requestBody,
      );

      // Map the response data
      return mapKeywordsData(response.data);
    } catch (error) {
      console.error("Error fetching keyword positions:", error);
      return {
        keywords: [],
        cities: [],
        groups: [],
      };
    }
  },
};
