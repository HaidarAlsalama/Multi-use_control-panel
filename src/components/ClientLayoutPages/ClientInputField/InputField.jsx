import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function InputField({
  title,
  id,
  value,
  onChange,
  pull = false,
  type = "text",
  direction = "rtl",
  required = false,
  isDisabled = false,
  autoComplete = "",
  classes = "",
}) {
  const [showPassword, setShowPassword] = useState(false);

  if (type == "date")
    return (
      <div className={pull ? "md:col-span-2" : ""}>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {title}
        </label>
        {required ? (
          <span className="text-red-600 font-bold dark:text-green-600">*</span>
        ) : (
          ""
        )}
        <input
          id={id}
          name={id}
          type={type}
          placeholder={title}
          required={required}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target)}
          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
        />
      </div>
    );

  if (type == "select")
    return (
      <div className={pull ? "md:col-span-2" : ""}>
        <label className="text-sm font-medium dark:text-white text-gray-700">
          {title}
        </label>
        {required ? (
          <span className="text-red-600 font-bold dark:text-green-600">*</span>
        ) : (
          ""
        )}
        <select
          className="block disabled:bg-gray-200 w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
          onChange={(e) => onChange(e.target.value)}
        >
          {value.map((selector, index) => {
            return <option key={index}>{selector}</option>;
          })}
        </select>
      </div>
    );

  if (type == "file")
    return (
      <div className={pull ? "md:col-span-2" : ""}>
        <label className="text-sm font-medium  text-gray-200">{title}</label>
        {required ? (
          <span className="text-red-600 font-bold dark:text-green-600">*</span>
        ) : (
          ""
        )}
        <input
          className={`file:outline-none bg-zinc-700 file:border-0 text-white file:bg-yellow-500/80 file:py-0.5 file:px-2 file:rounded file:text-white file:mr-3 file:shadow-none file:cursor-pointer rounded-lg cursor-pointer hover:bg-zinc-500 w-full px-2 p-1 mt-2
          border border-gray-600 focus:border-yellow-500 `}
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.files[0])}
          required={required}
        />
      </div>
    );
  return (
    <div className={pull ? "md:col-span-2 relative" : "relative"}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {title}
      </label>
      {required ? (
        <span className="text-red-600 font-bold dark:text-green-600">*</span>
      ) : (
        ""
      )}
      <input
        id={id}
        name={id}
        type={type == "password" ? (!showPassword ? "password" : "text") : type}
        className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300
         rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500
          dark:focus:border-blue-500 focus:outline-none focus:ring
          disabled:bg-gray-200 ${classes}`}
        style={{ direction: direction }}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target)}
        required={required}
        disabled={isDisabled}
      />
      {type == "password" ? (
        <span
          title="عرض/اخفاء كلمة المرور"
          onClick={() => setShowPassword((prev) => !prev)}
          className="hover:bg-slate-300 dark:hover:bg-slate-700 p-2 rounded-md absolute cursor-pointer bottom-[5px] right-[5px]"
        >
          {!showPassword ? (
            <FaEye className="dark:text-white" />
          ) : (
            <FaEyeSlash className="dark:text-white" />
          )}
        </span>
      ) : null}
    </div>
  );
}

/**
 * 
 * import React from "react";

export default function InputField({
  title,
  id,
  value,
  onChange,
  pull = false,
  type = "text",
  direction = "rtl",
  required = false,
  isDisabled = false,
}) {
  if (type == "date")
    return (
      <div className={pull ? "md:col-span-2" : ""}>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{title}</label>
        {required ? <span className="text-red-600 font-bold dark:text-green-600">*</span> : ''}
        <input
          id={id}
          name={id}
          type={type}
          placeholder={title}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
        />
      </div>
    );

  if (type == "select")
    return (
      <div className={pull ? "md:col-span-2" : ""}>
        <label className="text-sm font-medium dark:text-white text-gray-700">{title}</label>
        {required ? <span className="text-red-600 font-bold dark:text-green-600">*</span> : ''}
        <select
          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
          onChange={(e) => onChange(e.target.value)}
        >
          {value.map((selector, index) => {
            return <option key={index}>{selector}</option>;
          })}
        </select>
      </div>
    );

  if (type == "file")
    return (
      <div className={pull ? "md:col-span-2" : ""}>
        <label className="text-sm font-medium dark:text-white text-gray-700">{title}</label>
        {required ? <span className="text-red-600 font-bold dark:text-green-600">*</span> : ''}
        <input
          className=" w-full mt-2 file:outline-none file:border-0 file:dark:bg-gray-800 file:bg-gray-50  file:py-1 file:px-2 file:rounded-full file:dark:text-white file:text-gray-700 file:mr-3 file:shadow-none file:cursor-pointer bg-gray-200 dark:bg-gray-600 px-5 py-3 rounded-lg  cursor-pointer hover:bg-slate-300 hover:dark:bg-slate-500 "
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => onChange(e.target.files[0])}
          required={required}
          />
      </div>
    );
  return (
    <div className={pull ? "md:col-span-2" : ""}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{title}</label>
      {required ? <span className="text-red-600 font-bold dark:text-green-600">*</span> : ''}
      <input
        id={id}
        name={id}
        type={type}
        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
        style={{ direction: direction }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={isDisabled}
      />
    </div>
  );
}

 */
