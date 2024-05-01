import { useState, useEffect, useMemo } from "react";

export const useWeeklyCalendar = () => {
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const today = new Date();
    const monday = getMondayOfWeek(today);
    const dates = [...Array(7)].map((_, index) => addDays(monday, index));
    setWeekDates(dates);
  }, []);

  const getMondayOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday or other days
    return new Date(date.setDate(diff));
  };

  const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  };

  const goToPreviousWeek = () => {
    const previousMonday = addDays(weekDates[0], -7);
    const dates = [...Array(7)].map((_, index) =>
      addDays(previousMonday, index),
    );
    setWeekDates(dates);
  };

  const goToNextWeek = () => {
    const nextMonday = addDays(weekDates[0], 7);
    const dates = [...Array(7)].map((_, index) => addDays(nextMonday, index));
    setWeekDates(dates);
  };

  const memoizedWeekDates = useMemo(() => weekDates, [weekDates]);

  return { weekDates: memoizedWeekDates, goToPreviousWeek, goToNextWeek };
};
