import { useState, useEffect, useMemo } from "react";

export const useMonthlyCalendar = () => {
  const [monthDates, setMonthDates] = useState([]);

  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = getFirstDayOfMonth(today);
    const lastDayOfMonth = getLastDayOfMonth(today);
    const dates = getDatesInRange(firstDayOfMonth, lastDayOfMonth);
    setMonthDates(dates);
  }, []);

  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDay.getDay(); // Get the day index (0 - 6) of the first day of the month

    // Adjust the first day to be the nearest Monday
    const diff = 1 - dayOfWeek; // 1 for Monday, 0 for Sunday, -1 for Saturday, and so on
    firstDay.setDate(firstDay.getDate() + diff);

    return firstDay;
  };

  const getLastDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const goToPreviousMonth = () => {
    const previousMonth = new Date(monthDates[0]);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    const firstDayOfMonth = getFirstDayOfMonth(previousMonth);
    const lastDayOfMonth = getLastDayOfMonth(previousMonth);
    const dates = getDatesInRange(firstDayOfMonth, lastDayOfMonth);
    setMonthDates(dates);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(monthDates[monthDates.length - 1]);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const firstDayOfMonth = getFirstDayOfMonth(nextMonth);
    const lastDayOfMonth = getLastDayOfMonth(nextMonth);
    const dates = getDatesInRange(firstDayOfMonth, lastDayOfMonth);
    setMonthDates(dates);
  };

  const memoizedMonthDates = useMemo(() => monthDates, [monthDates]);

  return { monthDates: memoizedMonthDates, goToPreviousMonth, goToNextMonth };
};
