import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { BiChevronDown as ChevronUpDownIcon } from "react-icons/bi";

export const Select = ({ prefix, list = [], value, onChange = () => { } }) => {
  const handleChange = (value) => {
    onChange(value);
  };

  return (
    <Listbox value={value} onChange={handleChange}>
      <div className="relative w-full">
        <Listbox.Button className="font-bold text-green-500 pl-4 pr-8 py-2 rounded-md bg-app-accent text-sm border-app-accent w-full">
          <span className="block truncate text-left">
            {prefix && `${prefix} : `}{" "}
            {typeof value === "object" ? value.name : value}
          </span>
          {/* <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span> */}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* <Listbox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-app-accent py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {list.map((list, i) => (
              <Listbox.Option
                key={i}
                className={`relative text-sm select-none px-2 cursor-pointer hover:bg-app transition-colors py-1`}
                value={list}
                onChange={handleChange}
              >
                {({ selected }) => (
                  <span
                    className={`block truncate ${selected ? "font-medium" : "font-normal"
                    }`}
                  >
                    {typeof list === "object" ? list.name : list}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options> */}
        </Transition>
      </div>
    </Listbox>
  );
};