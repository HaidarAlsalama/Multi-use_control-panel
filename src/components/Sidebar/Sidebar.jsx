import { CgMenuLeft } from "react-icons/cg";
import { FaRegSmile } from "react-icons/fa";
import { FiBell } from "react-icons/fi";
import { LuLayoutDashboard, LuLayoutList } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { PiGearBold } from "react-icons/pi";

import "./Sidebar.scss";
import GroupLinks from "./sidebarCompo/SidebarGroupLinks/SidebarGroupLinks.component";

const listLinks = [
  { title: "Dashboard", url: "/", icon: LuLayoutDashboard },
  { title: "home", url: "/home", icon: LuLayoutList },
  {
    title: "home",
    url: "#",
    icon: LuLayoutList,
    type: "list",
    content: [
      { title: "list_1", url: "/test-1", icon: LuLayoutDashboard },
      { title: "list_2", url: "/#", icon: LuLayoutList },
    ],
  },
];

const listLinks2 = [
  { title: "Profile", url: "#", icon: FaRegSmile },
  { title: "Settings", url: "/settings", icon: PiGearBold },
  { title: "Logout", url: "#", icon: MdLogout },
];

export default function Sidebar({ sidebarState, handleStateSidebar }) {
  return (
    <>
      {sidebarState == "openSmall" ? (
        <div
          className="fixed top-0 left-0 z-30 w-full h-full bg-gray-900/50 right-0"
          onClick={() => handleStateSidebar()}
        ></div>
      ) : null}
      <aside
        className={`${sidebarState} fixed top-0 ltr:left-0 rtl:right-0-0 z-40 lg:w-64 md:w-16 w-0 h-full duration-50 sidebar`}
      >
        <div
          className="grid grid-cols-1 h-full md:px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 sidebar-content"
          style={{ gridTemplateRows: "min-content auto min-content" }}
        >
          <div
            className={`w-full flex md:flex-col lg:flex-row items-center justify-between overflow-hidden  sidebar-head`}
          >
            <button
              className="text-2xl hover:bg-red-600 hover:text-white rounded-md p-2 duration-200 text-gray-600 dark:text-gray-300 dark:hover:bg-blue-600"
              onClick={handleStateSidebar}
            >
              <CgMenuLeft />
            </button>
            <h1 className="text-4xl font-extrabold mb-1 text-red-600 dark:text-blue-600">
              Rings
            </h1>
            <button
              className={`relative invisible_ lg:visible text-2xl hover:bg-red-600 hover:text-white rounded-md p-2 duration-200 text-gray-600 dark:text-gray-300 dark:hover:bg-blue-600 notification`}
            >
              <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 border-2 border-white rounded-full -top-[2px] -left-[2px] dark:border-gray-900 dark:bg-blue-600">
                2
              </div>
              <FiBell />
            </button>
          </div>
          <GroupLinks list={listLinks} sidebarState={sidebarState} />
          <GroupLinks list={listLinks2} sidebarState={sidebarState} />
        </div>
      </aside>
    </>
  );
}
