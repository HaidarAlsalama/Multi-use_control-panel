import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { PiGearBold } from "react-icons/pi";
import SidebarLink from "../SidebarLink/SidebarLink.component";
import "./SidebarListLinks.scss";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function SidebarListLinks({ list }) {
  const sidebarState = useSelector((state) => state.layoutState);
  const location = useLocation();
  const { t } = useTranslation();
  const [openList, setOpenList] = useState(false);

  useEffect(() => {
    const containsUrl = list.content.some(
      (item) => item.url === location.pathname
    );
    containsUrl ? setOpenList(true) : setOpenList(false);
  }, [location]);

  return (
    <li
      className={`flex flex-col sidebar-list-link cursor-pointer ${sidebarState}`}
      onClick={() => setOpenList((prev) => !prev)}
    >
      <div
        className={`sidebar-list-link-header flex text-lg items-center justify-between hover:bg-red-600 hover:text-white duration-200 rounded-md md:flex-row-reverse lg:flex-row dark:hover:bg-blue-600 dark:hover:text-white ${
          openList ? "bg-red-600 dark:bg-blue-600 text-white" : ""
        }`}
      >
        <div
          className={`hidden md:flex items-center gap-2 md:flex-row-reverse lg:flex-row navbarState overflow-hidden`}
        >
          <div className="p-2 ">
            <PiGearBold />
          </div>
          <h5 className="text-lg font-semibold text-nowrap hidden lg:block">
            {t(list.title)}
          </h5>
        </div>
        <div className={`items-center`}>
          {openList ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </div>
      </div>

      <ul
        className={`list flex flex-col h-0 overflow-y-hidden  gap-1 text-gray-600 dark:text-gray-300 ${
          openList ? "mt-1 !h-full" : ""
        } `}
      >
        {list.content.map((item, index) => (
          <SidebarLink key={index} item={item} sidebarState={sidebarState} />
        ))}
      </ul>
    </li>
  );
}
