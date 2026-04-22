import { useFinancialStatementById } from "api/admin/financialStatement";
import { Spinner } from "components";
import ActionModal from "components/Modal/ActionModal/ActionModal";
import { image_host } from "config/api_host";

export default function FinancialStatmentInfoModal({
  isOpen,
  toggle,
  paymentId,
}) {
  const {
    data: currentPayment,
    isSuccess: currentPaymentIsSuccess,
    isFetching: currentPaymentIsFetching,
  } = useFinancialStatementById(paymentId);

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
    <ActionModal
      open={isOpen}
      close={toggle}
      size="small"
      title={"تفاصيل عملية"}
    >
      {currentPaymentIsFetching ? (
        <Spinner />
      ) : (
        currentPaymentIsSuccess && (
          <div className="grid grid-cols-1 gap-4 my-4">
            <div className="dark:bg-gray-800 bg-white p-4 rounded-xl shadow-xl   transform">
              {/* Header */}
              <div className="flex flex-row-reverse justify-between items-center mb-6">
                <h2
                  className="text-3xl font-extrabold text-yellow-500"
                  style={{ direction: "ltr" }}
                >
                  {Number(
                    currentPayment.data.order_type === "refund"
                      ? Math.abs(currentPayment.data.amount)
                      : currentPayment.data.amount,
                  ).toLocaleString()}{" "}
                  <span className="text-sm">
                    {currentPayment.data.order_type === "bankNotice"
                      ? currentPayment.data.currency_bank
                      : currentPayment.data.currency_customer}
                  </span>
                </h2>
                <span
                  className={`font-semibold px-3 py-2 rounded-xl w-24 text-center ${
                    currentPayment.data.order_state === "pending"
                      ? "bg-yellow-200 text-yellow-600"
                      : currentPayment.data.order_state === "approved"
                        ? "bg-green-200 text-green-600"
                        : currentPayment.data.order_state === "rejected"
                          ? "bg-red-200 text-red-600"
                          : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentPayment.data.order_state === "pending"
                    ? "انتظار"
                    : currentPayment.data.order_state === "approved"
                      ? "مكتمل"
                      : currentPayment.data.order_state === "rejected"
                        ? "مرفوضة"
                        : "- - - -"}
                </span>
              </div>

              {/* Order Type and Notify Number */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    نوع الطلب
                  </span>
                  <span className="text-lg font-bold text-gray-700 dark:text-white">
                    {currentPayment.data.order_type === "bankNotice"
                      ? "اشعار بنكي"
                      : currentPayment.data.order_type === "balanceRecharge"
                        ? "تغذية حساب"
                        : currentPayment.data.order_type === "transaction"
                          ? "ارسال رصيد"
                          : currentPayment.data.order_type === "purchaseInvoice"
                            ? "شراء منتج"
                            : currentPayment.data.order_type === "refund"
                              ? "مرتجع"
                              : "- - - -"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    {currentPayment.data.order_type === "bankNotice" ||
                    currentPayment.data.order_type === "transaction" ||
                    currentPayment.data.order_type === "balanceRecharge"
                      ? "رقم الاشعار"
                      : currentPayment.data.order_type === "purchaseInvoice" ||
                          currentPayment.data.order_type === "refund"
                        ? "رقم الطلب"
                        : "- - - -"}
                  </span>
                  <span className="text-lg font-bold text-gray-700 dark:text-white break-all">
                    {currentPayment.data.uuid}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    تاريخ الإنشاء
                  </span>
                  <span className="text-lg font-bold text-gray-700 dark:text-white">
                    {currentPayment.data.created_at}
                  </span>
                </div>
              </div>

              {/* Notes and Created At */}
              <div className="mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    {currentPayment.data.order_type === "bankNotice"
                      ? "البنك"
                      : currentPayment.data.order_type === "balanceRecharge" ||
                          currentPayment.data.order_type === "transaction"
                        ? "ملاحظات"
                        : currentPayment.data.order_type ===
                              "purchaseInvoice" ||
                            currentPayment.data.order_type === "refund"
                          ? "الخدمة"
                          : "- - - -"}
                  </span>
                  <span className="text-lg font-bold text-gray-700 dark:text-white">
                    {currentPayment.data.description}
                  </span>
                </div>
              </div>

              {/* Total Amount */}
              {currentPayment.data.order_type === "bankNotice" ||
              currentPayment.data.order_type === "balanceRecharge" ? (
                <div className="flex justify-between items-center mb-6_ border-t pt-6">
                  <span className="text-lg font-semibold text-gray-700 dark:text-white">
                    المبلغ المضاف:
                  </span>
                  <span
                    className="text-xl font-bold text-yellow-500"
                    style={{ direction: "ltr" }}
                  >
                    {Number(currentPayment.data.total_amount).toLocaleString()}{" "}
                    <span className="text-sm">
                      {" "}
                      {currentPayment.data.currency_customer /* || "S.P" */}
                    </span>
                  </span>
                </div>
              ) : null}
            </div>
            {/* Image Section */}

            {currentPayment.data.notify_image && (
              <div className=" dark:bg-gray-800 bg-white p-8 rounded-xl shadow-xl">
                <h5 className="text-center font-bold text-lg text-yellow-500 mb-4">
                  صورة الاشعار
                </h5>
                <img
                  onClick={() =>
                    openImageInPopup(
                      `${image_host}${currentPayment.data.notify_image}`,
                      "عرض الصورة",
                      800,
                      600,
                    )
                  }
                  src={`${image_host}${currentPayment.data.notify_image}`}
                  className="rounded-lg cursor-pointer mx-auto"
                  alt="Notification"
                />
              </div>
            )}

            {!isEmpty(currentPayment.data.order_fields) && (
              <div className="dark:bg-gray-800 bg-white p-8 rounded-xl shadow-xl ">
                {/* Header */}
                <h5 className="text-center font-bold text-lg text-yellow-500 mb-4">
                  معلومات الطلب
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {Object.entries(currentPayment.data.order_fields).map(
                    ([key, item]) => (
                      <div className="flex flex-col gap-1" key={key}>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                          {item.name}
                        </span>
                        <span className="text-lg font-bold text-gray-700 dark:text-white">
                          {item.value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Reject Reason */}
            {currentPayment.data?.rejection_reason && (
              <div className="dark:bg-gray-800 bg-white p-8 rounded-xl shadow-xl ">
                {/* Header */}
                <h5 className="text-center font-bold text-lg text-yellow-500 mb-4">
                  {currentPayment.data.order_state === "rejected" &&
                    "سبب الرفض"}
                  {currentPayment.data.order_state === "approved" &&
                    "الملاحظات"}
                </h5>

                {/* Content */}
                <h5 className="dark:text-white text-center">
                  {currentPayment.data.rejection_reason}{" "}
                </h5>
              </div>
            )}
          </div>
        )
      )}
    </ActionModal>
  );
}

function isEmpty(field) {
  // التحقق إذا كان غير معرّف أو يساوي null
  if (field === undefined || field === null) return true;

  // التحقق إذا كان كائنًا فارغًا
  if (typeof field === "object") {
    return Object.keys(field).length === 0;
  }

  // التحقق إذا كان مصفوفة فارغة
  if (Array.isArray(field)) {
    return field.length === 0;
  }

  // إذا كان نوعًا آخر
  return false;
}
