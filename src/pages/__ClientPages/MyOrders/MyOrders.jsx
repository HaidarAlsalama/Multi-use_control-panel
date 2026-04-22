import { useMyOrders } from "api/Client/product";
import InputSearch, {
  SelectInput,
} from "components/ClientLayoutPages/ClientInputField/InputsFilter";
import Container from "components/ClientLayoutPages/Container/Container";
import MyOrderModal from "components/Modal/Client/MyOrderModal/MyOrderModal";
import SkeletonMyOrder from "components/SkeletonList/SkeletonMyOrder";
import LogoSpinner from "components/Spinner/LogoSpinner";
import useParam from "Hooks/useParam";
import { useEffect, useState } from "react";
import { FaCheck, FaClock, FaTimes } from "react-icons/fa"; // أيقونات من FontAwesome
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiSandsOfTime, GiTakeMyMoney } from "react-icons/gi";
import { MdNumbers } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

export default function MyOrders() {
  const orderId = useParam("orderId");
  const [openMyOrderModal, setOpenMyOrderModal] = useState(false);
  const [currentId, setCurrentId] = useState(orderId || null);

  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(9);

  const [searchValue, setSearchValue] = useState("");
  const [orderState, setOrderSate] = useState("");

  const {
    data: myOrders,
    isFetching: myOrdersIsLoading,
    isSuccess: myOrdersIsSuccess,
  } = useMyOrders(limit, pageNumber, searchValue, orderState);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageNumber]);

  useEffect(() => {
    if (orderId) {
      setOpenMyOrderModal(true);
    }
  }, [orderId]);

  return (
    <Container title={`طلباتي`}>
      {/* {!myOrdersIsLoading && myOrdersIsSuccess && ( */}
      <div className="grid grid-cols-2 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-black border border-gray-200 dark:border-white/10 rounded-[2rem] shadow-md p-4 pt-2 max-w-md mb-8 mt-4 gap-4 mx-auto">
        <InputSearch
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setPageNumber={setPageNumber}
        />
        <SelectInput
          value={orderState}
          setValue={setOrderSate}
          setPageNumber={setPageNumber}
          options={[
            { value: "completed", label: "منفذة" },
            { value: "canceled", label: "مرفوضة" },
            { value: "pending", label: "انتظار" },
          ]}
        />
      </div>
      {/* )} */}
      {myOrdersIsLoading && <LogoSpinner />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!myOrdersIsLoading &&
          myOrdersIsSuccess &&
          myOrders.data?.orders.length > 0 &&
          myOrders.data.orders.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setCurrentId(item.id);
                setOpenMyOrderModal(true);
              }}
              className="group relative overflow-hidden rounded-[2rem] p-6 transition-all duration-500
                         bg-gradient-to-br from-green-50 via-white to-green-100/80 dark:from-gray-900 dark:via-gray-950 dark:to-black border border-gray-200 dark:border-white/10 
                         hover:border-mainLight/40 hover:-translate-y-2 shadow-md active:scale-95 cursor-pointer"
            >
              {/* شارة الحالة (Status Badge) */}
              <div className="flex justify-between items-start mb-6">
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
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium italic">
                    {item.service}
                  </span>
                  <div className="text-left">
                    <span className="text-2xl font-bold text-gray-800 dark:text-white leading-none">
                      {Number(Math.abs(item.total)).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-mainLight font-bold mr-1">
                      ل.س
                    </span>
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
              </div>
            </div>
          ))}

        {!myOrdersIsLoading &&
          myOrdersIsSuccess &&
          myOrders.data?.orders.length == 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-10 bg-gradient-to-br from-green-50 via-white to-green-100/80 dark:from-gray-900 dark:via-gray-950 dark:to-black border border-gray-200 dark:border-white/10 rounded-2xl shadow-md">
              <h2 className="text-gray-700 dark:text-white font-bold text-lg mb-2">
                لا يوجد نتائج
              </h2>
            </div>
          )}
      </div>

      {/* Pagination */}
      {!myOrdersIsLoading && myOrdersIsSuccess && (
        <div className="flex flex-col items-center mt-16 w-full">
          <span className="text-sm text-green-500 flex gap-1">
            <span className="font-semibold">
              {myOrders?.data?.pagination?.current_page || 0}
            </span>
            <span className="font-medium">من اصل</span>
            <span className="font-semibold">
              {myOrders?.data?.pagination?.last_page || 0}
            </span>{" "}
          </span>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => setPageNumber((prev) => prev - 1)}
              disabled={pageNumber === 1 || myOrdersIsLoading}
              className="btn btn-smart text-sm !p-1 w-20 "
            >
              السابق
            </button>
            <button
              onClick={() => setPageNumber((prev) => prev + 1)}
              disabled={
                myOrders?.data?.orders.length === 0 ||
                pageNumber >= myOrders?.data.pagination?.last_page ||
                myOrders?.data?.pagination?.total === 0 ||
                myOrdersIsLoading
              }
              className="btn btn-smart text-sm !p-1 w-20 "
            >
              التالي
            </button>
          </div>
        </div>
      )}

      {openMyOrderModal && (
        <MyOrderModal
          isOpen={openMyOrderModal}
          toggle={setOpenMyOrderModal}
          orderId={currentId}
          url={orderId}
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
    processed: {
      label: "انتظار",
      color: "text-gray-500 bg-gray-100",
      icon: <FaClock />,
    },

    completed: {
      label: "منفذة",
      color: "text-green-500 bg-green-500/10",
      icon: <FaCheck />,
    },
    canceled: {
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
