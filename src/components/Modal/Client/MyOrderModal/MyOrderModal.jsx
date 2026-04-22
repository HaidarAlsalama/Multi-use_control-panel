import { useMyOrderById } from "api/Client/product";
import { Spinner } from "components";
import { useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiSandsOfTime, GiTakeMyMoney } from "react-icons/gi";
import { MdNumbers } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import ClientActionModal from "../ClientActionModal/ClientActionModal";

export default function MyOrderModal({ isOpen, toggle, orderId, url }) {
  const navigate = useNavigate();

  const { data: currentOrder, isSuccess, isFetching } = useMyOrderById(orderId);

  useEffect(() => {
    return () => url && navigate("/my-account/my-orders", { replace: true });
  }, []);

  return (
    <ClientActionModal
      open={isOpen}
      close={toggle}
      size="small"
      title="تفاصيل عملية الشراء"
    >
      {isFetching && (
        <div className="flex justify-center py-10">
          <Spinner sm />
        </div>
      )}

      {isSuccess && (
        <div className="space-y-6">
          {/* ================= Main Glass Card ================= */}
          <div
            className="
              relative overflow-hidden rounded-[2.5rem] p-8
              bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-black border border-gray-200 dark:border-white/10 
              backdrop-blur-2xl shadow-md            "
          >
            <div className="relative z-10 space-y-8">
              {/* ===== Header ===== */}
              <div className="flex items-center justify-between gap-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    المبلغ الإجمالي
                  </span>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                    {Number(Math.abs(currentOrder.data.total)).toLocaleString()}
                    <span className="text-sm font-bold text-mainLight ml-2">
                      ل.س
                    </span>
                  </h2>
                </div>

                <OrderStatus state={currentOrder.data.order_state} />
              </div>

              {/* ===== Divider ===== */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent" />

              {/* ===== Order Timeline ===== */}
              <div className="grid gap-4">
                <GlassRow
                  icon={<FaMoneyBillTransfer />}
                  label="نوع العملية"
                  value="شراء منتج"
                />
                <GlassRow
                  icon={<MdNumbers />}
                  label="رقم الطلب"
                  value={currentOrder.data.id}
                />
                <GlassRow
                  icon={<GiTakeMyMoney />}
                  label="الخدمة"
                  value={currentOrder.data.service}
                />
                <GlassRow
                  icon={<SlCalender />}
                  label="التاريخ"
                  value={currentOrder.data.created_at}
                  ltr
                />
              </div>
            </div>
          </div>

          {/* ================= Order Fields ================= */}
          {!isEmpty(currentOrder.data.field) && (
            <div
              className="
                rounded-[2rem] p-6
                backdrop-blur-xl
                bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-black border border-gray-200 dark:border-white/10 shadow-md
              "
            >
              <h5 className="text-center font-black text-lg text-gray-900 dark:text-white mb-6">
                معلومات الطلب
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(currentOrder.data.field).map(([key, item]) => (
                  <div
                    key={key}
                    className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                  >
                    <span className="text-xs block text-center text-gray-500 dark:text-gray-400">
                      {item.name}
                    </span>
                    <p className="text-lg block text-center font-bold text-gray-900 dark:text-white break-words">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= Notes / Reason ================= */}
          {currentOrder.data.reason && (
            <div
              className="
                rounded-[2rem] p-6
                bg-red-500/10
                backdrop-blur-xl shadow-md
                border border-red-500/30
              "
            >
              <h5 className="text-center font-bold text-red-500 mb-4">
                {["rejected", "canceled"].includes(
                  currentOrder.data.order_state,
                )
                  ? "سبب الرفض"
                  : "ملاحظات"}
              </h5>

              <div
                className="text-gray-800 dark:text-white/80 text-center break-words"
                dangerouslySetInnerHTML={{
                  __html: currentOrder.data.reason.replace(/\n/g, "<br />"),
                }}
              />
            </div>
          )}
        </div>
      )}
    </ClientActionModal>
  );
}

/* ================= Helpers ================= */

function OrderStatus({ state }) {
  const map = {
    pending: {
      label: "قيد المعالجة",
      icon: <GiSandsOfTime />,
      className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/40",
    },
    approved: {
      label: "مكتملة",
      icon: <FaCheck />,
      className: "bg-green-500/20 text-green-500 border-green-500/40",
    },
    completed: {
      label: "مكتملة",
      icon: <FaCheck />,
      className: "bg-green-500/20 text-green-500 border-green-500/40",
    },
    rejected: {
      label: "مرفوضة",
      icon: <FaTimes />,
      className: "bg-red-500/20 text-red-500 border-red-500/40",
    },
    canceled: {
      label: "ملغاة",
      icon: <FaTimes />,
      className: "bg-red-500/20 text-red-500 border-red-500/40",
    },
  };

  const s = map[state];

  return (
    <div
      className={`
        flex items-center gap-2 px-5 py-2 rounded-full
        text-sm font-bold border backdrop-blur-md
        ${s.className}
      `}
    >
      {s.icon}
      {s.label}
    </div>
  );
}

function GlassRow({ icon, label, value, ltr }) {
  return (
    <div
      className="
        flex items-center gap-4 p-4 rounded-2xl
        bg-white/60 dark:bg-white/5
        backdrop-blur-xl
        border border-gray-200 dark:border-white/10
      "
    >
      <div className="text-xl text-mainLight">{icon}</div>
      <div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {label}
        </span>
        <p
          className={`text-sm font-bold text-gray-900 dark:text-white ${
            ltr ? "ltr" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function isEmpty(field) {
  if (!field) return true;
  if (Array.isArray(field)) return field.length === 0;
  if (typeof field === "object") return Object.keys(field).length === 0;
  return false;
}
