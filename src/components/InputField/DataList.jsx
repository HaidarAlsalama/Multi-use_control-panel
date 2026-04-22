import { Spinner } from "components";
import { useEffect, useState } from "react";
import { RiDeleteBin3Line } from "react-icons/ri";

export default function DataList({
  title,
  data,
  successFetch,
  currentValue = "",
  // setOption,
  name,
  rest,
  errors,
  placeHolder = "",
  required = false,
  className = "",
}) {
  const [optionName, setOptionName] = useState("");

  useEffect(() => {
    if (successFetch && data.length > 0) {
      updateSelectedOption(currentValue);
    }
  }, [currentValue, successFetch]);

  const updateSelectedOption = (value) => {
    // تحديث الـ State بناءً على القيمة المدخلة أو المختارة
    // console.log("++--++", value);

    rest((prev) => ({
      ...prev,
      [name]:
        isNaN(value) || value === "" || value == 0 || !value
          ? undefined
          : value,
    }));

    // البحث عن الاسم المطابق داخل البيانات
    setOptionName(data.find((item) => item.id == value)?.name || value);
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setOptionName(inputValue);

    // البحث عن العنصر المطابق داخل datalist
    const selectedItem = data.find((item) => item.name === inputValue);
    if (selectedItem) {
      updateSelectedOption(selectedItem.id);
    } else {
      rest((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      {successFetch ? (
        <div className={`relative ${className}`}>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {title}
          </label>
          {required && (
            <span className="text-red-600 font-bold dark:text-green-600">
              *
            </span>
          )}
          <input
            type="text"
            className={`block w-full px-2 py-1 mt-2 text-gray-700 bg-white border border-gray-300
        rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500
        dark:focus:border-blue-500 focus:outline-none 
        disabled:bg-gray-200 ${errors[name] && " focus!border-red-500"}`}
            value={optionName}
            onInput={handleInputChange}
            list={`list-${title}`} // ربط الـ input بـ datalist
            placeholder={placeHolder}
            autoComplete="new-password"
          />
          {optionName && (
            <span
              className="btn btn-danger btn-sm cursor-pointer absolute !text-lg left-2 bottom-1"
              onClick={() => {
                setOptionName("");
                rest((prev) => ({
                  ...prev,
                  [name]: undefined,
                }));
              }}
            >
              <RiDeleteBin3Line />
            </span>
          )}
          <datalist id={`list-${title}`}>
            {successFetch &&
              data.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
          </datalist>

          {errors[name] && (
            <p className="text-xs text-center text-red-500 dark:text-red-600 mt-0.5">
              {errors[name].message}
            </p>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}

/*

import { Spinner } from "components";
import React, { useEffect, useState } from "react";

export default function DataList({
  title,
  data,
  successFetch,
  currentValue = 0,
  setOption,
  name,
  rest,
  errors,
  placeHolder = "",
  required = false,
  className = "",
}) {
  const [optionName, setOptionName] = useState("");

  const handleChange = (event) => {
    setData(event.target.value);
  };

  useEffect(() => {
    if (successFetch && data.length > 0) setData(currentValue);
    // console.log(currentValue);
  }, [currentValue, successFetch]);

  const setData = (value) => {
    rest((prev) => ({
      ...prev,
      [name]:
        isNaN(value) || value === "" || value == 0 || !value
          ? undefined
          : value,
    }));
    setOptionName(data.find((y) => y.id == value)?.name || value);
  };

  return (
    <>
      {successFetch ? (
        <div className={`relative ${className}`}>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {title}
          </label>
          {required && (
            <span className="text-red-600 font-bold dark:text-green-600">
              *
            </span>
          )}
          <input
            type="text"
            className={`block w-full px-2 py-1 mt-2 text-gray-700 bg-white border border-gray-300
        rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500
        dark:focus:border-blue-500 focus:outline-none 
        disabled:bg-gray-200 ${errors[name] && " focus!border-red-500"}`}
            value={optionName || ""} // الخطأ هنا في حال لم يكتب
            onChange={handleChange}
            label="Category"
            list={`category-${title}`} // ربط الـ input بـ datalist
            placeholder={placeHolder}
            
          />
          <datalist id={`category-${title}`}>
            {successFetch &&
              data.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </datalist>

          {errors[name] && (
            <p className="text-xs text-center text-red-500 dark:text-red-600 mt-0.5">
              {errors[name].message}
            </p>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}


*/
