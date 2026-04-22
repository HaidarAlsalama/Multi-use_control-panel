import debounce from "lodash.debounce";
import { useCallback, useEffect, useState, useRef, memo } from "react";
import { IoIosSearch } from "react-icons/io";

const InputSearch = memo(({ searchValue, setSearchValue, setPageNumber }) => {
  const [keyWord, setKeyWord] = useState("");
  const inputRef = useRef(null); // إنشاء مرجع لحقل الإدخال

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setKeyWord(value);
    debouncedSearchTermCallback(value);
  };

  const debouncedSearchTermCallback = useCallback(
    debounce((value) => {
      setSearchValue(value);
      setPageNumber(1);
    }, 600),
    []
  );

  return (
    <div className="relative">
      <input
        ref={inputRef} // ربط المرجع بحقل الإدخال
        type="search"
        className={`block px-4 py-2 w-9 text-gray-700 bg-white border border-gray-300 h-9
         rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500
          dark:focus:border-blue-500 focus:outline-none focus:w-48
          disabled:bg-gray-200 transition-width duration-200 peer ${
            keyWord.length > 0 && " !w-48"
          }`}
        value={keyWord}
        placeholder="البحث"
        onChange={handleSearchChange}
      />
      <span
        className={`absolute transform translate-x-1/2 -translate-y-1/2 top-1/2 right-1/2 text-xl cursor-pointer dark:text-white peer-focus:hidden ${
          keyWord.length > 0 && " !hidden"
        }`}
        onClick={() => inputRef.current?.focus()} // التركيز على الإدخال عند النقر
      >
        <IoIosSearch />
      </span>
    </div>
  );
});

export default InputSearch;
