import { useChangeStateOrder, useServiceOrderById } from "api/admin/order";
import { Spinner } from "components";
import ActionModal from "components/Modal/ActionModal/ActionModal";
import { useEffect } from "react";

export default function OrderModal({ isOpen, toggle, orderId }) {
  const {
    data: currentOrder,
    isSuccess: currentOrderIsSuccess,
    isFetching: currentOrderIsFetching,
  } = useServiceOrderById(orderId);

  const {
    mutate: changeOrderState,
    isPending: changeOrderStateIsPending,
    isSuccess: changeOrderStateIsSuccess,
  } = useChangeStateOrder(orderId);

  useEffect(() => {
    if (changeOrderStateIsSuccess) toggle(false);
  }, [changeOrderStateIsSuccess]);

  const handleChangeBankNoticeState = (e) => {
    e.preventDefault();
    // إذا كان الحدث يأتي من نموذج
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.reason =
      data.state == "completed" && data.reason == ""
        ? "تم تنفيذ الطلب بنجاح."
        : data.reason;
    changeOrderState(data);
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="small"
      title={"تفاصيل فاتورة شراء"}
    >
      {currentOrderIsFetching ? (
        <Spinner page />
      ) : (
        currentOrderIsSuccess && (
          <div className="grid grid-cols-1 gap-4 my-4">
            <div className="dark:bg-gray-800 bg-white p-4 rounded-xl shadow-xl   transform">
              {/* Header */}

              <div className="flex flex-row-reverse justify-between items-center mb-6">
                <h2
                  className="text-3xl font-extrabold text-yellow-500"
                  style={{ direction: "ltr" }}
                >
                  {Number(Math.abs(currentOrder.data.total)).toLocaleString()}{" "}
                  <span className="text-sm">
                    {currentOrder.data.currncy /* || "S.P" */}
                  </span>
                </h2>
                <span
                  className={`font-semibold px-3 py-2 rounded-xl w-24 text-center ${
                    currentOrder.data.state === "pending"
                      ? "bg-yellow-200 text-yellow-600"
                      : currentOrder.data.state === "completed"
                        ? "bg-green-200 text-green-600"
                        : currentOrder.data.state === "canceled"
                          ? "bg-red-200 text-red-600"
                          : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentOrder.data.state === "pending"
                    ? "انتظار"
                    : currentOrder.data.state === "completed"
                      ? "مكتمل"
                      : currentOrder.data.state === "canceled"
                        ? "مرفوضة"
                        : "- - - -"}
                </span>
              </div>

              <div className="flex flex-col gap-1 mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  اسم المركز
                </span>
                <span className="text-lg font-bold text-gray-700 dark:text-white">
                  {currentOrder.data.center_name}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="flex flex-col gap-1 justify-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    نوع الطلب
                  </span>
                  <span className="text-lg font-bold text-gray-700 dark:text-white">
                    شراء خدمة{" "}
                  </span>
                </div>
                <div className="flex flex-col gap-1 justify-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    رقم الطلب
                  </span>
                  <span className="text-lg font-bold text-gray-700 dark:text-white">
                    {currentOrder.data.id}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      تاريخ الإنشاء
                    </span>
                    <span className="text-lg font-bold text-gray-700 dark:text-white">
                      {currentOrder.data.created_at}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      تاريخ اخر تعديل
                    </span>
                    <span className="text-lg font-bold text-gray-700 dark:text-white">
                      {currentOrder.data.updated_at}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  الخدمة
                </span>
                <span className="text-lg font-bold text-gray-700 dark:text-white">
                  {currentOrder.data.service}
                </span>
              </div>

              {currentOrder.data?.name_external_resource && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      المصدر الخارجي
                    </span>
                    <span className="text-lg font-bold text-gray-700 dark:text-white">
                      {currentOrder.data.name_external_resource}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      رقم الطلب الخارجي
                    </span>
                    <span className="text-lg font-bold text-gray-700 dark:text-white">
                      {currentOrder.data.external_product_key}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {!isEmpty(currentOrder.data.field) && (
              <div className="dark:bg-gray-800 bg-white p-4 rounded-xl shadow-xl ">
                {/* Header */}
                <h5 className="text-center font-bold text-lg text-yellow-500 mb-4">
                  معلومات الطلب
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(currentOrder.data.field).map(
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
            {currentOrder.data?.reason && (
              <div className="dark:bg-gray-800 bg-white p-4 rounded-xl shadow-xl ">
                {/* Header */}
                <h5 className="text-center font-bold text-lg text-yellow-500 mb-4">
                  {currentOrder.data.state === "canceled" && "سبب الرفض"}
                  {currentOrder.data.state === "completed" && "الملاحظات"}
                </h5>
                <h5
                  className="dark:text-white break-words"
                  dangerouslySetInnerHTML={{
                    __html: currentOrder.data.reason?.replace(/\n/g, "<br />"),
                  }}
                ></h5>
              </div>
            )}

            {currentOrderIsSuccess && (
              <form
                onSubmit={handleChangeBankNoticeState}
                className="dark:bg-gray-800 space-y-4 bg-white p-4 rounded-xl shadow-xl "
              >
                {/* Header */}
                <div className={""}>
                  <label className="text-sm font-medium dark:text-white text-gray-700">
                    المورد
                  </label>
                  <span className="text-red-600 font-bold dark:text-green-600">
                    *
                  </span>
                  <select
                    name="pay_from"
                    className="block disabled:bg-gray-200 w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                    // // onChange={(e) => onChange(e.target.value)}
                    // defaultValue={currentOrder.data.state}
                  >
                    <option
                      selected
                      value={"app_cash"}
                      className="text-yellow-500"
                    >
                      الحساب الشخصي
                    </option>
                    <option value={"supplier"} className="text-yellow-500">
                      مورد
                    </option>
                  </select>
                </div>
                <div className={""}>
                  <label className="text-sm font-medium dark:text-white text-gray-700">
                    حالة الطلب
                  </label>
                  <span className="text-red-600 font-bold dark:text-green-600">
                    *
                  </span>
                  <select
                    name="state"
                    className="block disabled:bg-gray-200 w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                    // onChange={(e) => onChange(e.target.value)}
                    defaultValue={currentOrder.data.state}
                  >
                    <option value={"pending"} className="text-yellow-500">
                      إنتظار
                    </option>
                    ;
                    <option value={"completed"} className="text-green-500">
                      قبول
                    </option>
                    ;
                    <option value={"canceled"} className="text-red-500">
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
                    name="reason"
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:border-blue-500
            dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none -indigo-300"
                    rows="4"
                    defaultValue={currentOrder.data?.reason || ""}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className=" btn btn-primary w-20 h-8 mx-auto"
                >
                  {changeOrderStateIsPending ? <Spinner sm /> : "تأكيد"}
                </button>
              </form>
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
