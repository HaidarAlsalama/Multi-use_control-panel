import { useMyFinancialStatement } from "api/Client/balance";
import InputSearch, {
  DateInput,
  SelectInput,
} from "components/ClientLayoutPages/ClientInputField/InputsFilter";
import Container from "components/ClientLayoutPages/Container/Container";
import MyFinancialStatementModal from "components/Modal/Client/MyFinancialStatementModal/MyFinancialStatementModal";
import LogoSpinner from "components/Spinner/LogoSpinner";
import { useEffect, useState } from "react";
import { FaCheck, FaClock, FaTimes } from "react-icons/fa"; // أيقونات من FontAwesome
import { SlCalender } from "react-icons/sl";
import { formatTotalAfterDisplay } from "utils/transactionBalance";

export default function FinancialStatement() {
  const [openMyFinancialStatementModal, setOpenMyFinancialStatementModal] =
    useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [limit] = useState(12);

  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const {
    data: myFinancialStatement,
    isFetching: myFinancialStatementIsLoading,
    isSuccess: myOrdersIsSuccess,
  } = useMyFinancialStatement(
    limit,
    pageNumber,
    searchValue,
    status,
    fromDate,
    toDate,
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageNumber]);

  return (
    <Container title={`البيان المالي`}>
      {/* {!myFinancialStatementIsLoading && myOrdersIsSuccess && ( */}
      <div className="grid sm:grid-cols-1 grid-cols-2 md:grid-cols-4 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-black border border-gray-200 dark:border-white/10 rounded-[2rem] shadow-md p-4 pt-2 mb-8 mt-4 gap-4 mx-auto">
        <InputSearch
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setPageNumber={setPageNumber}
        />
        <SelectInput
          value={status}
          setValue={setStatus}
          setPageNumber={setPageNumber}
          options={[
            { value: "approved", label: "مكتمل" },
            { value: "rejected", label: "مرفوضة" },
            { value: "pending", label: "انتظار" },
          ]}
        />
        <DateInput
          title={"من تاريخ"}
          value={fromDate}
          setValue={setFromDate}
          setPageNumber={setPageNumber}
        />
        <DateInput
          title={"الى تاريخ"}
          value={toDate}
          setValue={setToDate}
          setPageNumber={setPageNumber}
        />
      </div>
      {/* )} */}
      {myFinancialStatementIsLoading && <LogoSpinner />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!myFinancialStatementIsLoading &&
          myOrdersIsSuccess &&
          myFinancialStatement.data?.financial.length > 0 &&
          myFinancialStatement.data.financial.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setCurrentId(item.id);
                setOpenMyFinancialStatementModal(true);
              }}
              className="group relative overflow-hidden rounded-[2rem] p-6 transition-all duration-500
                         bg-gradient-to-br from-green-50 via-white to-green-100/80 dark:from-gray-900 dark:via-gray-950 dark:to-black border border-gray-200 dark:border-white/10 
                         hover:border-mainLight/40 hover:-translate-y-2 shadow-md active:scale-95 cursor-pointer"
            >
              {/* شارة الحالة (Status Badge) */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                    رقم الفاتورة
                  </span>
                  <span dir="rtl" className="text-sm font-bold text-mainLight">
                    {item.id}
                  </span>
                </div>
                <StatusBadge state={item.order_state} />
              </div>

              {/* تفاصيل المبالغ بتنسيق عصري */}
              <div className="space-y-4 mb-4">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium italic">
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
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium italic">
                      {item.description}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <p className="text-xs">المبلغ:</p>
                    <div className="text-left">
                      <span className="text-3xl font-bold text-gray-800 dark:text-white leading-none">
                        {Number(Math.abs(item.amount)).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-mainLight font-bold mr-1">
                        ل.س
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />
              </div>

              {/* زر تفاصيل مخفي يظهر عند الحوم */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-mainLight scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-gray-500">
                  <SlCalender className="text-mainLight" />
                  <span>{item.created_at}</span>
                </div>
                <div className="flex flex-wrap items-end justify-end gap-4 text-gray-500">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs">بعد العملية:</span>
                    <div className="text-left">
                      <span className="text-lg font-bold text-gray-800 dark:text-white leading-none">
                        {formatTotalAfterDisplay(item)}
                      </span>
                      <span className="text-[10px] text-mainLight font-bold mr-1">
                        ل.س
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {!myFinancialStatementIsLoading && myOrdersIsSuccess && (
        <div className="flex flex-col items-center mt-16 w-full">
          <span className="text-sm text-green-500 flex gap-1">
            <span className="font-semibold">
              {myFinancialStatement?.data?.pagination?.current_page || 0}
            </span>
            <span className="font-medium">من اصل</span>
            <span className="font-semibold">
              {myFinancialStatement?.data?.pagination?.last_page || 0}
            </span>{" "}
          </span>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => setPageNumber((prev) => prev - 1)}
              disabled={pageNumber === 1 || myFinancialStatementIsLoading}
              className="btn btn-smart text-sm !p-1 w-20 "
            >
              السابق
            </button>
            <button
              onClick={() => setPageNumber((prev) => prev + 1)}
              disabled={
                myFinancialStatement?.data?.financial.length === 0 ||
                pageNumber >=
                  myFinancialStatement?.data.pagination?.last_page ||
                myFinancialStatement?.data?.pagination?.total === 0 ||
                myFinancialStatementIsLoading
              }
              className="btn btn-smart text-sm !p-1 w-20 "
            >
              التالي
            </button>
          </div>
        </div>
      )}

      {openMyFinancialStatementModal && (
        <MyFinancialStatementModal
          isOpen={openMyFinancialStatementModal}
          toggle={setOpenMyFinancialStatementModal}
          financialId={currentId}
        />
      )}
    </Container>
  );
}

function StatusBadge({ state }) {
  const config = {
    pending: {
      label: "انتظار",
      color: "text-gray-500 bg-gray-100",
      icon: <FaClock />,
    },
    approved: {
      label: "منفذة",
      color: "text-green-500 bg-green-500/10",
      icon: <FaCheck />,
    },
    rejected: {
      label: "مرفوض",
      color: "text-red-500 bg-red-500/10",
      icon: <FaTimes />,
    },
  };

  const status = config[state] || config.pending;

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${status.color}`}
    >
      {status.icon}
      <span>{status.label}</span>
    </div>
  );
}
