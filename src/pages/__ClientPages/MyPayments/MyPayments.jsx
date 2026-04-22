import { useMyPayments } from "api/Client/balance";
import InputSearch, {
  SelectInput,
} from "components/ClientLayoutPages/ClientInputField/InputsFilter";
import Container from "components/ClientLayoutPages/Container/Container";
import MyPaymentModal from "components/Modal/Client/MyPaymentModal/MyPaymentModal";
import SkeletonMyPayment from "components/SkeletonList/SkeletonMyPayment";
import { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa"; // أيقونات من FontAwesome
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiSandsOfTime, GiTakeMyMoney } from "react-icons/gi";
import { MdNumbers } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

export default function MyPayments() {
  const [openMyPaymentModal, setOpenMyPaymentModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(24);

  const [searchValue, setSearchValue] = useState("");
  const [orderState, setOrderSate] = useState("");

  const {
    data: myPayments,
    isFetching: myPaymentsIsLoading,
    isSuccess: myPaymentsIsSuccess,
  } = useMyPayments(limit, pageNumber, searchValue, orderState);

  return (
    <Container title={`دفعاتي`}>
      <div className="grid grid-cols-2 bg-zinc-800 p-4 pt-2 rounded-lg max-w-md mb-8 mt-4 gap-4 mx-auto">
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
            { value: "approved", label: "مكتمل" },
            { value: "rejected", label: "مرفوضة" },
            { value: "pending", label: "انتظار" },
          ]}
        />
      </div>
      {myPaymentsIsLoading && <SkeletonMyPayment number={6} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!myPaymentsIsLoading &&
          myPaymentsIsSuccess &&
          myPayments.data?.myPayments.length > 0 &&
          myPayments.data.myPayments.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setCurrentId(item.id);
                setOpenMyPaymentModal(true);
              }}
              className="card-animation bg-zinc-900/80 cursor-pointer hover:scale-105 transition-transform duration-300 grid gap-1 h-64 text-white p-2.5 rounded-2xl shadow-lg border border-yellow-500 hover:shadow-xl hover:bg-zinc-900"
            >
              <div className="flex justify-between items-center flex-row-reverse">
                {" "}
                <h2
                  className="text-xl font-bold text-yellow-500"
                  style={{ direction: "ltr" }}
                >
                  {Number(item.amount).toLocaleString()}{" "}
                  <span className="text-sm">
                    {item.order_type === "bankNotice"
                      ? item.currency_bank
                      : item.currency_customer}
                  </span>
                </h2>
                <div
                  className={`text-gray-400 items-center flex gap-3 ${
                    item.state_notify === "pending"
                      ? "text-yellow-500"
                      : item.state_notify === "approved"
                        ? "text-green-500"
                        : item.state_notify === "rejected"
                          ? "text-red-500"
                          : "text-gray-400"
                  }`}
                >
                  {item.state_notify === "pending" ? (
                    <>
                      <div className="text-xl p-1 text-yellow-500">
                        <GiSandsOfTime />
                      </div>
                      <span className="font-bold">{"انتظار"}</span>
                    </>
                  ) : item.state_notify === "approved" ? (
                    <>
                      <div className="text-xl p-1 text-green-500">
                        <FaCheck />
                      </div>
                      <span className="font-bold">{"مكتملة"}</span>
                    </>
                  ) : item.state_notify === "rejected" ? (
                    <>
                      <div className="text-xl p-1 text-red-500">
                        <FaTimes />
                      </div>
                      <span className="font-bold">{"مرفوضة"}</span>
                    </>
                  ) : null}
                </div>
              </div>
              <div className={`text-gray-400 items-center flex gap-3`}>
                <div className="text-xl p-1 text-yellow-500">
                  <FaMoneyBillTransfer />
                </div>
                <span className="font-bold">
                  {" "}
                  {item.order_type === "bankNotice"
                    ? "اشعار بنكي"
                    : item.order_type === "balanceRecharge"
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
                <span className="font-bold"> {item.notify_number}</span>
              </div>
              <div className="text-gray-400 items-center text-sm flex gap-3">
                <div className="text-xl p-1 text-yellow-500">
                  <GiTakeMyMoney />
                </div>{" "}
                <span className="font-bold line-clamp-2 overflow-hidden text-ellipsis">
                  {item.notes}
                </span>
              </div>

              <div className="text-gray-400 items-center flex gap-3">
                <div className="text-xl p-1 text-yellow-500">
                  <SlCalender />
                </div>{" "}
                <span style={{ direction: "ltr" }} className="font-bold">
                  {" "}
                  {item.created_at}{" "}
                </span>
              </div>
              <div className="text-gray-400 items-center flex gap-3">
                <div className="p-1 text-yellow-500 font-bold">
                  {"المبلغ المضاف:"}
                </div>{" "}
                <span style={{ direction: "ltr" }} className="font-bold">
                  {" "}
                  {Number(item.total_amount).toLocaleString()}{" "}
                  <span className="text-xs">
                    {item.currency_customer /* || "S.P" */}{" "}
                  </span>
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center mt-16 w-full">
        <span className="text-sm text-yellow-500 flex gap-1">
          <span className="font-semibold">
            {myPayments?.data?.pagination?.current_page || 0}
          </span>
          <span className="font-medium">من اصل</span>
          <span className="font-semibold">
            {myPayments?.data?.pagination?.last_page || 0}
          </span>{" "}
        </span>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setPageNumber((prev) => prev - 1)}
            disabled={pageNumber === 1 || myPaymentsIsLoading}
            className="btn btn-smart text-sm !p-1 w-20 "
          >
            السابق
          </button>
          <button
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={
              myPayments?.data?.myPayments.length === 0 ||
              pageNumber >= myPayments?.data.pagination?.last_page ||
              myPayments?.data?.pagination?.total === 0 ||
              myPaymentsIsLoading
            }
            className="btn btn-smart text-sm !p-1 w-20 "
          >
            التالي
          </button>
        </div>
      </div>
      {openMyPaymentModal && (
        <MyPaymentModal
          isOpen={openMyPaymentModal}
          toggle={setOpenMyPaymentModal}
          paymentId={currentId}
        />
      )}
    </Container>
  );
}
