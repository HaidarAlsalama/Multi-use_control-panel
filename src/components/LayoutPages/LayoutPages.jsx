import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  closeLayoutAction,
  halfOpenLayoutAction,
  openLayoutAction,
  openSmallLayoutAction,
} from "../../store/actions/layoutActions";
import BreadcrumbContext from "../BreadcrumbContext/BreadcrumbContext";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { _lg_size, _md_size } from "./../../config/layoutSizes";
import "./LayoutPages.scss";

export default function LayoutPages({ children }) {
  const { layoutState } = useSelector((state) => state);
  const despatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    console.log("Layout State ==> ", layoutState);
  }, [layoutState]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      getSidebarState();
    });
  }, []);

  useEffect(() => {
    if (window.innerWidth < _md_size)
      /*setSidebarState("close")*/ despatch(closeLayoutAction());
    if (window.innerWidth > _md_size && window.innerWidth < _lg_size)
      /*setSidebarState("halfOpen");*/ despatch(halfOpenLayoutAction());
  }, [location]);

  const handleStateSidebar = () => {
    if (window.innerWidth >= _lg_size) {
      if (layoutState == "open")
        /*setSidebarState("halfOpen")*/ despatch(halfOpenLayoutAction());
      if (layoutState == "halfOpen")
        /*setSidebarState("open")*/ despatch(openLayoutAction());
    } else if (window.innerWidth < _lg_size && window.innerWidth >= _md_size) {
      if (layoutState == "openSmall")
        /*setSidebarState("halfOpen")*/ despatch(halfOpenLayoutAction());
      if (layoutState == "halfOpen")
        /*setSidebarState("openSmall")*/ despatch(openSmallLayoutAction());
    } else if (window.innerWidth < _md_size) {
      if (layoutState == "close")
        /*setSidebarState("openSmall")*/ despatch(openSmallLayoutAction());
      if (layoutState == "openSmall")
        /*setSidebarState("close")*/ despatch(closeLayoutAction());
    }
  };

  const getSidebarState = () => {
    if (window.innerWidth >= _lg_size) despatch(openLayoutAction());
    else if (window.innerWidth < _lg_size && window.innerWidth >= _md_size)
      despatch(halfOpenLayoutAction());
    else if (window.innerWidth < _md_size) despatch(closeLayoutAction());
  };

  return (
    <section className="flex  duration-50">
      <Sidebar handleStateSidebar={handleStateSidebar} />
      <div
        className={`${layoutState} grid grid-cols-1 min-h-screen bg-gray-50 ltr:lg:ml-64 ltr:md:ml-16 rtl:lg:mr-64 rtl:md:mr-16 duration-50 dark:bg-gray-800 w-full layout`}
        // style={{ gridTemplateRows: "min-content auto" }}
      >
        <Navbar action={handleStateSidebar} />
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
