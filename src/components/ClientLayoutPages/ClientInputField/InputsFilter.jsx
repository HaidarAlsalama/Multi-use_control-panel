import debounce from "lodash.debounce";
import { forwardRef, memo, useEffect, useRef, useState } from "react";

// ---------------------- InputSearch ----------------------
const InputSearch = memo(
  forwardRef(({ searchValue, setSearchValue, setPageNumber }, ref = null) => {
    const [keyWord, setKeyWord] = useState(searchValue || "");
    const debouncedRef = useRef(
      debounce((val) => {
        setSearchValue(val);
        setPageNumber(1);
      }, 600),
    );

    const handleSearchChange = (event) => {
      const val = event.target.value;
      setKeyWord(val); // عرض فوري
      debouncedRef.current(val); // تحديث بعد debounce
    };

    // إذا تغير searchValue من parent، حدث keyWord
    useEffect(() => {
      setKeyWord(searchValue || "");
    }, [searchValue]);

    return (
      <div className="relative flex flex-col gap-1">
        <label htmlFor="search" className="text-gray-900 dark:text-white">
          البحث
        </label>
        <input
          ref={ref}
          id="search"
          type="search"
          className={`block px-4 py-2 text-gray-900 dark:text-white bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-black border border-gray-200 dark:border-white/10 rounded-[2rem] shadow-md p-4 h-9 focus:!border-mainLight focus:outline-none w-full
          disabled:bg-gray-200 transition-width duration-200`}
          value={keyWord}
          placeholder="البحث"
          autoComplete="off"
          onChange={handleSearchChange}
        />
      </div>
    );
  }),
);

// ---------------------- DateInput ----------------------
const DateInput = memo(({ title, value, setValue, setPageNumber }) => {
  const [keyWord, setKeyWord] = useState(value || "");
  const debouncedRef = useRef(
    debounce((val) => {
      setValue(val);
      setPageNumber(1);
    }, 600),
  );

  const handleSearchChange = (event) => {
    const val = event.target.value;
    setKeyWord(val); // عرض فوري
    debouncedRef.current(val); // تحديث بعد debounce
  };

  useEffect(() => {
    setKeyWord(value || "");
  }, [value]);

  return (
    <div className="relative flex flex-col gap-1">
      <label className="text-gray-900 dark:text-white">{title}</label>
      <input
        type="date"
        className={`block px-4 py-2 text-gray-900 dark:text-white bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-black border border-gray-200 dark:border-white/10 rounded-[2rem] shadow-md h-9 focus:!border-mainLight
         focus:outline-none w-full
          disabled:bg-gray-200 transition-width duration-200 peer`}
        value={keyWord}
        onChange={handleSearchChange}
      />
    </div>
  );
});

// ---------------------- SelectInput ----------------------
const SelectInput = ({ value, setValue, options, setPageNumber }) => {
  return (
    <div className="relative flex flex-col gap-1">
      <label htmlFor="status" className="text-gray-900 dark:text-white">
        الحالة
      </label>
      <select
        id="status"
        className={`block px-4 text-gray-400 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-black border border-gray-200 dark:border-white/10 rounded-[2rem] shadow-md h-9
           focus:outline-none w-full focus:!border-mainLight
          disabled:bg-gray-200 transition-width duration-200 peer`}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setPageNumber(1);
        }}
      >
        <option value="">الجميع</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputSearch;
export { DateInput, SelectInput };
