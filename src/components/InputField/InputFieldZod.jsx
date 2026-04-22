import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const InputFieldZod = ({
  title,
  name,
  type,
  register,
  errors,
  // autoComplete = "off",
  value = null,
  required = false,
  className = "",
  options = [],
  pull = false,
  direction = "rtl",
  disabled = false,
  placeholder = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(value || false);

  if (type === "file") {
    return (
      <div className={`${className} h-20 ${pull && "md:col-span-2"}`}>
        <label htmlFor={name} className="text-sm font-medium text-gray-200">
          {title}
        </label>
        {required && (
          <span className="text-red-600 font-bold dark:text-green-600">*</span>
        )}

        <input
          {...register(name)}
          type="file"
          id={name}
          className={`file:outline-none file:border-0 text-white file:bg-blue-500/80 file:py-0.5 file:px-2 file:rounded file:text-white file:mr-3 file:shadow-none file:cursor-pointer rounded-lg cursor-pointer hover:bg-zinc-500 w-full px-2 p-1 mt-2 bg-white
            dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600
          border border-gray-600 focus:border-blue-500 ${
            errors[name] && "focus:!border-red-500"
          }`}
          autoComplete="off"
        />

        {errors[name] && (
          <p className="text-red-500 dark:text-red-600 mt-0.5 text-xs text-center">
            {errors[name].message}
          </p>
        )}
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className={`${className} h-16 relative ${pull && "md:col-span-2"}`}>
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {title}
        </label>
        {required && (
          <span className="text-red-600 font-bold dark:text-green-600">*</span>
        )}
        <select
          {...register(name)}
          id={name}
          autoComplete="off"
          defaultValue=""
          className={`block w-full px-2 py-1 mt-2 text-gray-700 bg-white border border-gray-300
           rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500
            dark:focus:border-blue-500 focus:outline-none text-xs
            disabled:bg-gray-200 ${errors[name] && " focus:!border-red-500"}`}
        >
          <option value="" disabled>
            {title}
          </option>

          {options.length > 0 && typeof options[0] === "object"
            ? options.map((selector, index) => {
                return (
                  <option
                    key={selector.id}
                    value={selector.id}
                    className="text-black dark:text-white"
                    // selected={selector.title == value  selector.name == value}
                  >
                    {selector.title || selector.name}
                  </option>
                );
              })
            : options.map((selector, index) => {
                return (
                  <option key={index} className="text-black">
                    {selector}
                  </option>
                );
              })}
        </select>
        {errors[name] && (
          <p className="text-xs text-center text-red-500 dark:text-red-600 mt-0.5">
            {errors[name].message}
          </p>
        )}
      </div>
    );
  }

  if (type === "checkbox") {
    return (
      <div
        className={`${className} flex items-center gap-4 ${
          pull && "md:col-span-2"
        } `}
      >
        <input
          type="checkbox"
          id={name}
          checked={isChecked}
          onClick={() => setIsChecked((prev) => !prev)}
          name={name}
          style={{ direction: direction }}
          {...register(name, { required })}
          className="w-6 h-6  text-blue-600 bg-gray-100 cursor-pointer border-gray-300 -blue-500 dark:-blue-600 dark:ring-offset-gray-800 -2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor={name}
          className="text-sm font-bold text-gray-700 dark:text-gray-200"
        >
          {title}
        </label>
        {required && (
          <span className="text-red-600 font-bold dark:text-green-600">*</span>
        )}
        {errors[name] && (
          <p className="text-xs text-center text-red-500 dark:text-red-600 mt-0.5">
            {errors[name].message}
          </p>
        )}
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={`${className} relative`}>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {title}
          {required && (
            <span className="text-red-600 font-bold dark:text-green-600">
              *
            </span>
          )}
        </label>
        <textarea
          {...register(name)}
          style={{ direction: direction }}
          required={required}
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:border-blue-500
            dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none -indigo-300"
          rows="4"
        ></textarea>
      </div>
    );
  }

  return (
    <div className={`${className} h-16 relative ${pull && "md:col-span-2"}`}>
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {title}
      </label>
      {required ? (
        <span className="text-red-600 font-bold dark:text-green-600">*</span>
      ) : (
        ""
      )}
      <input
        {...register(name)}
        type={type == "password" ? (!showPassword ? "password" : "text") : type}
        id={name}
        step="0.00001"
        autoComplete="new-password"
        placeholder={placeholder}
        style={{ direction: direction }}
        disabled={disabled}
        onWheel={(e) => e.target.blur()} // ✅ يمنع تغيير القيمة بالسكرول
        required={required}
        className={`block w-full px-2 py-1 mt-2 text-gray-700 bg-white border border-gray-300
           rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500
            dark:focus:border-blue-500 focus:outline-none 
            disabled:bg-gray-200 ${errors[name] && " focus:!border-red-500"}`}
      />
      {type == "password" ? (
        <span
          title="عرض/اخفاء كلمة المرور"
          onClick={() => setShowPassword((prev) => !prev)}
          className="hover:bg-slate-300 dark:hover:bg-slate-700 p-1 rounded-md absolute cursor-pointer bottom-[3px] right-[5px]"
        >
          {!showPassword ? (
            <FaEye className="dark:text-white" />
          ) : (
            <FaEyeSlash className="dark:text-white" />
          )}
        </span>
      ) : null}
      {errors[name] && (
        <p className="text-xs text-center text-red-500 dark:text-red-600 mt-0.5">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};
