import {
  useCustomerViewSate,
  useCustomerViewToggle,
} from "api/admin/customerView";
import { useBackup } from "api/admin/global";
import { createAlert } from "components/Alert/Alert";
import ActionModal from "components/Modal/ActionModal/ActionModal";
import NavigationCard from "components/PrivateLayoutPages/NavigationCard/NavigationCard";
import { useState } from "react";
import { FaTelegram, FaTelegramPlane } from "react-icons/fa";
import {
  FcCurrencyExchange,
  FcDataBackup,
  FcIdea,
  FcInvite,
  FcKey,
  FcLockPortrait,
  FcMultipleDevices,
  FcSafe,
  FcTemplate,
} from "react-icons/fc";
import { useSelector } from "react-redux";
const cards = [
  {
    title: "سعر الصرف",
    description: "اضافة وعرض وتعديل سعر الصرف.",
    url: "exchange-rate",
    icon: FcCurrencyExchange,
    role: ["any"],
  },
  {
    title: "تواصل معنا",
    description: "اضافة وعرض وتعديل معلومات التواصل.",
    url: "contact-us",
    icon: FcInvite,
    role: ["any"],
  },
  {
    title: "تعزيز الأمان",
    description:
      "عزز أمان حسابك المحالي بإضافة البصمة او كلمة مرور. (ميزة تجريبية)",
    url: "enhance-security",
    icon: FcSafe,
    role: ["any"],
  },
  {
    title: "تغيير الثيم",
    description: "التبديل بين الوضع الليلي والوضع النهاري",
    url: "#",
    fun() {
      document.documentElement.classList.toggle("dark");
      if (document.documentElement.classList.contains("dark")) {
        localStorage.setItem("themeMode", "dark");
      } else {
        localStorage.setItem("themeMode", "");
      }
    },
    icon: FcIdea,
    role: ["any"],
  },
  {
    title: "تغيير كلمة المرور",
    description: "تحديث كلمة مرور الحساب لضمان الأمان.",
    url: "change-password",
    icon: FcKey,
    role: ["any"],
  },
];

export default function Settings() {
  return (
    <div className="flex gap-6 w-full flex-wrap justify-center md:justify-start h-fit">
      {cards.map((card, index) => (
        <NavigationCard data={card} key={index} />
      ))}
      <SS />
      {/* <Backup /> */}
      {/* <TurnOnTelegramNotinication /> */}
    </div>
  );
}

function TurnOnTelegramNotinication() {
  const [telegramModal, setTelegramModal] = useState(false);
  const { token } = useSelector((state) => state.auth);
  return (
    <>
      <div
        onClick={() => setTelegramModal((p) => !p)} // تحقق من وجود fun قبل استدعائها
        className={`
               group relative flex flex-col overflow-hidden items-start w-80 h-28 p-6 pt-4  bg-white border border-gray-200 
            rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700
            hover:bg-gray-100 cursor-pointer`}
      >
        {" "}
        <h5 className="mb-1 text-xl font-semibold text-gray-600 dark:text-white group-hover:text-white_">
          تفعيل اشعارات التيليغرام
        </h5>
        <FcMultipleDevices className="group-hover:scale-125 absolute rtl:left-4 ltr:right-4 bottom-4  text-7xl  text-gray-400 dark:text-gray-500 duration-700  group-hover:text-white" />
      </div>
      {telegramModal && (
        <ActionModal
          open={telegramModal}
          close={setTelegramModal}
          size={"xSmall"}
          title={" تفعيل اشعارات التيليغرام"}
        >
          <h5 className="text-gray-800 dark:text-white">
            1️⃣ انسخ الرمز السري من هنا
          </h5>

          <h5 className="text-blue-500" dir="ltr">{`/start ${token}`}</h5>
          <button
            className="btn btn-info"
            onClick={() => {
              navigator.clipboard.writeText(`/start ${token}`);
              createAlert("Success", "✅ تم نسخ الرمز بنجاح!");
            }}
          >
            نسخ الرمز
          </button>

          <h5 className="text-gray-800 dark:text-white">
            2️⃣ ادخل الى بوت التيليغرام وقم بارسال الرمز السري له{" "}
          </h5>
          <a
            className="btn btn-info cursor-pointer"
            href={`https://t.me/almohtarefNotification_bot`}
          >
            الانتقال الى بوت التيليغرام
          </a>
        </ActionModal>
      )}
    </>
  );
}

function SS() {
  const { data, isSuccess } = useCustomerViewSate();
  const {
    mutate: CustomerViewToggle,
    isPending: IsPendingCustomerViewToggle,
    isSuccess: IsSuccessCustomerViewToggle,
  } = useCustomerViewToggle();

  if (!isSuccess || IsPendingCustomerViewToggle) return;
  return (
    <div
      onClick={() => CustomerViewToggle({ enabled: data.maintenance })} // تحقق من وجود fun قبل استدعائها
      className={`
                group relative flex flex-col overflow-hidden items-start w-80 h-28 p-6 pt-4  border  
                rounded-lg shadow 
                 cursor-pointer ${
                   !data.maintenance
                     ? "!bg-green-500 border-green-300 hover:bg-green-600"
                     : "!bg-red-500 border-red-300 hover:bg-red-600"
                 }`}
    >
      <h5 className="mb-1 text-xl font-semibold text-white group-hover:text-white_">
        حالة واجهة الزبون{" "}
      </h5>
      <p className="text-sm font-semibold max-w-52 text-white">
        {data.message}
      </p>
      <FcLockPortrait className="group-hover:scale-125 absolute rtl:left-4 ltr:right-4 bottom-4  text-7xl  text-gray-400 dark:text-gray-500 duration-700  group-hover:text-white" />
    </div>
  );
}

function Backup() {
  const { mutate: getBackup, isPending, isSuccess } = useBackup();

  return (
    <div
      onClick={() => {
        if (!isPending && !isSuccess) {
          getBackup();
        }
      }}
      className={`
                group relative flex flex-col overflow-hidden items-start w-80 h-28 p-6 pt-4  bg-white border border-gray-200 
                rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700
                hover:bg-gray-100 cursor-pointer ${
                  isPending &&
                  "!cursor-not-allowed !bg-cyan-500 !border-cyan-400"
                }
                ${
                  isSuccess &&
                  "!cursor-not-allowed !bg-green-500 !border-green-400"
                }`}
    >
      <h5 className="mb-1 text-xl font-semibold  text-gray-600 dark:text-white  group-hover:text-white_">
        اخذ نسخة احتياطية
      </h5>
      <p className="text-sm font-semibold max-w-52 text-gray-500 dark:text-white ">
        اخد نسخة احتياطية لبيانات الموقع
      </p>
      <FcDataBackup className="group-hover:scale-125 absolute rtl:left-4 ltr:right-4 bottom-4  text-7xl  text-gray-400 dark:text-gray-500 duration-700  group-hover:text-white" />
    </div>
  );
}
