import {
  format,
  subDays,
  subWeeks,
  subMonths,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfWeek,
  endOfMonth,
  endOfYear,
  subYears,
  differenceInDays,
  addDays,
} from "date-fns";

export const formatDateForYandex = (date) => {
  if (date instanceof Date) {
    return format(date, "yyyy-MM-dd");
  }

  if (typeof date === "string" && date.includes(".")) {
    const [day, month, year] = date.split(".");
    return `${year}-${month}-${day}`;
  }

  return date;
};

export const formatDateForLk = (date) => {
  console.log("date", date);
  if (date instanceof Date) {
    return format(date, "dd-MM-yyyy");
  }

  if (typeof date === "string" && date.includes(".")) {
    const [day, month, year] = date.split(".");
    return `${day}-${month}-${year}`;
  }

  if (typeof date === "string" && date.includes("-")) {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  }

  return date;
};

export const parseDateFromYandex = (dateString) => {
  if (!dateString) return new Date();

  const parts = dateString.split(".");
  if (parts.length !== 3) return new Date();

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
};

export const getCurrentDateFormatted = () => {
  return format(new Date(), "dd.MM.yyyy");
};

export const getDayAgoFormatted = () => {
  return format(subDays(new Date(), 1), "dd.MM.yyyy");
};

export const getWeekAgoFormatted = () => {
  return format(subDays(new Date(), 6), "dd.MM.yyyy");
};

export const getMonthAgoFormatted = () => {
  const subbed = subMonths(new Date(), 1);
  return format(addDays(subbed, 1), "dd.MM.yyyy");
};

export const getYesterday = () => subDays(new Date(), 1);

export const getPreviousWeekRange = (currentRange) => {
  const startDate = parseDateFromYandex(currentRange.start);
  const endDate = parseDateFromYandex(currentRange.end);

  const diffDays = differenceInDays(endDate, startDate);

  const prevWeekStart = subWeeks(startDate, 1);
  const prevWeekEnd = addDays(prevWeekStart, diffDays);

  return {
    start: format(prevWeekStart, "dd.MM.yyyy"),
    end: format(prevWeekEnd, "dd.MM.yyyy"),
  };
};

export const getPreviousMonthRange = (currentRange) => {
  const startDate = parseDateFromYandex(currentRange.start);
  const endDate = parseDateFromYandex(currentRange.end);

  const diffDays = differenceInDays(endDate, startDate);

  const prevMonthStart = subMonths(startDate, 1);
  const prevMonthEnd = addDays(prevMonthStart, diffDays);

  return {
    start: format(prevMonthStart, "dd.MM.yyyy"),
    end: format(prevMonthEnd, "dd.MM.yyyy"),
  };
};

export const getPreviousYearRange = (currentRange) => {
  const startDate = parseDateFromYandex(currentRange.start);
  const endDate = parseDateFromYandex(currentRange.end);

  const diffDays = differenceInDays(endDate, startDate);

  const prevYearStart = subYears(startDate, 1);
  const prevYearEnd = addDays(prevYearStart, diffDays);

  return {
    start: format(prevYearStart, "dd.MM.yyyy"),
    end: format(prevYearEnd, "dd.MM.yyyy"),
  };
};
