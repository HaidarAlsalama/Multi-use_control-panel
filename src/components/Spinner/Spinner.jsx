import React from "react";

export default function Spinner({
  page = false,
  sm = false,
  xs = false,
  className = "",
}) {
  if (xs)
    return (
      <div
        className={`mx-auto inline-block h-[14px] w-[14px] animate-spin text-gray-700 rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white ${className}`}
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    );
  if (sm)
    return (
      <div
        className={`mx-auto inline-block h-6 w-6 animate-spin text-gray-700 rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white ${className}`}
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    );
  return (
    <div
      className={`w-full ${
        page ? "min-h-72" : ""
      } flex justify-center items-center  ${className} `}
    >
      <div
        className="mx-auto inline-block h-8 w-8 animate-spin text-gray-700 rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
}
