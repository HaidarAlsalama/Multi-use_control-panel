import { useChargeStatements } from "api/admin/chargeBalance";
import { Spinner } from "components";
import InputDate from "components/InputField/InputDate";
import InputSearch from "components/InputField/InputSearch";
import InputSelect from "components/InputField/InputSelect";
import AddMoney from "components/Modal/Admin/FinancialStatementModal/AddMoney";
import PaymentInfModal from "components/Modal/Admin/PaymentInfModal/PaymentInfModal";
import useParam from "Hooks/useParam";
import { useState } from "react";
import { formatTotalAfterDisplay } from "utils/transactionBalance";
import { RiFileExcel2Line } from "react-icons/ri";
import { TiInfoLarge } from "react-icons/ti";
// import * as XLSX from "xlsx";

export default function RechargeBalance() {
  const customerId = useParam("customerId");
  const [isOpenAddCustomerModal, setIsOpenAddCustomerModal] = useState(false);
  const [isOpenPaymentInfoModal, setIsOpenPaymentInfoModal] = useState(false);

  const [currentId, setCurrentId] = useState(undefined);

  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchValue, setSearchValue] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("approved");

  const {
    data: chargeStatements,
    isSuccess: chargeStatementsIsSuccess,
    isLoading: chargeStatementsIsLoading,
    isFetching: chargeStatementsIsFetching,
  } = useChargeStatements(
    limit,
    pageNumber,
    searchValue,
    status,
    fromDate,
    toDate,
  );
  // const exportToExcel = () => {
  //   if (
  //     !chargeStatements ||
  //     chargeStatements?.data?.chargeStatements.length === 0
  //   )
  //     return;
  //   // البيانات المعروضة في الجدول مع أسماء الأعمدة العربية
  //   const formattedData = chargeStatements?.data?.chargeStatements.map(
  //     (item) => ({
  //       "#": item.id,
  //       "اسم المركز": item.center_name,
  //       "رقم الاشعار": item.notify_number,
  //       المبلغ: Number(item.amount).toLocaleString(),
  //       "المبلغ قبل العملية": Number(
  //         item.total_before_operation
  //       ).toLocaleString(),
  //       الملاحظات: item.notes,
  //       "تاريخ الإنشاء": item.created_at,
  //       الحالة:
  //         item.state_notify === "pending"
  //           ? "انتظار"
  //           : item.state_notify === "approved"
  //           ? "مكتمل"
  //           : item.state_notify === "rejected"
  //           ? "مرفوضة"
  //           : "- - - -",
  //     })
  //   );

  //   // إنشاء ورقة العمل باستخدام البيانات المعدلة
  //   const worksheet = XLSX.utils.json_to_sheet(formattedData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  //   // كتابة الملف إلى Excel
  //   XLSX.writeFile(workbook, `الدفعات وتغذيه الحسابات.xlsx`);
  // };

  return (
    <div className="flex flex-col gap-2 p-4 justify-between bg-gray-50 dark:bg-gray-800 h-full rounded-lg">
      <div className="flex flex-wrap gap-4">
        {/* <button
          // disabled={
          //   !customers || customers?.data?.financialStatements.length === 0
          // }
          className="btn btn-success w-fit !p-2 !text-xl"
          onClick={exportToExcel}
          title="تصدير Excel"
        >
          <RiFileExcel2Line />
        </button> */}
        <select
          id="underline_select"
          className="block py-1 px-2 font-bold text-gray-600 dark:text-white cursor-pointer bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => {
            setLimit(e.target.value);
            setPageNumber(1);
          }}
        >
          <option value={10}>10 عناصر</option>
          <option value={25}>25 عنصر</option>
          <option value={50}>50 عنصر</option>
          <option value={75}>75 عنصر</option>
          <option value={100}>100 عنصر</option>
          <option value={1000000}>الجميع</option>
        </select>
        <InputSearch
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setPageNumber={setPageNumber}
        />
        {chargeStatementsIsSuccess && chargeStatementsIsFetching && (
          <span className="btn btn-success w-fit !p-2 ">
            تحديث البيانات <Spinner xs className="text-white" />
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 mb-2">
        <InputDate
          title={"من تاريخ"}
          value={fromDate}
          setValue={setFromDate}
          setPageNumber={setPageNumber}
        />
        <InputDate
          title={"الى تاريخ"}
          value={toDate}
          setValue={setToDate}
          setPageNumber={setPageNumber}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto mx-auto flex-grow w-full rounded-t-md">
        <table className="text-sm text-gray-500 dark:text-gray-400 text-center w-full">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-2 text-nowrap">
                #
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                اسم المركز
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                رقم الاشعار
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                المبلغ
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                المبلغ قبل العملية
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                بعد العملية
              </th>

              <th scope="col" className="px-4 py-2 text-nowrap">
                ملاحظات
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                تاريخ الإنشاء
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                الحالة{" "}
              </th>

              <th scope="col" className="px-4 py-2 text-nowrap  max-w-20">
                التفاصيل
              </th>
            </tr>
          </thead>
          <tbody className="">
            {chargeStatementsIsSuccess &&
              chargeStatements?.data?.chargeStatements.map((item, index) => (
                <tr
                  className={`
                        odd:bg-white text-lg_ odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 
                        hover:dark:bg-gray-700 hover:bg-gray-200
                        `}
                  key={index}
                >
                  <td className="px-4 py-2 text-nowrap">{item.id} </td>
                  <td className="px-4 py-2 ">{item.center_name}</td>
                  <td className="px-4 py-2 ">{item.notify_number}</td>
                  <td className="px-4 py-2 text-nowrap " dir="ltr">
                    {Number(item.amount).toLocaleString()}{" "}
                    <span style={{ fontSize: "9px" }} className="text-blue-400">
                      {item.currency_customer}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-nowrap " dir="ltr">
                    {Number(item.total_before_operation).toLocaleString()}{" "}
                    <span style={{ fontSize: "9px" }} className="text-blue-400">
                      {item.currency_customer}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-nowrap " dir="ltr">
                    {formatTotalAfterDisplay(item)}{" "}
                    <span style={{ fontSize: "9px" }} className="text-blue-400">
                      {item.currency_customer}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="line-clamp-2 overflow-hidden text-ellipsis">
                      {item.notes || "- - - -"}
                    </span>
                  </td>
                  <td className="px-4 py-2 ">{item.created_at}</td>
                  <td className="px-4 py-2 ">
                    <span
                      className={`font-semibold block m-auto text-xs p-1 rounded-lg w-14 ${
                        item.state_notify === "pending"
                          ? "bg-yellow-200 text-yellow-600"
                          : item.state_notify === "approved"
                            ? "bg-green-200 text-green-600"
                            : item.state_notify === "rejected"
                              ? "bg-red-200 text-red-600"
                              : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.state_notify === "pending"
                        ? "انتظار"
                        : item.state_notify === "approved"
                          ? "مكتمل"
                          : item.state_notify === "rejected"
                            ? "مرفوض"
                            : "- - - -"}
                    </span>
                  </td>

                  <td className="p-1">
                    <div className="flex gap-2 justify-center items-center p-1">
                      <button
                        className="btn btn-dark text-xs_ !p-1.5"
                        onClick={() => {
                          setCurrentId(item.id);
                          setIsOpenPaymentInfoModal(true);
                        }}
                        title="التفاصيل"
                      >
                        <TiInfoLarge />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {chargeStatementsIsLoading && (
          <div className="my-4">
            <Spinner />
          </div>
        )}

        {!chargeStatementsIsLoading &&
          chargeStatements?.data?.chargeStatements.length === 0 && (
            <div className="w-full text-center p-5 font-semibold bg-gray-200 dark:bg-gray-900 dark:text-white">
              <h1>لا يوجد بيانات</h1>
            </div>
          )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center my-4 w-full">
        <span className="text-sm text-gray-700 dark:text-gray-400 flex gap-1">
          <span className="font-semibold text-gray-900 dark:text-white">
            {chargeStatements?.data?.pagination?.current_page || 0}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            من اصل
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {chargeStatements?.data?.pagination?.last_page || 0}
          </span>{" "}
        </span>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setPageNumber((prev) => prev - 1)}
            disabled={pageNumber === 1 || chargeStatementsIsLoading}
            className="btn btn-info text-sm !p-1 w-20 "
          >
            السابق
          </button>
          <button
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={
              chargeStatements?.data?.chargeStatements.length === 0 ||
              pageNumber >= chargeStatements?.data.pagination?.last_page ||
              chargeStatements?.data?.pagination?.total === 0 ||
              chargeStatementsIsLoading
            }
            className="btn btn-primary text-sm !p-1 w-20 "
          >
            التالي
          </button>
        </div>
      </div>

      {isOpenAddCustomerModal && (
        <AddMoney
          isOpen={isOpenAddCustomerModal}
          toggle={setIsOpenAddCustomerModal}
          customerId={customerId}
        />
      )}
      {isOpenPaymentInfoModal && (
        <PaymentInfModal
          isOpen={isOpenPaymentInfoModal}
          toggle={setIsOpenPaymentInfoModal}
          paymentId={currentId}
        />
      )}
    </div>
  );
}
