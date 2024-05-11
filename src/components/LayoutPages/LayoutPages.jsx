import React, { useEffect, useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { FiBell } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import BreadcrumbContext from "../BreadcrumbContext/BreadcrumbContext";
import Sidebar from "../Sidebar/Sidebar";
import "./LayoutPages.scss";

const md = 768;
const lg = 1024;

const getNavbarStatus = () => {
  if (window.innerWidth >= lg) return "open";
  else if (window.innerWidth < lg && window.innerWidth >= md) return "halfOpen";
  else if (window.innerWidth < md) return "close";
};

export default function LayoutPages({ children }) {
  const location = useLocation();
  const [sidebarState, setSidebarState] = useState(getNavbarStatus);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setSidebarState(getNavbarStatus);
    });
  }, []);

  useEffect(() => {
    if (window.innerWidth < md) setSidebarState("close");
    if (window.innerWidth > md && window.innerWidth < lg)
      setSidebarState("halfOpen");
  }, [location]);

  const handleStateSidebar = () => {
    if (window.innerWidth >= lg) {
      if (sidebarState == "open") setSidebarState("halfOpen");
      if (sidebarState == "halfOpen") setSidebarState("open");
    } else if (window.innerWidth < lg && window.innerWidth >= md) {
      if (sidebarState == "openSmall") setSidebarState("halfOpen");
      if (sidebarState == "halfOpen") setSidebarState("openSmall");
    } else if (window.innerWidth < md) {
      if (sidebarState == "close") setSidebarState("openSmall");
      if (sidebarState == "openSmall") setSidebarState("close");
    }
  };

  return (
    <section className="flex  duration-50">
      <Sidebar
        sidebarState={sidebarState}
        handleStateSidebar={handleStateSidebar}
      />
      <div
        className={`${sidebarState} grid grid-cols-1 min-h-screen bg-gray-50 ltr:lg:ml-64 ltr:md:ml-16 rtl:lg:mr-64 rtl:md:mr-16 duration-50 dark:bg-gray-800 w-full layout`}
        // style={{ gridTemplateRows: "min-content auto" }}
      >
        <div className="flex md:hidden justify-between items-center mx-3 backdrop-blur-md rounded-lg bg-white/50 dark:bg-gray-800/60 mb-1.5 px-3 py-3 h-fit sticky top-1">
          <button
            className="text-2xl hover:bg-red-600 hover:text-white rounded-md p-2 duration-150 text-gray-600 dark:text-gray-300 dark:hover:bg-blue-600"
            onClick={handleStateSidebar}
          >
            <CgMenuLeft />
          </button>
          <h1 className="lg:text-5xl text-3xl font-extrabold text-red-600  dark:text-blue-600">
            Byrings
          </h1>
          <button
            className={`relative invisible_ lg:visible text-2xl hover:bg-red-600 hover:text-white rounded-md p-2 duration-150 text-gray-600 dark:text-gray-300 dark:hover:bg-blue-600 notification`}
          >
            <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 border-2 border-white rounded-full top-0 end-0 dark:border-gray-900  dark:bg-blue-600">
              2
            </div>
            <FiBell />
          </button>
        </div>

        <div
          className={`flex flex-col gap-3 md:my-4 bg-slate-200 dark:bg-gray-900 w-full rounded-lg p-2 md:p-4 overflow-x-hidden`}
        >
          <BreadcrumbContext />
          {children}
        </div>
      </div>
    </section>
  );
}
