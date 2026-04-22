import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import "./SidebarLink.scss";
export default function SidebarLink({ item }) {
  const sidebarState = useSelector((state) => state.layout.layoutState);
  const location = useLocation();

  return (
    <li>
      <Link
        to={item.url}
        className={`sidebar-link ${sidebarState} flex text-lg items-center justify-between hover:bg-gray-300 hover:text-white_ duration-200 rounded-md md:flex-row-reverse lg:flex-row dark:hover:bg-blue-600 dark:hover:text-white
        ${location.pathname == item.url ? "dark:bg-blue-600 bg-gray-300" : null}
        `}
      >
        <div
          className={`hidden md:flex relative w-full items-center gap-2 md:flex-row-reverse lg:flex-row navbarStat_e overflow-hidden`}
        >
          <div className="p-2 ">
            <item.icon />
          </div>
          <h5 className="text-sm font-semibold text-nowrap hidden lg:block">
            {item.title}
          </h5>
          {item.count ? (
            <div className="absolute inline-flex items-center p-[10px] justify-center w-fit h-5 text-xs font-semibold text-white bg-red-600 border-2 border-white rounded-full  end-1 dark:border-gray-900  dark:bg-blue-600 counter">
              <h1>{item.count}</h1>
            </div>
          ) : null}
        </div>

        <div
          className={`invisible absolute ${
            sidebarState != "halfOpen" && "hidden"
          } ltr:-right-[220%] rtl:-left-[220%] w-36 min-h-10 px-3 py-2 text-sm font-medium text-gray-700 transition-opacity bg-white rounded-md shadow-2xl_ dark:bg-gray-700 dark:text-white tooltip`}
        >
          <div className="border-transparent absolute ltr:right-full rtl:left-full top-1/3 w-0 border-8 ltr:border-r-white rtl:border-l-white ltr:dark:border-r-gray-700 rtl:dark:border-l-gray-700 "></div>
          {item.title}
        </div>
      </Link>
    </li>
  );
}
