import useCurrentLocation from "Hooks/useCurrentLocation";
import useViewTransitionNavigate from "Hooks/useViewTransitionNavigate";
import PropTypes from "prop-types";
import { FcBusinessman } from "react-icons/fc";
import { useSelector } from "react-redux";

import { FileText, Home, KeyRound, LogOut, ShoppingCart } from "lucide-react";
import { FiKey } from "react-icons/fi";
import { RiComputerLine } from "react-icons/ri";

const links = [
  {
    url: "/my-account",
    icon: <Home className="w-5 h-5 text-green-500" />,
    title: "الصفحة الرئيسية", // بدل "الرئيسية"
  },

  {
    url: "/my-account/my-orders",
    icon: <ShoppingCart className="w-5 h-5 text-red-500" />,
    title: "طلباتي الحالية", // بدل "طلباتي"
  },
  {
    url: "/my-account/financial-statement",
    icon: <FileText className="w-5 h-5 text-purple-500" />,
    title: "البيانات المالية", // بدل "البيان المالي"
  },

  {
    title: "تغيير رمز PIN", // بدل "تغير رمز الـ PIN"
    url: "/my-account/change-pin",
    icon: <KeyRound className="w-5 h-5 text-orange-500" />,
  },
  {
    title: "تسجيل الخروج من الحساب", // بدل "تسجيل الخروج"
    url: "/logout",
    icon: <LogOut className="w-5 h-5 text-red-500" />,
  },
];

const SidebarLink = ({ link, navigate, isActive }) => (
  <li className="list-none">
    <div
      onClick={() => navigate(link.url)}
      className={`px-4 py-3 rounded-2xl transition-all duration-300 flex gap-3 items-center group cursor-pointer text-sm mb-1
        ${
          isActive
            ? "bg-mainLight/10 text-mainLight font-bold shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 hover:text-mainLight"
        }`}
    >
      <span
        className={`text-xl transition-transform duration-300 group-hover:scale-110 ${
          isActive
            ? "text-mainLight"
            : "text-gray-400 dark:text-gray-500 group-hover:text-mainLight"
        }`}
      >
        {link.icon}
      </span>
      {link.title}
    </div>
  </li>
);

SidebarLink.propTypes = {
  link: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default function Sidebar({ isOpen, toggle }) {
  const currentLocation = useCurrentLocation();
  const navigate = useViewTransitionNavigate();
  const { name } = useSelector((state) => state.auth);
  const { balance, totalDevice, tokens_count } = useSelector(
    (state) => state.balance,
  );

  return (
    <>
      <aside
        className={`fixed overflow-y-auto z-50 w-64 flex flex-col top-16 bottom-0 py-4 px-3
          bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-black backdrop-blur-xl border-l border-gray-200 dark:border-white/5
          transition-all duration-500 ease-in-out lg:hidden
          ${isOpen ? "right-0 shadow-2xl" : "-right-64 shadow-none"}`}
      >
        {/* User Profile Section */}
        <div className="flex flex-col items-center py-6 px-4 mb-4 rounded-[2rem] bg-white/50 dark:bg-white/5 border border-white dark:border-white/5 shadow-sm">
          <div
            className="relative group cursor-pointer"
            onClick={() => navigate("/my-account/my-profile")}
          >
            <div className="p-1 rounded-full border-2 border-mainLight/20 group-hover:border-mainLight transition-colors">
              <FcBusinessman className="text-7xl shadow-sm" />
            </div>
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
          </div>
          <h1 className="mt-4 text-base font-bold text-gray-800 dark:text-white">
            {name}
          </h1>
          <span className="text-[10px] text-mainLight font-bold uppercase tracking-[2px] mt-1">
            الحساب الشخصي
          </span>
          <h1 className="mt-3 text-sm font-bold text-gray-800 dark:text-white">
            الرصيد
          </h1>
          {balance < 0 ? (
            <span
              // dir="ltr"
              className="text-[10px]_ text-red-500 font-bold uppercase tracking-wider"
            >
              {balance} <span className="text-xs">ل.س</span>
            </span>
          ) : (
            <span
              // dir="ltr"
              className="text-[10px]_ text-mainLight font-bold uppercase tracking-wider"
            >
              {balance} <span className="text-xs">ل.س</span>
            </span>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex flex-col justify-between flex-1">
          <div>
            <ul className="space-y-1">
              {links.map((link, index) => (
                <SidebarLink
                  key={index}
                  link={link}
                  navigate={navigate}
                  isActive={currentLocation === link.url}
                />
              ))}
            </ul>
          </div>

          {/* <div className="pt-4 border-t border-gray-200 dark:border-white/5">
            <ul className="space-y-1">
              {settingsLinks.map((link, index) => (
                <SidebarLink
                  key={index}
                  link={link}
                  navigate={navigate}
                  isActive={currentLocation === link.url}
                />
              ))}
            </ul>
            <div className="mt-6 text-center italic opacity-30 text-[10px] dark:text-white">
              المحترف © 2025
            </div>
          </div> */}
        </nav>
        <div className="mt-2 flex flex-col justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <RiComputerLine className="w-3 h-3" /> عدد الأجهزة المسموح توصيلها:{" "}
            <span className="font-bold text-green-500">{totalDevice}</span>
          </span>
          <span className="flex items-center gap-1">
            <FiKey className="w-3 h-3" /> الأجهزة التي لديها حق الوصول للحساب:{" "}
            <span className="font-bold text-green-500">{tokens_count}</span>
          </span>
        </div>
      </aside>

      {/* Modern Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 bg-gray-900/20 backdrop-blur-[2px] z-40 lg:hidden transition-opacity"
          onClick={() => toggle(false)}
        ></div>
      )}
    </>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
