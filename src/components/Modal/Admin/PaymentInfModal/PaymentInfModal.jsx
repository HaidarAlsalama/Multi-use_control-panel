import { useChangeStateBankNotice } from "api/admin/bankNotice";
import { usePaymentInfoById } from "api/admin/chargeBalance";
import { Spinner } from "components";
import InputField from "components/InputField/InputField";
import ActionModal from "components/Modal/ActionModal/ActionModal";
import { image_host } from "config/api_host";
import { useEffect } from "react";

export default function PaymentInfModal({ isOpen, toggle, paymentId }) {
  const {
    data: currentPayment,
    isSuccess: currentPaymentIsSuccess,
    isFetching: currentPaymentIsFetching,
  } = usePaymentInfoById(paymentId);

  const {
    mutate: changeBankNoticeState,
    isPending: changeBankNoticeStateIsPending,
    isSuccess: changeBankNoticeStateIsSuccess,
  } = useChangeStateBankNotice(
    currentPaymentIsSuccess &&
      currentPayment?.data?.order_type === "bankNotice" &&
      currentPayment.data.id,
  );

  useEffect(() => {
    if (changeBankNoticeStateIsSuccess) toggle(false);
  }, [changeBankNoticeStateIsSuccess]);

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

  const handleChangeBankNoticeState = (e) => {
    e.preventDefault();
    // إذا كان الحدث يأتي من نموذج
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    data.rejection_reason =
      data.state == "approved" && data.rejection_reason == ""
        ? "تم إضافة الرصيد بنجاح."
        : data.rejection_reason;

    changeBankNoticeState(data);
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="xSmall"
      title={"تفاصيل دفعة"}
    >
      {currentPaymentIsFetching ? (
        <Spinner page />
      ) : (
        currentPaymentIsSuccess && (
          <div className="grid grid-cols-1 gap-4 my-4">
            <div className="dark:bg-gray-800 bg-gray-50 p-4 rounded-xl shadow-md   transform">
              {/* Header */}
              <div className="flex flex-row-reverse justify-between items-center mb-6">
                <h2
                  className="text-3xl font-extrabold text-yellow-500"
                  style={{ direction: "ltr" }}
                >
                  {Number(currentPayment.data.amount).toLocaleString()}{" "}
                  <span className="text-sm">
                    {currentPayment.data.currency_bank}
                  </span>
                </h2>
                <span
                  className={`font-semibold px-3 py-2 rounded-xl w-24 text-center ${
                    currentPayment.data.state_notify === "pending"
                      ? "bg-yellow-200 text-yellow-600"
                      : currentPayment.data.state_notify === "approved"
                        ? "bg-green-200 text-green-600"
                        : currentPayment.data.state_notify === "rejected"
                          ? "bg-red-200 text-red-600"
                          : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentPayment.data.state_notify === "pending"
                    ? "انتظار"
                    : currentPayment.data.state_notify === "approved"
                      ? "مكتمل"
                      : currentPayment.data.state_notify === "rejected"
                        ? "مرفوضة"
                        : "- - - -"}
                </span>
              </div>

              {/* Order Type and Notify Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    نوع الطلب
                  </span>
                  <span className="text-lg font-bold text-gray-700 dark:text-white">
                    {currentPayment.data.order_type === "bankNotice"
                      ? "اشعار بنكي"
                      : currentPayment.data.order_type === "balanceRecharge"
                        ? "تغذية حساب"
                        : "- - - -"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 break-all">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    رقم الإشعار
                  </span>
                  <span className="text-lg font-bold text-gray-700 dark:text-white">
                    {currentPayment.data.notify_number}
                  </span>
                </div>
              </div>

              {/* Notes and Created At */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-1 justify-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    {currentPayment?.data?.order_type === "bankNotice"
                      ? "اسم البنك"
                      : "الملاحظات"}
                  </span>
                  <span className="text-lg font-bold text-gray-700 dark:text-white">
                    {currentPayment.data.notes}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      تاريخ الإنشاء
                    </span>
                    <span className="text-lg font-bold text-gray-700 dark:text-white">
                      {currentPayment.data.created_at}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      تاريخ اخر تعديل
                    </span>
                    <span className="text-lg font-bold text-gray-700 dark:text-white">
                      {currentPayment.data.updated_at}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
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
                    {currentPayment.data?.currency_customer}
                  </span>
                </span>
              </div>
            </div>

            {/* Reject Reason */}
            {currentPayment.data?.rejection_reason && (
              <div className="dark:bg-gray-800 bg-gray-50 p-4 rounded-xl shadow-md ">
                {/* Header */}
                <h5 className="text-center font-bold text-lg text-yellow-500 mb-4">
                  {currentPayment.data.state_notify === "rejected"
                    ? "سبب الرفض"
                    : "الملاحظات"}
                </h5>

                {/* Content */}
                <h5
                  className="dark:text-white text-center_"
                  dangerouslySetInnerHTML={{
                    __html: currentPayment.data?.rejection_reason?.replace(
                      /\n/g,
                      "<br />",
                    ),
                  }}
                ></h5>
              </div>
            )}

            {/* Image Section */}
            {currentPayment.data.notify_image && (
              <div className=" dark:bg-gray-800 bg-gray-50 p-4 rounded-xl shadow-md">
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

            {currentPaymentIsSuccess &&
              currentPayment?.data?.order_type === "bankNotice" && (
                <form
                  onSubmit={handleChangeBankNoticeState}
                  className="dark:bg-gray-800 space-y-4 bg-white p-4 rounded-xl shadow-md "
                >
                  {/* Header */}
                  <div className={""}>
                    <label className="text-sm font-medium dark:text-white text-gray-700">
                      حالة الإشعار
                    </label>
                    <span className="text-red-600 font-bold dark:text-green-600">
                      *
                    </span>
                    <select
                      name="state"
                      className="block disabled:bg-gray-200 w-full px-2 py-1 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                      // onChange={(e) => onChange(e.target.value)}
                      defaultValue={
                        currentPayment?.data?.state_notify || "pending"
                      }
                    >
                      <option value={"pending"} className="text-yellow-500">
                        إنتظار
                      </option>
                      ;
                      <option value={"approved"} className="text-green-500">
                        قبول
                      </option>
                      ;
                      <option value={"rejected"} className="text-red-500">
                        رفض
                      </option>
                      ;
                    </select>
                  </div>

                  <div className={`relative`}>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      الملاحظات
                      <span className="text-red-600 font-bold dark:text-green-600">
                        *
                      </span>
                    </label>
                    <textarea
                      name="rejection_reason"
                      className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:border-blue-500
            dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none -indigo-300"
                      rows="4"
                      defaultValue={currentPayment.data?.rejection_reason || ""}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className=" btn btn-primary w-20 h-8 mx-auto"
                  >
                    {changeBankNoticeStateIsPending ? <Spinner sm /> : "تأكيد"}
                  </button>
                </form>
              )}
          </div>
        )
      )}
    </ActionModal>
  );
}
