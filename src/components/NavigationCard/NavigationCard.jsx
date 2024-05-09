import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NavigationCard({ data }) {
  const { t } = useTranslation();

  return (
    <>
      <Link
        onClick={() => data?.fun()}
        to={data.url}
        className="
            group relative flex flex-col overflow-hidden items-start w-80 h-28 p-6 pt-4  bg-white border border-gray-200 
            rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-blue-600 
            hover:bg-red-600"
      >
        <h5 className="mb-1 text-xl font-semibold text-gray-600 dark:text-white group-hover:text-white">
          {t(data.title)}
        </h5>
        <p className="text-sm font-semibold max-w-52 text-gray-500 dark:text-gray-400  group-hover:text-white">
          {t(data.description)}
        </p>
        <data.icon className="group-hover:scale-125 absolute rtl:left-3 ltr:right-3 bottom-3  text-7xl  text-gray-400 dark:text-gray-500 duration-700  group-hover:text-white" />
      </Link>
    </>
  );
}
