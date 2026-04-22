import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaRegTrashAlt } from "react-icons/fa";
import { FcAddImage } from "react-icons/fc";
export default function ClientInputFieldZod({
  label,
  name,
  type,
  register,
  errors,
  setValue,
  resetImages,
  autoComplete = "off",
  value = undefined,
  required = false,
  className = "",
  placeholder = "",
  price = "",
  rows = 0,
  min = 0,
  max = null,
  options = [],
  childClassName = "",
  direction = "rtl",
  pull = false,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [fileArray, setFileArray] = useState([]);

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);

    console.log("before setValue - Files selected:", selectedFilesArray);

    setFileArray((previousFiles) => previousFiles.concat(selectedFilesArray));
    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file); // إنشاء رابط مؤقت لكل صورة
    });

    setSelectedImages((previousImages) => previousImages.concat(imagesArray));
    setValue(name, [...fileArray, ...selectedFilesArray]);
    console.log("after setValue - Files selected:", selectedFilesArray);
  };

  const removeImage = (imageIndex) => {
    const newSelectedImages = selectedImages.filter(
      (_, index) => index !== imageIndex,
    );
    const newFileArray = fileArray.filter((_, index) => index !== imageIndex);
    setSelectedImages(newSelectedImages);
    setFileArray(newFileArray);
    setValue(name, newFileArray);
  };
  useEffect(() => {
    if (resetImages) {
      setSelectedImages([]);
      setFileArray([]); // إعادة تعيين الصور
    }
  }, [resetImages]);

  if (type === "select") {
    return (
      <div className={`${className} h-20 ${pull && "md:col-span-2"}`}>
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-500 dark:text-gray-200"
        >
          {label}
        </label>
        {required && (
          <span className="text-red-600 font-bold dark:text-green-600">*</span>
        )}
        <select
          {...register(name)}
          id={name}
          autoComplete="off"
          defaultValue=""
          className={`block w-full px-2 py-1 mt-2 rounded-lg text-white bg-gray-500/20 border focus:border-mainLight focus:outline-none focus:!ring-0 disabled:bg-gray-200 h-9 ${
            errors[name] && " focus:!border-red-500"
          }`}
        >
          <option value="">{label}</option>

          {options.length > 0 && typeof options[0] === "object"
            ? options.map((selector, index) => {
                return (
                  <option
                    key={selector.id}
                    value={selector.id}
                    className="text-white"
                  >
                    {selector.title || selector.name}
                  </option>
                );
              })
            : options.map((selector, index) => {
                return (
                  <option key={index} className="text-white">
                    {selector}
                  </option>
                );
              })}
        </select>
        {errors[name] && (
          <p className="text-red-500 dark:text-red-600 mt-0.5 text-xs text-center">
            {errors[name].message}
          </p>
        )}
      </div>
    );
  }

  if (type === "file") {
    return (
      <div className={`${className} h-20 ${pull && "md:col-span-2"}`}>
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-500 dark:text-gray-200"
        >
          {label}
        </label>
        {required && (
          <span className="text-red-600 font-bold dark:text-green-600">*</span>
        )}

        <input
          {...register(name)}
          type="file"
          id={name}
          className={`file:outline-none bg-zinc-700 file:border-0 text-white file:bg-mainLight/80 file:py-0.5 file:px-2 file:rounded file:text-white file:mr-3 file:shadow-none file:cursor-pointer rounded-lg cursor-pointer hover:bg-zinc-500 w-full px-2 p-1 mt-2
          border border-gray-600 focus:border-yellow-500 ${
            errors[name] && "focus:!border-red-500"
          }`}
        />

        {errors[name] && (
          <p className="text-red-500 dark:text-red-600 mt-0.5 text-xs text-center">
            {errors[name].message}
          </p>
        )}
      </div>
    );
  }

  if (type === "multi-file") {
    return (
      <div className={`${className} {value}?"":h-20`}>
        <label
          htmlFor={name}
          className={`  text-sm font-semibold text-gray-700 dark:text-gray-200 `}
        >
          {label}
        </label>
        {required && (
          <span className="text-red-600 font-bold dark:text-green-600">*</span>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2  ">
          <label className="flex flex-col gap-2 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-300 h-44 cursor-pointer">
            <FcAddImage className="w-20 h-20" />
            <p className="font-semibold   text-balance text-center">
              {" "}
              Upload Room images
            </p>
            <input
              {...register(name)}
              type="file"
              multiple
              id={name}
              setValue={setValue}
              hidden
              onChange={onSelectFile}
              // accept="image/jpeg ,image/png , image/webp"
            ></input>
          </label>

          {selectedImages &&
            selectedImages.map((image, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden w-full h-44"
              >
                <img
                  src={image}
                  alt={`selected-${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-transform transform hover:scale-110"
                  onClick={() => removeImage(index)} // استدعاء دالة الحذف عند النقر
                >
                  <FaRegTrashAlt className="w-4 h-4" />
                </button>
              </div>
            ))}

          {/* {selectedImages &&
            selectedImages?.map((image) => {
              return
              <div className="flex flex-col gap-1">
<img src={image} className="rounded-lg w-full h-44 object-cover"></img>;
<button onClick={()=>}><FaRegTrashAlt/></button>
              </div>
               
            })} */}

          {/* <div className="col-span-3 bg-blue-600 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
           
            </div>
         
          </div> */}
        </div>

        {errors[name] && (
          <p className="text-red-500 dark:text-red-600 text-[13px]">
            {errors[name].message}
          </p>
        )}
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={`h-auto relative ${className}`}>
        <label
          htmlFor={name}
          className="text-sm font-semibold text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
        {required && (
          <span className="text-red-600 font-bold dark:text-green-600">*</span>
        )}
        <textarea
          {...register(name)}
          id={name}
          autoComplete={autoComplete}
          rows={rows}
          placeholder={placeholder}
          // value={value}
          className="block w-full px-4 py-1 mt-2 text-gray-700 bg-white_ bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring disabled:bg-gray-200   placeholder:text-sm
          resize-none "
        >
          {value}
        </textarea>
        {errors[name] && (
          <p className="text-red-500 dark:text-red-600 text-[13px]">
            {errors[name].message}
          </p>
        )}
      </div>
    );
  }

  if (type === "radio") {
    return (
      <div className={`${className} h-auto`}>
        <label className=" text-sm font-semibold text-gray-700 dark:text-gray-200">
          {label}
        </label>
        {required && (
          <span className="text-red-600 font-bold dark:text-green-600">*</span>
        )}
        <div className={`mt-2 ${childClassName} `}>
          {/* options={options} */}
          {options.length > 0 &&
            options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${name}-${option.value}`}
                  value={option.value}
                  name={name}
                  {...register(name, { required })}
                  className="inli mr-2 w-4 h-4  mt-1 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500_ dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2_ dark:bg-gray-700 dark:border-gray-600 "
                />

                <label
                  htmlFor={`${name}-${option.value}`}
                  className="text-sm font-semibold dark:text-gray-200"
                >
                  {option.label}
                </label>
              </div>
            ))}
        </div>
        {errors[name] && (
          <p className="text-red-500 dark:text-red-600 text-[13px]">
            {errors[name].message}
          </p>
        )}
      </div>
    );
  }

  if (type === "checkbox") {
    return (
      <div className={`${className} h-auto`}>
        {/* <div className={`mt-2 ${childClassName}`}> */}
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {label}
        </span>
        {required && (
          <span className="text-red-600 font-bold dark:text-green-600">*</span>
        )}
        <div className="mt-2  rounded-lg bg-gray-100 dark:bg-gray-600">
          {options.length > 0 &&
            options.map((item) => (
              <div
                key={item.name}
                className="flex justify-between p-2 items-center bg-gray-100_"
              >
                <label
                  htmlFor={`${name}-${item.name}`}
                  className="text-sm font-semibold dark:text-gray-200"
                >
                  {item.name}
                </label>
                <input
                  type="checkbox"
                  id={`${name}-${item.id}`}
                  value={item.name}
                  // checked={item.name == value}
                  name={`${name}-${item.id}`}
                  {...register(name, { required })}
                  disabled={disabled}
                  className="mr-2 w-4 h-4  text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            ))}
        </div>
        {errors[name] && (
          <p className="text-red-500 dark:text-red-600 text-[13px]">
            {errors[name].message}
          </p>
        )}
      </div>
    );
  }

  if (type === "price-input") {
    return (
      <div className={`${className} h-20 relative`}>
        <label
          htmlFor={name}
          className="text-sm font-semibold  text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
        {required && (
          <span className="text-red-600 font-bold dark:text-green-600">*</span>
        )}
        <div className="flex items-center  relative mt-2">
          <span className="absolute  text-center top-[9px]_ w-10 py-1 bg-gray-400 dark:bg-gray-300 rounded-lg rounded-r-none left-0 text-custom-fourcolor">
            <p className="font-extrabold text-xl">{price}</p>
          </span>

          <input
            {...register(name)}
            type="number"
            id={name}
            autoComplete={autoComplete}
            placeholder={placeholder}
            value={value}
            className={`block w-full px-4 py-1 mt-2_ pl-12 text-gray-700 bg-white_ bg-gray-100 border border-gray-300 
        rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500
        dark:focus:border-blue-500 focus:outline-none focus:ring
        disabled:bg-gray-200  placeholder:text-sm  `}
          />
        </div>
        {errors[name] && (
          <p className="text-red-500 dark:text-red-600 text-[13px]">
            {errors[name].message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${className} h-20 relative ${pull ? "md:col-span-2" : ""}`}
    >
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-500 dark:text-gray-200"
      >
        {label}
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
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        minLength={min}
        maxLength={max}
        disabled={disabled}
        step={type === "number" ? "any" : undefined}
        inputMode={type === "number" ? "decimal" : undefined}
        className={`block w-full px-2 py-1 mt-2 rounded-lg dark:text-white text-gray-800 bg-gray-500/20 border border-transparent focus:border-mainLight focus:outline-none focus:!ring-0 disabled:bg-gray-200_ dark:disabled:bg-gray-600_ h-9 ${
          errors[name] && " focus:!border-red-500"
        }`}
        style={{ direction: direction }}
      />

      {type == "password" ? (
        <span
          title="عرض/اخفاء كلمة المرور"
          onClick={() => setShowPassword((prev) => !prev)}
          className="hover:bg-mainLight hover:text-white  text-mainLight px-2 py-1 rounded-full absolute cursor-pointer bottom-[18px] right-[5px]"
        >
          {!showPassword ? (
            <FaEye className="dark:text-white " />
          ) : (
            <FaEyeSlash className="dark:text-white" />
          )}
        </span>
      ) : null}
      {errors[name] && (
        <p className="text-red-500 dark:text-red-600 mt-0.5 text-xs text-center">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}
