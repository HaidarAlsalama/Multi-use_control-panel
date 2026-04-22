import { useMyPaymentById } from "api/Client/balance";
import { GiSandsOfTime } from "react-icons/gi";
import ClientActionModal from "../ClientActionModal/ClientActionModal";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdNumbers } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { image_host } from "config/api_host";
import { Spinner } from "components";

export default function MyPaymentModal({ isOpen, toggle, paymentId }) {
  const {
    data: currentPayment,
    isSuccess: currentPaymentIsSuccess,
    isFetching: currentPaymentIsFetching,
  } = useMyPaymentById(paymentId);

  const openImageInPopup = (url, title, width = 600, height = 400) => {
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const newWindow = window.open(
      "",
      title,
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`,
    );

    if (newWindow) {
      // كتابة HTML مخصص داخل النافذة المنبثقة
      newWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
        </head>
        <body style="margin: 0; padding: 0;">
          <img src="${url}" style="width: 100%; height: 100%; object-fit: contain;" />
        </body>
      </html>
    `);
      newWindow.document.close(); // إغلاق المستند لضمان ظهور المحتوى
    }
  };

  return (
    <ClientActionModal
      open={isOpen}
      close={toggle}
      size="xSmall"
      title={"تفاصيل دفعة"}
    >
      {currentPaymentIsFetching ? (
        <div className="bg-yellow-500 p-5 flex justify-center items-center rounded-md shadow-md mx-auto">
          <Spinner sm />
        </div>
      ) : (
        currentPaymentIsSuccess && (
          <div className="grid grid-cols-1 gap-4 my-4">
            <div className="bg-zinc-900/80 grid gap-1 h-fit text-white p-6 rounded-2xl shadow-lg border border-yellow-500 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-center flex-row-reverse">
                {" "}
                <h2
                  className="text-xl font-bold text-yellow-500"
                  style={{ direction: "ltr" }}
                >
                  {Number(currentPayment.data.amount).toLocaleString()}{" "}
                  <span className="text-sm">
                    {currentPayment.data.order_type === "bankNotice"
                      ? currentPayment.data.currncy_bank
                      : currentPayment.data.currency_customer}
                  </span>{" "}
                </h2>
                <div
                  className={`text-gray-400 items-center flex gap-3 ${
                    currentPayment.data.state_notify === "pending"
                      ? "text-yellow-500"
                      : currentPayment.data.state_notify === "approved"
                        ? "text-green-500"
                        : currentPayment.data.state_notify === "rejected"
                          ? "text-red-500"
                          : "text-gray-400"
                  }`}
                >
                  <div className="text-xl p-1 text-yellow-500">
                    <GiSandsOfTime />
                  </div>
                  <span className="font-bold">
                    {" "}
                    {currentPayment.data.state_notify === "pending"
                      ? "انتظار"
                      : currentPayment.data.state_notify === "approved"
                        ? "مكتمل"
                        : currentPayment.data.state_notify === "rejected"
                          ? "مرفوضة"
                          : "- - - -"}
                  </span>
                </div>
              </div>
              <div className={`text-gray-400 items-center flex gap-3`}>
                <div className="text-xl p-1 text-yellow-500">
                  <FaMoneyBillTransfer />
                </div>
                <span className="font-bold">
                  {" "}
                  {currentPayment.data.order_type === "bankNotice"
                    ? "اشعار بنكي"
                    : currentPayment.data.order_type === "balanceRecharge"
                      ? "تغذية حساب"
                      : "- - - -"}
                </span>
              </div>
              <div
                className={`text-gray-400 items-center flex gap-3 break-all`}
              >
                <div className="text-xl p-1 text-yellow-500">
                  <MdNumbers />
                </div>
                <span className="font-bold">
                  {" "}
                  {currentPayment.data.notify_number}
                </span>
              </div>
              <div className="text-gray-400 items-center text-sm flex gap-3">
                <div className="text-xl p-1 text-yellow-500">
                  <GiTakeMyMoney />
                </div>{" "}
                <span className="font-bold">{currentPayment.data.notes}</span>
              </div>

              <div className="text-gray-400 items-center flex gap-3">
                <div className="text-xl p-1 text-yellow-500">
                  <SlCalender />
                </div>{" "}
                <span style={{ direction: "ltr" }} className="font-bold">
                  {" "}
                  {currentPayment.data.created_at}{" "}
                </span>
              </div>
              <div className="text-gray-400 items-center flex gap-3">
                <div className="p-1 text-yellow-500 font-bold">
                  {"المبلغ المضاف:"}
                </div>{" "}
                <span style={{ direction: "ltr" }} className="font-bold">
                  {" "}
                  {Number(
                    currentPayment.data.total_amount,
                  ).toLocaleString()}{" "}
                  <span className="text-xs">
                    {currentPayment.data.currency_customer /* || "S.P" */}
                  </span>
                </span>
              </div>
            </div>

            {currentPayment.data.rejection_reason && (
              <div className="bg-zinc-900/80 p-6 rounded-2xl shadow-lg border border-yellow-500 hover:shadow-xl transition-shadow">
                <h5 className="text-center font-bold text-lg text-yellow-500 mb-4">
                  {currentPayment.data.state_notify === "rejected"
                    ? "سبب الرفض"
                    : "الملاحظات"}
                </h5>
                <h5
                  className="text-gray-400 font-bold"
                  dangerouslySetInnerHTML={{
                    __html: currentPayment.data?.rejection_reason?.replace(
                      /\n/g,
                      "<br />",
                    ),
                  }}
                ></h5>
              </div>
            )}

            {currentPayment.data.notify_image && (
              <div className="bg-zinc-900/80 p-6 rounded-2xl shadow-lg border border-yellow-500 hover:shadow-xl transition-shadow">
                <h5 className="text-center font-bold text-lg text-yellow-500 mb-4">
                  صورة الاشعار
                </h5>

                <img
                  onClick={() =>
                    openImageInPopup(
                      `${image_host}${currentPayment.data.notify_image}`,
                      `المركز: ${currentPayment.data.center_name} | رقم الاشعار: ${currentPayment.data.notify_number} |`,
                      800, // العرض
                      600, // الارتفاع
                    )
                  }
                  src={`${image_host}${currentPayment.data.notify_image}`}
                  style={{ margin: "auto" }}
                  className="rounded-xl cursor-pointer !mx-auto"
                />
              </div>
            )}
          </div>
        )
      )}
    </ClientActionModal>
  );
}
