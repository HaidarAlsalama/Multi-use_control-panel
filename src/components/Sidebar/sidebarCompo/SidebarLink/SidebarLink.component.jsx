import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import "./SidebarLink.scss";
import { useSelector } from "react-redux";
export default function SidebarLink({ item }) {
  const sidebarState = useSelector((state) => state.layout.layoutState);
  const { t } = useTranslation();
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <li>
      <Link
        to={item.url}
        className={`sidebar-link ${sidebarState} flex text-lg items-center justify-between hover:bg-red-600 hover:text-white duration-200 rounded-md md:flex-row-reverse lg:flex-row dark:hover:bg-blue-600 dark:hover:text-white
        ${
          location.pathname == item.url
            ? "text-red-600 dark:text-blue-600"
            : null
        }
        `}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div
          className={`hidden md:flex items-center gap-2 md:flex-row-reverse lg:flex-row navbarStat_e overflow-hidden`}
        >
          <div className="p-2 ">
            <item.icon />
          </div>
          <h5 className="text-lg font-semibold text-nowrap hidden lg:block">
            {t(item.title)}
          </h5>
        </div>

        <div
          className={`sm:invisible ${
            showTooltip ? "md:visible" : null
          } lg:invisible absolute hidden md:block ltr:-right-[220%] rtl:-left-[220%] w-36 min-h-10 text-nowrap_ px-3 py-2 text-sm font-medium text-gray-700 transition-opacity bg-white rounded-md shadow-2xl dark:bg-gray-700 dark:text-white tooltip`}
        >
          <div className="border-transparent absolute ltr:right-full rtl:left-full top-1/3 w-0 border-8 ltr:border-r-white rtl:border-l-white ltr:dark:border-r-gray-700 rtl:dark:border-l-gray-700 "></div>
          {t(item.title)}
        </div>
      </Link>
    </li>
  );
}
