import React, { useState } from "react";
import { Combobox } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";

export const Select = ({ label, labelClass, data, value, onChange, error, search = true }) => {
  const [arr, setArr] = useState(data || []);

  function find(str) {
    const regex = new RegExp("^" + str, "i");
    const newArr = data.filter((name) => name.match(regex));
    setArr(newArr);
  }

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative cursor-pointer space-y-3">
        <Combobox.Label className={`text-base md:text-xl font-semibold ${error ? "text-primary-red" : "text-black-80"} ${labelClass}`}>{label}</Combobox.Label>
        <Combobox.Button className="relative w-full cursor-default rounded-full bg-white pr-10 text-left focus:outline-none border-2 border-black-80 text-lg font-bold text-black-80">
          <div className="py-2.5 px-4 min-h-[48px]">{value}</div>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 mr-4 text-black-100">
            <FiChevronDown className="text-2xl" aria-hidden="true" />
          </span>
        </Combobox.Button>
        <Combobox.Options className="absolute mt-1 w-full rounded-md bg-white text-base shadow-lg ring-1 ring-black-80 ring-opacity-5 focus:outline-none z-10">
          {search && (
            <Combobox.Input
              onChange={(event) => find(event.target.value)}
              placeholder="Recherche"
              className="w-full bg-gray-50 py-2.5 px-4 border-0 focus:ring-0 focus:ring-offset-0 text-base font-bold text-black-80/80"
            />
          )}
          <div className="overflow-auto max-h-80">
            {arr.map((string) => (
              <Combobox.Option key={string} value={string}>
                {({ selected }) => (
                  <div className={`relative cursor-pointer select-none py-2.5 border-0 px-4 text-black-80 hover:bg-blue-10 ${selected && "bg-blue-10"}`}>{string}</div>
                )}
              </Combobox.Option>
            ))}
          </div>
        </Combobox.Options>
      </div>
    </Combobox>
  );
};