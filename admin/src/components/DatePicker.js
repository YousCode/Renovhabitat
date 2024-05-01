import React, { useState, useEffect, useRef } from "react";
import { DateRangePicker } from "react-date-range";
import { enUS } from "react-date-range/dist/locale";
import { addMonths, isSameDay } from "date-fns";
import { HiOutlineCalendar } from "react-icons/hi";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

export default ({ onChange, value }) => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(value);

  const wrapperRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const ranges = [];

  ranges.push({
    label: "All time",
    range: () => ({ startDate: new Date(0), endDate: new Date() }),
    isSelected: (range) => isSameDay(range.startDate, new Date(0)),
  });
  ranges.push({
    label: "Last 12 month",
    range: () => ({ startDate: addMonths(new Date(), -12), endDate: new Date() }),
    isSelected: (range) => isSameDay(range.startDate, addMonths(new Date(), -12)),
  });
  ranges.push({
    label: "Last 6 months",
    range: () => ({ startDate: addMonths(new Date(), -6), endDate: new Date() }),
    isSelected: (range) => isSameDay(range.startDate, addMonths(new Date(), -6)),
  });

  const buttonValue = value.startDate ? `${new Date(value.startDate).toDateString()} to ${new Date(value.endDate).toDateString()}` : "Select a date";

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="bg-white border border-spark-10 rounded-lg p-3 cursor-pointer flex items-center" onClick={() => setOpen(!open)}>
        <span className="text-sm text-gunmetal-100">{buttonValue}</span>
        <HiOutlineCalendar className="text-2xl ml-10 text-gunmetal-100" />
      </div>
      {open && (
        <div className="absolute top-full right-0 z-50 border border-spark-10 rounded-lg p-0.5 bg-white">
          <DateRangePicker
            locale={enUS}
            onChange={(item) => {
              setState(item.range1);
              if (isNaN(item.range1.startDate.getTime()) || isNaN(item.range1.endDate.getTime())) return;
              onChange(item.range1);
            }}
            editableDateInputs={true}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={true}
            months={2}
            ranges={[state]}
            direction="horizontal"
            staticRanges={ranges}
            inputRanges={[]}
          />
        </div>
      )}
    </div>
  );
};
