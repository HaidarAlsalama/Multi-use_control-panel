import { useEffect } from "react";

export default function CustomInput({
  title,
  id,
  value,
  onChange,
  type = "text",
  direction = "rtl",
  required = false,
  isDisabled = false,
  max = "",
  min = "",
  className = "",
  options,
}) {
  const inputProps = {
    id,
    name: id,
    type,
    value,
    required,
    disabled: isDisabled,
    autoComplete: "off",
    onChange: (e) => onChange(e.target),
    style: { direction },
    className: `
      block mt-2 w-full h-11 px-4
      rounded-xl border outline-none
      bg-white/70 dark:bg-white/5
      border-gray-300 dark:border-white/10
      !focus:border-green-400
      focus:ring-2 focus:ring-green-400/30
      transition-all duration-200
      text-gray-800 dark:text-white
      disabled:bg-gray-200 dark:disabled:bg-gray-800
    `,
    ...(type === "text" && max ? { maxLength: max } : {}),
    ...(type === "text" && min ? { minLength: min } : {}),
    ...(type === "number" && max ? { max } : {}),
    ...(type === "number" && min ? { min } : {}),
  };

  useEffect(() => {
    if (
      type === "number" &&
      min &&
      (value === "" || value === undefined || value === null)
    ) {
      onChange({ name: id, value: min });
    }
  }, []);

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-white">
        {title}
        {required && <span className="text-red-500 font-bold ml-1">*</span>}
      </label>

      {type === "select" ? (
        <select {...inputProps} className={`${inputProps.className} h-11`}>
          <option value="">قم بالتحديد</option>
          {options &&
            options.split("-").map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
        </select>
      ) : (
        <input
          {...inputProps}
          onWheel={(e) => e.target.blur()}
          placeholder={
            type === "number"
              ? min && max
                ? `أقل قيمة (${min}) - أكثر قيمة (${max})`
                : min
                  ? `أقل قيمة (${min})`
                  : max
                    ? `أكثر قيمة (${max})`
                    : ""
              : ""
          }
        />
      )}
    </div>
  );
}
