import { useMyFinancialStatementById } from "api/Client/balance";
import { Spinner } from "components";
import { image_host } from "config/api_host";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiSandsOfTime, GiTakeMyMoney } from "react-icons/gi";
import { GrCart } from "react-icons/gr";
import { MdNumbers } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { formatTotalAfterDisplay } from "utils/transactionBalance";
import ClientActionModal from "../ClientActionModal/ClientActionModal";

/* ================= Popup Image ================= */
const openImageInPopup = (url, title, width = 800, height = 600) => {
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  const win = window.open(
    "",
    title,
    `width=${width},height=${height},top=${top},left=${left},resizable=yes`,
  );

  if (win) {
    win.document.write(`
      <html>
        <head><title>${title}</title></head>
        <body style="margin:0;background:#000">
          <img src="${url}" style="width:100%;height:100%;object-fit:contain"/>
        </body>
      </html>
    `);
    win.document.close();
  }
};

/* ================= Component ================= */
export default function MyFinancialStatementModal({
  isOpen,
  toggle,
  financialId,
}) {
  const { data, isFetching, isSuccess } =
    useMyFinancialStatementById(financialId);

  return (
    <ClientActionModal
      open={isOpen}
      close={toggle}
      size="small"
      title="تفاصيل البيان المالي"
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
              bg-gradient-to-br from-green-50 via-white to-green-100
              dark:from-gray-900 dark:via-gray-950 dark:to-black
              border border-gray-200 dark:border-white/10
              backdrop-blur-2xl shadow-md
            "
          >
            <div className="relative z-10 space-y-8">
              {/* ===== Header ===== */}
              <div className="flex justify-between items-center gap-6">
                <div>
                  <span className="text-xs tracking-widest text-gray-500 dark:text-gray-400">
                    قيمة العملية
                  </span>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                    {Number(Math.abs(data.data.amount)).toLocaleString()}
                    <span className="text-sm text-mainLight ml-2">
                      ل.س
                      {/* {data.data.order_type === "bankNotice"
                        ? data.data.currency_bank
                        : data.data.currency_customer} */}
                    </span>
                  </h2>
                </div>

                <OrderStatus state={data.data.order_state} />
              </div>

              <Divider />

              {/* ===== Timeline ===== */}
              <div className="grid gap-4">
                <GlassRow
                  icon={<FaMoneyBillTransfer />}
                  label="نوع العملية"
                  value={mapOrderType(data.data.order_type)}
                />

                <GlassRow
                  icon={<MdNumbers />}
                  label="رقم العملية"
                  value={data.data.uuid}
                  ltr
                />

                <GlassRow
                  icon={
                    data.data.order_type === "refund" ||
                    data.data.order_type === "purchaseInvoice" ? (
                      <GrCart />
                    ) : (
                      <GiTakeMyMoney />
                    )
                  }
                  label="الوصف"
                  value={data.data.description}
                />

                <GlassRow
                  icon={<SlCalender />}
                  label="التاريخ"
                  value={data.data.created_at}
                  ltr
                />
              </div>

              {/* ===== Balances ===== */}
              <Divider />

              <div className="grid gap-4">
                {data.data.order_type === "bankNotice" && (
                  <GlassRow
                    label="الرصيد المضاف"
                    value={`${Number(data.data.total_amount).toLocaleString()} ${data.data.currency_customer}`}
                  />
                )}

                <GlassRow
                  label="الرصيد قبل العملية"
                  value={`${Number(
                    data.data.total_before_operation,
                  ).toLocaleString()} ${data.data.currency_customer}`}
                />
                <GlassRow
                  label="الرصيد بعد العملية"
                  value={
                    formatTotalAfterDisplay(data.data) === "—"
                      ? "—"
                      : `${formatTotalAfterDisplay(data.data)} ${data.data.currency_customer ?? ""}`.trim()
                  }
                />
              </div>
            </div>
          </div>

          {/* ================= Fields ================= */}
          {!isEmpty(data.data.order_fields) && (
            <GlassSection title="معلومات الطلب">
              {Object.entries(data.data.order_fields).map(([key, item]) => (
                <GlassMiniCard key={key} title={item.name} value={item.value} />
              ))}
            </GlassSection>
          )}

          {/* ================= Notes ================= */}
          {(data.data.rejection_reason || data.data.reason) && (
            <GlassAlert
              title={
                ["rejected", "canceled"].includes(data.data.order_state)
                  ? "سبب الرفض"
                  : "ملاحظات"
              }
              html={(
                data.data.rejection_reason ||
                data.data.reason ||
                ""
              ).replace(/\n/g, "<br />")}
            />
          )}

          {/* ================= Image ================= */}
          {data.data.notify_image && (
            <GlassSection title="صورة الإشعار">
              <img
                onClick={() =>
                  openImageInPopup(
                    `${image_host}${data.data.notify_image}`,
                    "صورة الإشعار",
                  )
                }
                src={`${image_host}${data.data.notify_image}`}
                className="rounded-2xl cursor-pointer mx-auto"
              />
            </GlassSection>
          )}
        </div>
      )}
    </ClientActionModal>
  );
}

/* ================= UI Helpers ================= */

const Divider = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent" />
);

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
      className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold border backdrop-blur-md ${s.className}`}
    >
      {s.icon}
      {s.label}
    </div>
  );
}

function GlassRow({ icon, label, value, ltr }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-xl">
      {icon && <div className="text-xl text-mainLight">{icon}</div>}
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

const GlassSection = ({ title, children }) => (
  <div className="rounded-[2rem] p-6 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-black border border-gray-200 dark:border-white/10 backdrop-blur-xl shadow-md">
    <h5 className="text-center font-black text-lg text-gray-900 dark:text-white mb-6">
      {title}
    </h5>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{children}</div>
  </div>
);

const GlassMiniCard = ({ title, value }) => (
  <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
    <span className="text-xs text-gray-500 dark:text-gray-400">{title}</span>
    <p className="text-lg font-bold text-gray-900 dark:text-white break-words">
      {value}
    </p>
  </div>
);

const GlassAlert = ({ title, html }) => (
  <div className="rounded-[2rem] p-6 bg-red-500/10 border border-red-500/30 backdrop-blur-xl shadow-md">
    <h5 className="text-center font-bold text-red-500 mb-4">{title}</h5>
    <div
      className="text-gray-800 dark:text-white/80 text-center break-words"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  </div>
);

/* ================= Utils ================= */

const mapOrderType = (type) =>
  ({
    bankNotice: "إشعار بنكي",
    balanceRecharge: "تغذية حساب",
    transaction: "إرسال رصيد",
    refund: "مرتجع",
    purchaseInvoice: "فاتورة شراء",
  })[type] || "- - -";

function isEmpty(field) {
  if (!field) return true;
  if (Array.isArray(field)) return field.length === 0;
  if (typeof field === "object") return Object.keys(field).length === 0;
  return false;
}
