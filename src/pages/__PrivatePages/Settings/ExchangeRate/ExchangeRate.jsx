import { useExchangeRate } from "api/admin/exchangeRate";
import { Spinner } from "components";
import AddExchangeRate from "components/Modal/Admin/ExchangeRate/AddExchangeRate";
import EditExchangeRate from "components/Modal/Admin/ExchangeRate/EditExchangeRate";
import { useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { TbCurrencyDollar, TbPencilDollar } from "react-icons/tb";
export default function ExchangeRate() {
  const [isOpenAddExchangeRateModal, setIsOpenAddExchangeRateModal] =
    useState(false);
  const [isOpenEditExchangeRateModal, setIsOpenEditExchangeRateModal] =
    useState(false);

  const {
    data: exchangeRate,
    isLoading: exchangeRateIsLoading,
    isSuccess: exchangeRateIsSuccess,
  } = useExchangeRate();

  if (exchangeRateIsLoading) return <Spinner page />;
  return (
    <>
      <div className="flex gap-4">
        {!exchangeRateIsSuccess ? (
          <button
            className="btn btn-primary w-fit !p-2 !text-xl"
            onClick={() => setIsOpenAddExchangeRateModal(true)}
            title="اضافة سعر صرف"
          >
            <TbCurrencyDollar />
          </button>
        ) : (
          <button
            className="btn btn-info w-fit !p-2 !text-xl"
            onClick={() => setIsOpenEditExchangeRateModal(true)}
            title="تعديل سعر الصرف"
          >
            <TbPencilDollar />
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-6">
        {/* بطاقة سعر المبيع */}
        <div
          className="relative flex flex-col items-center p-6 w-56 rounded-2xl shadow-xl cursor-pointer
                      bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                      transition-all hover:scale-105 hover:border-blue-500 dark:hover:border-blue-400"
        >
          <div
            className="absolute -top-3 left-1/2 transform -translate-x-1/2  
                        bg-blue-400 dark:bg-blue-500 text-white px-3 py-1 text-xs font-semibold 
                        rounded-full shadow-md"
          >
            شراء
          </div>
          <FaDollarSign className="text-blue-500 dark:text-blue-400 text-4xl mb-3 drop-shadow-lg" />
          <h3 className="text-gray-800 dark:text-gray-300 text-lg font-semibold">
            سعر الإيداع
          </h3>
          <p
            className="text-blue-600 dark:text-blue-400 text-3xl font-bold mt-2"
            style={{ direction: "ltr" }}
          >
            {exchangeRateIsSuccess ? exchangeRate?.data?.purchase_price : "--"}{" "}
            S.P
          </p>
        </div>

        {/* بطاقة سعر الشراء */}
        <div
          className="relative flex flex-col items-center p-6 w-56 rounded-2xl shadow-xl cursor-pointer
                      bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                      transition-all hover:scale-105 hover:border-green-500 dark:hover:border-green-400"
        >
          <div
            className="absolute -top-3 left-1/2 transform -translate-x-1/2  
                        bg-green-400 dark:bg-green-500 text-white px-3 py-1 text-xs font-semibold 
                        rounded-full shadow-md"
          >
            مبيع
          </div>
          <FaDollarSign className="text-green-500 dark:text-green-400 text-4xl mb-3 drop-shadow-lg" />
          <h3 className="text-gray-800 dark:text-gray-300 text-lg font-semibold">
            سعر السحب
          </h3>
          <p
            className="text-green-600 dark:text-green-400 text-3xl font-bold mt-2"
            style={{ direction: "ltr" }}
          >
            {exchangeRateIsSuccess ? exchangeRate?.data?.selling_price : "--"}{" "}
            S.P
          </p>
        </div>
      </div>

      {!exchangeRateIsSuccess
        ? isOpenAddExchangeRateModal && (
            <AddExchangeRate
              isOpen={isOpenAddExchangeRateModal}
              toggle={setIsOpenAddExchangeRateModal}
            />
          )
        : isOpenEditExchangeRateModal && (
            <EditExchangeRate
              isOpen={isOpenEditExchangeRateModal}
              toggle={setIsOpenEditExchangeRateModal}
              purchase_price={exchangeRate?.data?.purchase_price}
              selling_price={exchangeRate?.data?.selling_price}
              purchase_plus={exchangeRate?.data?.purchase_plus}
              selling_plus={exchangeRate?.data?.selling_plus}
              is_auto={exchangeRate?.data?.is_auto}
            />
          )}
    </>
  );
}
