import { useEffect, useState } from "react";

export const CheckboxZod = ({
  title,
  name,
  register,
  errors,
  value,
  required = false,
  className = "",
  direction = "rtl",
}) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // تحويل القيمة الابتدائية إلى Boolean
    setIsChecked(Boolean(Number(value)));
  }, [value]);

  const handleChange = () => {
    setIsChecked((prev) => !prev);
  };

  return (
    <div className={`${className} flex items-center gap-4`}>
      <input
        type="checkbox"
        id={name}
        checked={isChecked}
        onChange={handleChange}
        name={name}
        style={{ direction: direction }}
        {...register(name)}
        className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer border-gray-300 dark:bg-gray-700 dark:border-gray-600"
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
};
