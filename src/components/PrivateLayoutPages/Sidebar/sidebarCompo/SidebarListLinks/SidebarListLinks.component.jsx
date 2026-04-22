import { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import SidebarLink from "../SidebarLink/SidebarLink.component";
import "./SidebarListLinks.scss";

export default function SidebarListLinks({ list }) {
  const { permissions } = useSelector((state) => state.auth);
  const sidebarState = useSelector((state) => state.layout.layoutState);
  const location = useLocation();
  const [openList, setOpenList] = useState(false);

  useEffect(() => {
    const containsUrl = list.content.some(
      (item) => item.url === location.pathname
    );
    containsUrl ? setOpenList(true) : setOpenList(false);
  }, [location]);

  const hasValidPermission = (itemPermission) => {
    return itemPermission ? permissions.includes(itemPermission) : true; // If permission is not defined, return true
  };

  return (
    <li
      className={`flex flex-col sidebar-list-link cursor-pointer ${sidebarState}`}
      onClick={() => setOpenList((prev) => !prev)}
    >
      <div
        className={`sidebar-list-link-header flex text-lg items-center justify-between hover:bg-gray-300 hover:text-white_ duration-200 rounded-md md:flex-row-reverse lg:flex-row dark:hover:bg-blue-600 dark:hover:text-white ${
          openList ? "bg-gray-300 dark:bg-blue-600 text-white_" : ""
        }`}
      >
        <div
          className={`hidden md:flex items-center gap-2 md:flex-row-reverse lg:flex-row navbarState overflow-hidden`}
        >
          <div className="p-2 ">
            <list.icon />
          </div>
          <h5 className="text-sm font-medium text-nowrap hidden lg:block">
            {list.title}
          </h5>
        </div>
        <div className={`items-center`}>
          {openList ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </div>
        <div
          className={`invisible absolute ${
            sidebarState != "halfOpen" && "hidden"
          } ltr:-right-[220%] rtl:-left-[220%] w-36 min-h-10 px-3 py-2 text-sm font-medium text-gray-700 transition-opacity bg-white rounded-md shadow-2xl_ dark:bg-gray-700 dark:text-white tooltipList`}
        >
          <div className="border-transparent absolute ltr:right-full rtl:left-full top-1/3 w-0 border-8 ltr:border-r-white rtl:border-l-white ltr:dark:border-r-gray-700 rtl:dark:border-l-gray-700 "></div>
          {list.title}
        </div>
      </div>

      <ul
        className={`list flex flex-col h-0 overflow-y-hidden  gap-1 text-gray-600 dark:text-gray-300 ${
          openList && "mt-1 !h-full"
        } `}
      >
        {list.content.map(
          (item, index) =>
            hasValidPermission(item.permission) && (
              <SidebarLink
                key={index}
                item={item}
                sidebarState={sidebarState}
              />
            )
        )}
      </ul>
    </li>
  );
}
