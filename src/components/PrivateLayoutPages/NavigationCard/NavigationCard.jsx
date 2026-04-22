import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function NavigationCard({ data }) {
  const { t } = useTranslation();
  const { role, permissions } = useSelector((state) => state.auth);

  if (data.role.includes(role) || data.role == "any")
    if (
      !data.permission ||
      (data.permission && permissions.includes(data.permission))
    )
      return (
        <>
          <Link
            onClick={() => data.fun && data.fun()} // تحقق من وجود fun قبل استدعائها
            to={data.url}
            className="
            group relative flex flex-col overflow-hidden items-start w-80 h-28 p-6 pt-4  bg-white border border-gray-200 
            rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700
            hover:bg-gray-100"
          >
            <h5 className="mb-1 text-xl font-semibold text-gray-600 dark:text-white group-hover:text-white_">
              {t(data.title)}
            </h5>
            <p className="text-sm font-semibold max-w-52 text-gray-500 dark:text-gray-400  group-hover:text-white_">
              {t(data.description || "")}
            </p>
            <data.icon className="group-hover:scale-125 absolute rtl:left-4 ltr:right-4 bottom-4  text-7xl  text-gray-400 dark:text-gray-500 duration-700  group-hover:text-white" />
          </Link>
        </>
      );
  return null;
}
