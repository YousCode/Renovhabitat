import React, { useState, useEffect, useRef } from "react";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";
import { classNames } from "../utils";
import { HiMagnifyingGlass } from "react-icons/hi2";

function MultiSelect({ id, options, values, onSelectedChange, placeholder = "Select an option" }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (values) {
      setSelectedOptions(values);
    }
  }, [values]);

  function handleOptionClick(option) {
    let _selectedOptions;
    if (selectedOptions.find((_option) => _option.value === option.value)) {
      _selectedOptions = selectedOptions.filter((_option) => _option.value !== option.value);
    } else {
      _selectedOptions = [...selectedOptions, option];
    }
    setSelectedOptions(_selectedOptions);
    onSelectedChange(_selectedOptions);
  }

  function handleToggleClick() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      const idRegex = new RegExp(id);
      if (ref.current && !ref.current.contains(event.target) && !idRegex.test(event.target.id)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) setSearch("");
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        id={id}
        type="button"
        onClick={handleToggleClick}
        className="min-w-[180px] inline-flex justify-between items-center gap-4 px-2 pr-1 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <span id={`${id}-text`} className="flex-1 text-left">
          {selectedOptions.length === 0 ? placeholder : `${placeholder} (${selectedOptions.length})`}
        </span>
        {isOpen ? <HiChevronUp /> : <HiChevronDown />}
      </button>
      {isOpen && (
        <div ref={ref} className="absolute z-10 mt-1 max-h-96 w-fit bg-white shadow-lg rounded-md overflow-y-scroll">
          <ul className="border border-gray-200 divide-y divide-gray-200 list-none w-fit">
            <li className={classNames(`flex items-center gap-1 text-sm cursor-pointer w-96`)}>
              <div className="relative w-full py-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <HiMagnifyingGlass className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => {
                    e.persist();
                    setSearch(e.target.value.trim());
                  }}
                />
              </div>
            </li>
            {options
              .filter((o) => {
                if (!search) return true;
                return o.label.toLowerCase().includes(search.toLowerCase());
              })
              .map((option) => {
                const isSelected = selectedOptions.find((_option) => _option.value === option.value);
                return (
                  <li
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
                    className={classNames(`flex items-center gap-1 hover:bg-gray-100 text-sm px-2 py-1 cursor-pointer w-96`)}>
                    {isSelected ? <MdCheckBox className="text-blue-500" /> : <MdCheckBoxOutlineBlank className="text-gray-500" />}
                    <span className={classNames("flex-1", isSelected ? "font-semibold" : "font-normal")}>{option.label}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
