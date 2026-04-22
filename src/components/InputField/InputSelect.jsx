import debounce from "lodash.debounce";
import { memo, useCallback, useEffect, useState } from "react";

const InputSelect = memo(
  ({ title, value, setValue, setPageNumber, options = [] }) => {
    const [keyWord, setKeyWord] = useState("");

    const handleSearchChange = (event) => {
      const value = event.target.value;
      setKeyWord(value);
      debouncedSearchTermCallback(value);
    };

    const debouncedSearchTermCallback = useCallback(
      debounce((value) => {
        setValue(value);
        setPageNumber(1);
      }, 600),
      []
    );

    return (
      <div className="relative">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {title}
        </label>
        <select
          type="date"
          className={`block px-4 mt-1 text-gray-700 bg-white border border-gray-300 h-9
         rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500
          dark:focus:border-blue-500 focus:outline-none w-full max-w-48
          disabled:bg-gray-200 transition-width duration-200 peer `}
          value={keyWord}
          onChange={handleSearchChange}
        >
          <option value="">الكل</option>
          {options.map((option, index) => (
            <option value={option.value} key={index}>
              {option.title || option.value}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

export default InputSelect;
