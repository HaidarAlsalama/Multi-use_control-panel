import { useMyBalance } from "api/Client/balance";
import useCurrentLocation from "Hooks/useCurrentLocation";
import useViewTransitionNavigate from "Hooks/useViewTransitionNavigate";
import { useEffect, useRef, useState } from "react";
import { FcBusinessman, FcPhone } from "react-icons/fc";
import { RiApps2Line, RiComputerLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { setBalance } from "store/reducers/balanceReducer";

import { FileText, Home, KeyRound, LogOut, ShoppingCart } from "lucide-react";
import { FiKey } from "react-icons/fi";

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
export default function Account() {
  const currentLocation = useCurrentLocation();
  const navigate = useViewTransitionNavigate();
  const {
    data: myBalance,
    isFetching: myBalanceIsLoading,
    isSuccess: myBalanceIsSuccess,
  } = useMyBalance();
  const { name } = useSelector((state) => state.auth);
  const { balance, totalDevice, tokens_count } = useSelector(
    (state) => state.balance,
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // لربط العنصر بالـ dropdown
  const buttonRef = useRef(null); // لربط العنصر بالزر
  const dispatch = useDispatch();
  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (myBalanceIsSuccess) {
      dispatch(
        setBalance({
          currency: myBalance?.data.currency,
          balance: myBalance?.data.balance,
          isBroker: myBalance?.data.isBroker,
          isApi: myBalance?.data.isApi,
          apiToken: myBalance?.data.apiToken,
          centerName: myBalance?.data.centerName,
          address: myBalance?.data.address,
          city: myBalance?.data.city,
          totalDevice: myBalance?.data.total_device,
          tokens_count: myBalance?.data.tokens_count,
        }),
      );
    }
  }, [myBalance]);

  // إغلاق الـ dropdown عند النقر في أي مكان آخر
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // إضافة مستمع للنقر
    document.addEventListener("mousedown", handleClickOutside);

    // إزالة المستمع عند تفريغ الـ component
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="hidden lg:inline-flex relative py-1">
      {/* الزر الرئيسي */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        className={`flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all duration-300 

                 shadow-sm
                bg-gray-100 text-slate-700
                hover:bg-gray-200
                dark:bg-white/5 dark:text-green-600
                dark:border-white/10 dark:hover:bg-white/10
                
          ${
            isOpen
              ? "bg-mainLight border-mainLight text-white shadow-lg shadow-mainLight/20"
              : "border-mainLight/30 text-mainLight hover:bg-mainLight/10"
          }`}
      >
        <RiApps2Line
          className={`text-xl transition-transform duration-500 -rotate-90 ${
            isOpen && "-scale-x-100"
          } `}
        />
      </button>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-3 w-64 top-full right-0 overflow-hidden
         
             border border-white/40 dark:border-white/10 
             rounded-[1.5rem] shadow-2xl animate-in fade-in slide-in-from-top-2 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-black"
        >
          {/* قسم المستخدم */}
          <div className="p-5 flex flex-col items-center border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
            <div
              className="relative group cursor-pointer"
              onClick={() => {
                navigate("/my-account/my-profile");
                setIsOpen(false);
              }}
            >
              <div className="p-1 rounded-full border-2 border-mainLight/20 group-hover:border-mainLight transition-colors">
                <FcBusinessman className="text-5xl" />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full"></div>
            </div>
            <h1 className="mt-3 text-sm font-bold text-gray-800 dark:text-white">
              {name}
            </h1>
            <span className="text-[10px] text-mainLight font-bold uppercase tracking-wider">
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

          {/* الروابط */}
          <ul className="p-2 space-y-1">
            {links.map((link, index) => {
              const Icon = link.icon;
              const isActive = currentLocation === link.url;
              return (
                <li key={index}>
                  <button
                    onClick={() => {
                      navigate(link.url);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group
                      ${
                        isActive
                          ? "bg-mainLight/10 text-mainLight font-bold"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-mainLight"
                      }`}
                  >
                    <span
                      className={`text-lg transition-transform duration-300 group-hover:scale-110 ${
                        isActive
                          ? "text-mainLight"
                          : "text-gray-400 dark:text-gray-500 group-hover:text-mainLight"
                      }`}
                    >
                      {typeof Icon === "function" ? <Icon /> : Icon}
                    </span>
                    <span className="text-xs">{link.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* تذييل القائمة */}
          <div className="p-3 bg-gray-50 dark:bg-white/5 text-center">
            <div className="mt-2 flex flex-col justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <RiComputerLine className="w-3 h-3" /> عدد الأجهزة المسموح
                توصيلها:{" "}
                <span className="font-bold text-green-500">{totalDevice}</span>
              </span>
              <span className="flex items-center gap-1">
                <FiKey className="w-3 h-3" /> الأجهزة التي لديها حق الوصول
                للحساب:{" "}
                <span className="font-bold text-green-500">{tokens_count}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
