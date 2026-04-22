import { useAdminBox } from "api/admin/chargeBalance";
import InputDate from "components/InputField/InputDate";
import { useState } from "react";

export default function AdminBox() {
  const today = new Date().toLocaleDateString("en-CA").split("T")[0];

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [pageNumber, setPageNumber] = useState(1);

  const {
    data: adminBox,
    isLoading,
    isFetching,
  } = useAdminBox(fromDate, toDate);

  return (
    <div className="w-full col-span-2 flex flex-col gap-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 w-fit justify-center md:justify-start bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 p-4 rounded-2xl shadow-sm">
        <InputDate
          title="من تاريخ"
          value={fromDate}
          setValue={setFromDate}
          setPageNumber={setPageNumber}
        />

        <InputDate
          title="إلى تاريخ"
          value={toDate}
          setValue={setToDate}
          setPageNumber={setPageNumber}
        />
      </div>

      {/* Loading */}
      {(isLoading || isFetching) && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          جاري تحميل الصناديق...
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isFetching && adminBox?.data?.length === 0 && (
        <div className="w-full flex justify-center">
          <div className="text-center py-12 px-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/30">
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              لا يوجد دفعات في هذا التاريخ
            </p>
          </div>
        </div>
      )}

      {/* Boxes */}
      {!isLoading && !isFetching && adminBox?.data?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {adminBox.data.map((box) => (
            <div
              key={box.user_id}
              className="rounded-2xl border border-gray-200 dark:border-white/10 
            bg-white dark:bg-black/30 
            p-6 shadow-sm hover:shadow-md 
            dark:hover:bg-black/40 
            transition"
            >
              {/* User Info */}
              <div className="flex flex-col gap-1 mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {box.user.name}
                </h2>
                {/* 
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {box.user.phone}
              </span>

              <span className="text-xs text-gray-400 dark:text-gray-500">
                {box.user.email}
              </span> */}
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center border-t border-gray-200 dark:border-white/10 pt-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    عدد الدفعات
                  </span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {box.payments_count}
                  </span>
                </div>

                <div className="flex flex-col text-right">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    مجموع الدفعات
                  </span>
                  <span className="font-bold text-lg text-green-600 dark:text-green-400">
                    {box.total_payments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
