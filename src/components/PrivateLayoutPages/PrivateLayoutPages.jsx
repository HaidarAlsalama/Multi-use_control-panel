import BreadcrumbContext from "components/PrivateLayoutPages/BreadcrumbContext/BreadcrumbContext";
import { _lg_size, _md_size } from "config/layoutSizes";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { close, open, openHalf, openSmall } from "store/reducers/layoutReducer";
import Navbar from "./Navbar/Navbar";
import "./PrivateLayoutPages.scss";
import Sidebar from "./Sidebar/Sidebar";

export default function LayoutPages() {
  const { layoutState } = useSelector((state) => state.layout);
  const dispatch = useDispatch();
  const location = useLocation();
  const memoizedOutlet = useMemo(() => <Outlet />, [location.pathname]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      getSidebarState();
    });
  }, []);

  useEffect(() => {
    if (window.innerWidth < _md_size)
      /*setSidebarState("close")*/ dispatch(close());
    if (window.innerWidth > _md_size && window.innerWidth < _lg_size)
      /*setSidebarState("halfOpen");*/ dispatch(openHalf());
  }, [location]);

  const handleStateSidebar = useCallback(() => {
    if (window.innerWidth >= _lg_size) {
      dispatch(layoutState === "open" ? openHalf() : open());
    } else if (window.innerWidth < _lg_size && window.innerWidth >= _md_size) {
      dispatch(layoutState === "openSmall" ? openHalf() : openSmall());
    } else if (window.innerWidth < _md_size) {
      dispatch(layoutState === "close" ? openSmall() : close());
    }
  }, [layoutState, dispatch]);

  const getSidebarState = () => {
    if (window.innerWidth >= _lg_size) dispatch(open());
    else if (window.innerWidth < _lg_size && window.innerWidth >= _md_size)
      dispatch(openHalf());
    else if (window.innerWidth < _md_size) dispatch(close());
  };

  return (
    <section className="flex">
      <Sidebar handleStateSidebar={handleStateSidebar} />
      <div
        className={`${layoutState} grid grid-cols-1 min-h-screen bg-gray-50 ltr:lg:ml-64 ltr:md:ml-16 rtl:lg:mr-64 rtl:md:mr-16 duration-150 dark:bg-gray-800 w-full layout`}
      >
        <Navbar action={handleStateSidebar} />
        <div
          className={`flex flex-col gap-3 md:my-4 bg-slate-200 dark:bg-gray-900 w-full rounded-lg p-2 md:p-4 duration-150 overflow-x-hidden`}
        >
          <BreadcrumbContext />
          {memoizedOutlet}
        </div>
      </div>
      {/* <ThemeToggle /> */}
    </section>
  );
}
