import { useDeleteAllTokens, useGeneratePass } from "api/admin/customer";
import { useFinancialStatement } from "api/admin/financialStatement";
import { Spinner } from "components";
import InputDate from "components/InputField/InputDate";
import InputSearch from "components/InputField/InputSearch";
import InputSelect from "components/InputField/InputSelect";
import AddMoney from "components/Modal/Admin/FinancialStatementModal/AddMoney";
import FinancialStatmentInfoModal from "components/Modal/Admin/FinancialStatementModal/FinancialStatmentInfoModal";
import Guard from "components/PrivateLayoutPages/Guard/Guard";
import useParam from "Hooks/useParam";
import { useState } from "react";
import { FiKey, FiTrash2 } from "react-icons/fi";
import { TbUserDollar } from "react-icons/tb";
import { TiInfoLarge } from "react-icons/ti";

export default function FinancialStatement() {
  const customerId = useParam("customerId");
  const [isOpenAddCustomerModal, setIsOpenAddCustomerModal] = useState(false);
  const [
    isOpenFinancialStatmentInfoModalModal,
    setIsOpenFinancialStatmentInfoModalModal,
  ] = useState(false);

  const [currentId, setCurrentId] = useState(undefined);

  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchValue, setSearchValue] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");

  const {
    mutate: generatePass,
    data: generatedPass,
    isPending: IsPendingGeneratedPass,
    isSuccess: IsSuccessGeneratedPass,
  } = useGeneratePass();

  const {
    mutate: deleteAllTokens,
    isPending: IsPendingDeleteAllTokens,
    isSuccess: IsSuccessDeleteAllTokens,
  } = useDeleteAllTokens();

  const {
    data: customers,
    isSuccess: customersIsSuccess,
    isLoading: customersIsLoading,
    isFetching: customersIsFetching,
  } = useFinancialStatement(
    limit,
    pageNumber,
    searchValue,
    customerId,
    status,
    fromDate,
    toDate,
  );

  // const exportToExcel = () => {
  //   if (!customers || customers?.data?.financialStatements.length === 0) return;
  //   // البيانات المعروضة في الجدول مع أسماء الأعمدة العربية
  //   const formattedData = customers?.data?.financialStatements.map((item) => ({
  //     "#": item.id,
  //     المبلغ: Number(item.amount).toLocaleString(),
  //     "المبلغ قبل العملية": Number(
  //       item.total_before_operation,
  //     ).toLocaleString(),
  //     النوع:
  //       item.order_type === "bankNotice"
  //         ? "اشعار بنكي"
  //         : item.order_type === "balanceRecharge"
  //           ? "تغذية حساب"
  //           : item.order_type === "refund"
  //             ? "مرتجع"
  //             : item.order_type === "purchaseInvoice"
  //               ? "فاتورة شراء"
  //               : "- - -",
  //     البيان: item.description || "- - - -",
  //     الحالة:
  //       item.order_state === "pending"
  //         ? "انتظار"
  //         : item.order_state === "approved"
  //           ? "مكتمل"
  //           : item.order_state === "rejected"
  //             ? "مرفوضة"
  //             : "- - - -",
  //   }));

  //   // إنشاء ورقة العمل باستخدام البيانات المعدلة
  //   const worksheet = XLSX.utils.json_to_sheet(formattedData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  //   // كتابة الملف إلى Excel
  //   XLSX.writeFile(
  //     workbook,
  //     `البيان المال لـ ${customers.data.center_name}.xlsx`,
  //   );
  // };

  return (
    <div className="flex flex-col gap-4 p-4 justify-between bg-gray-50 dark:bg-gray-800 h-full rounded-lg">
      <div className="flex flex-wrap gap-4">
        <Guard permission={"create_banks"}>
          <button
            className="btn btn-primary w-fit !p-2 !text-xl"
            onClick={() => setIsOpenAddCustomerModal(true)}
            title="اضافة رصيد"
          >
            <TbUserDollar />
          </button>
        </Guard>

        {/* <button
          disabled={
            !customers || customers?.data?.financialStatements.length === 0
          }
          className="btn btn-success w-fit !p-2 !text-xl"
          onClick={exportToExcel}
          title="تصدير Excel"
        >
          <RiFileExcel2Line />
        </button> */}
        <select
          id="underline_select"
          className="block py-1 px-2 font-bold text-gray-600 dark:text-white cursor-pointer bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setLimit(e.target.value)}
        >
          <option value={10}>10 عناصر</option>
          <option value={25}>25 عنصر</option>
          <option value={50}>50 عنصر</option>
          <option value={75}>75 عنصر</option>
          <option value={100}>100 عنصر</option>
        </select>

        <InputSearch
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setPageNumber={setPageNumber}
        />
        {customersIsSuccess && customersIsFetching && (
          <span className="btn btn-success w-fit !p-2 ">
            تحديث البيانات <Spinner xs className="text-white" />
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 md:flex flex-wrap gap-4 mb-2">
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
        <InputSelect
          title={"الحالة"}
          value={status}
          setValue={setStatus}
          setPageNumber={setPageNumber}
          options={[
            { value: "approved", title: "مكتملة" },
            { value: "rejected", title: "مرفوضة" },
            { value: "pending", title: "انتظار" },
          ]}
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <Guard permission={"edit_customer"}>
          {" "}
          <button
            className="btn btn-primary w-9 !p-2 !text-xl"
            onClick={() => generatePass({ customerId })}
            disabled={IsPendingGeneratedPass}
          >
            {IsPendingGeneratedPass ? (
              <Spinner xs className="text-white" />
            ) : (
              <FiKey />
            )}
          </button>
          <button
            className="btn btn-primary w-9 !p-2 !text-xl"
            onClick={() => deleteAllTokens({ customerId })}
            disabled={IsPendingDeleteAllTokens}
          >
            {IsPendingDeleteAllTokens ? (
              <Spinner xs className="text-white" />
            ) : (
              <FiTrash2 />
            )}
          </button>
        </Guard>
      </div>

      {customersIsSuccess && (
        <div className="dark:bg-gray-900 flex gap-4 bg-white px-4 py-2 rounded-xl shadow-md w-fit">
          <div className="flex flex-wrap justify-between_ items-center gap-4">
            {/* المركز */}
            <div className="flex items-center gap-2">
              <span className=" *: font-semibold text-gray-700 dark:text-white">
                المركز:
              </span>
              <span className="font-extrabold text-yellow-500">
                {customers.data.center_name}
              </span>
            </div>

            {/* الرصيد */}
            <div className="flex items-center gap-2">
              <span className=" *: font-semibold text-gray-700 dark:text-white">
                الرصيد:
              </span>
              <div
                className="inline-block md:text-xl font-bold"
                style={{ direction: "ltr" }}
              >
                <span
                  className={`${
                    customers.data.current_balance === 0
                      ? "text-yellow-500 dark:text-yellow-400"
                      : customers.data.current_balance < 0
                        ? "text-red-500 dark:text-red-400"
                        : "text-green-500 dark:text-green-400"
                  }`}
                >
                  {Number(customers.data.current_balance).toLocaleString()}
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  {customers.data.currency}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {IsSuccessGeneratedPass && (
        <div className="alert alert-info text-center text-xm">
          <p className="font-bold text-xl">
            {generatedPass.data.temp_password}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto mx-auto flex-grow w-full rounded-t-md">
        <table className="text-sm text-gray-500 dark:text-gray-400 text-center w-full">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-2 text-nowrap">
                #
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                المبلغ
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                المبلغ قبل العملية
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                نوع العملية
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                البيان
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                تاريخ الإنشاء
              </th>

              <th scope="col" className="px-4 py-2 text-nowrap  max-w-20">
                الحالة{" "}
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap  max-w-20">
                التفاصيل
              </th>
            </tr>
          </thead>
          <tbody className="">
            {customersIsSuccess &&
              customers?.data?.financialStatements.map((item, index) => (
                <tr
                  className={`
                        odd:bg-white  *:_ odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 
                        hover:dark:bg-gray-700 hover:bg-gray-200
                        `}
                  key={index}
                >
                  <td className="px-4 py-2 text-nowrap">{item.id} </td>
                  <td
                    className={`px-4 py-2 ${
                      item.amount > 0
                        ? "text-green-500 dark:text-green-400"
                        : item.amount < 0
                          ? "text-red-500 dark:text-red-400"
                          : ""
                    }`}
                  >
                    {Number(item.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 ">
                    {Number(item.total_before_operation).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 ">
                    <span className="font-bold block m-auto text-xs p-1 rounded-lg w-20 bg-gray-200 text-gray-600 text-nowrap dark:bg-gray-600 dark:text-gray-300">
                      {item.order_type === "bankNotice"
                        ? "اشعار بنكي"
                        : item.order_type === "balanceRecharge"
                          ? "تغذية حساب"
                          : item.order_type === "transaction"
                            ? "ارسال رصيد"
                            : item.order_type === "refund"
                              ? "مرتجع"
                              : item.order_type === "purchaseInvoice"
                                ? "فاتورة شراء"
                                : "- - -"}
                    </span>
                  </td>
                  <td className="px-4 py-2 ">
                    <h5 className="min-w-36">
                      <div className="min-w-56 m-auto">
                        {item.description || "- - - -"}
                      </div>
                    </h5>
                  </td>
                  <td className="px-4 py-2 text-nowrap">{item.created_at}</td>
                  <td className="px-4 py-2 ">
                    <span
                      className={`font-semibold block m-auto text-xs p-1 rounded-lg w-14 ${
                        item.order_state === "pending"
                          ? "bg-yellow-200 text-yellow-600"
                          : item.order_state === "approved"
                            ? "bg-green-200 text-green-600"
                            : item.order_state === "rejected"
                              ? "bg-red-200 text-red-600"
                              : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.order_state === "pending"
                        ? "انتظار"
                        : item.order_state === "approved"
                          ? "مكتمل"
                          : item.order_state === "rejected"
                            ? "مرفوضة"
                            : "- - - -"}
                    </span>
                  </td>
                  <td className="p-1">
                    <div className="flex gap-2 justify-center items-center p-1">
                      <button
                        className="btn btn-dark text-xs_ !p-1.5"
                        onClick={() => {
                          setCurrentId(item.id);
                          setIsOpenFinancialStatmentInfoModalModal(true);
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

        {customersIsLoading && (
          <div className="my-4">
            <Spinner />
          </div>
        )}

        {!customersIsLoading &&
          customers?.data?.financialStatements.length === 0 && (
            <div className="w-full text-center p-5 font-semibold bg-gray-200 dark:bg-gray-900 dark:text-white">
              <h1>لا يوجد بيانات</h1>
            </div>
          )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center my-4 w-full">
        <span className="text-sm text-gray-700 dark:text-gray-400 flex gap-1">
          <span className="font-semibold text-gray-900 dark:text-white">
            {customers?.data?.pagination?.current_page || 0}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            من اصل
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {customers?.data?.pagination?.last_page || 0}
          </span>{" "}
        </span>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setPageNumber((prev) => prev - 1)}
            disabled={pageNumber === 1 || customersIsLoading}
            className="btn btn-info text-sm !p-1 w-20 "
          >
            السابق
          </button>
          <button
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={
              customers?.data?.financialStatements.length === 0 ||
              pageNumber >= customers?.data.pagination?.last_page ||
              customers?.data?.pagination?.total === 0 ||
              customersIsLoading
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

      {isOpenFinancialStatmentInfoModalModal && (
        <FinancialStatmentInfoModal
          isOpen={isOpenFinancialStatmentInfoModalModal}
          toggle={setIsOpenFinancialStatmentInfoModalModal}
          paymentId={currentId}
        />
      )}
    </div>
  );
}
