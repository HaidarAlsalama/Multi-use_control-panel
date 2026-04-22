import { useCustomers, useTotalBalance } from "api/admin/customer";
import { Spinner } from "components";
import ToggleStateButton from "components/Buttons/ToggleStateButton";
import InputSearch from "components/InputField/InputSearch";
import AddCustomer from "components/Modal/Admin/CustomersModal/AddCustomer";
import DeleteCustomer from "components/Modal/Admin/CustomersModal/DeleteCustomer";
import EditCustomer from "components/Modal/Admin/CustomersModal/EditCustomer";
import JoinToBrokerModal from "components/Modal/Admin/CustomersModal/JoinToBrokerModal";
import Guard from "components/PrivateLayoutPages/Guard/Guard";
import { useState } from "react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FiUserPlus } from "react-icons/fi";
import { GrEdit } from "react-icons/gr";
import { ImUsers } from "react-icons/im";
import { RiDeleteBin3Line } from "react-icons/ri";
import { Link } from "react-router-dom";
export default function Customers() {
  const [isOpenAddCustomerModal, setIsOpenAddCustomerModal] = useState(false);
  const [isOpenEditCustomerModal, setIsOpenEditCustomerModal] = useState(false);
  const [isOpenDeleteCustomerModal, setIsOpenDeleteCustomerModal] =
    useState(false);
  // const [isOpenCustomerPermissionsModal, setIsOpenCustomerPermissionsModal] =
  //   useState(false);
  const [isOpenJoinToBrokerModal, setIsOpenJoinToBrokerModal] = useState(false);

  const [currentId, setCurrentId] = useState(undefined);

  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchValue, setSearchValue] = useState("");

  const {
    data: customers,
    isSuccess: customersIsSuccess,
    isLoading: customersIsLoading,
    isFetching: customersIsFetching,
  } = useCustomers(limit, pageNumber, searchValue);

  const {
    data: totalBalance,
    isSuccess: totalBalanceIsSuccess,
    isLoading: totalBalanceIsLoading,
    isFetching: totalBalanceIsFetching,
  } = useTotalBalance();

  return (
    <div className="flex flex-col gap-6 p-4 justify-between bg-gray-50 dark:bg-gray-800 h-full rounded-lg">
      <div className="flex flex-wrap gap-4">
        <Guard permission={"create_customer"}>
          <button
            className="btn btn-primary w-fit !p-2 !text-xl"
            onClick={() => setIsOpenAddCustomerModal(true)}
          >
            <FiUserPlus />
          </button>
        </Guard>
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

      {totalBalanceIsSuccess && (
        <div className="dark:bg-gray-900 bg-white px-4 py-2 rounded-xl shadow-md w-fit">
          <div className="grid grid-cols-1 gap-4">
            {/* مجموع الأرصدة باليرة  */}
            <div className="flex items-center gap-2">
              <span className=" *: font-semibold text-gray-700 dark:text-white">
                مجموع الأرصدة باليرة :
              </span>
              <span className="font-bold text-lg text-blue-500" dir="ltr">
                {Number(totalBalance.data.sp?.split(" ")[0]).toLocaleString()}
              </span>
            </div>

            {/* <div className="flex items-center gap-2">
              <span className=" *: font-semibold text-gray-700 dark:text-white">
                مجموع الأرصدة بالدولار:
              </span>
              <span className="font-bold text-lg text-green-500" dir="ltr">
                {Number(totalBalance.data.usd?.split(" ")[0]).toLocaleString()}
              </span>
            </div> */}
          </div>
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
                الاسم
              </th>
              {/* <th scope="col" className="px-4 py-2 text-nowrap">
                اسم المركز
              </th> */}
              <th scope="col" className="px-4 py-2 text-nowrap">
                الرصيد
              </th>
              {/* <th scope="col" className="px-4 py-2 text-nowrap">
                البريد الإلكتروني
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                رقم الموبايل
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                مجموعة الزبون
              </th> */}
              <th scope="col" className="px-4 py-2 text-nowrap">
                الاجهزة المتصلة
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                الاجهزة المتاحة
              </th>

              <th scope="col" className="px-4 py-2 text-nowrap  max-w-20">
                الادوات
              </th>
            </tr>
          </thead>
          <tbody className="">
            {customersIsSuccess &&
              customers?.data?.user.map((item, index) => (
                <tr
                  className={`
                        odd:bg-white text-lg_ odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 
                        hover:dark:bg-gray-700 hover:bg-gray-200
                        `}
                  key={index}
                >
                  <td className="px-4 py-2 text-nowrap">{item.id} </td>
                  <td className="px-4 py-2 text-nowrap">{item.name}</td>
                  {/* <td className="px-4 py-2 ">{item.center_name}</td> */}
                  <td className="px-4 py-2" dir="ltr">
                    {(() => {
                      const [amountStr, currency] = item.balance
                        .trim()
                        ?.split(/\s+/);
                      const num = parseFloat(amountStr.replace(/,/g, ""));
                      const amount =
                        num % 1 === 0
                          ? num
                          : +num.toFixed(3).replace(/\.?0+$/, "");

                      const amountColor =
                        amount < 0 ? "text-red-500" : "text-green-500";

                      return (
                        <div className="flex gap-2 items-center justify-center">
                          <span className={`font-bold ${amountColor}`}>
                            {amount.toLocaleString()}
                          </span>{" "}
                          <span className="text-gray-500 text-xs">
                            {currency}
                          </span>
                        </div>
                      );
                    })()}
                  </td>

                  {/* <td className="px-4 py-2 ">{item.email}</td> */}
                  {/* <td className="px-4 py-2 ">{item.phone}</td> */}
                  {/* <td className="px-4 py-2 ">{item.roles[0]}</td> */}
                  <td className="px-4 py-2 ">{item.tokens_count}</td>
                  <td className="px-4 py-2 ">{item.total_device}</td>

                  <td className="p-1">
                    <div className="flex gap-2 justify-center items-center p-1">
                      <Guard permission={"edit_customer"}>
                        <ToggleStateButton
                          type={"users"}
                          currentState={item.state}
                          id={item.id}
                        />
                        <button
                          className="btn btn-primary text-xs_ !p-1.5"
                          onClick={() => {
                            setCurrentId(item.id);
                            setIsOpenEditCustomerModal(true);
                          }}
                          title="تعديل"
                        >
                          <GrEdit />
                        </button>
                      </Guard>

                      <Link
                        className="btn btn-info text-xs_ !p-1.5"
                        to={`/dashboard/customers/financial-statement?customerId=${item.customerId}`}
                        title="البيان المالي"
                      >
                        <FaMoneyBillTransfer />
                      </Link>

                      {/* <button
                        className="btn btn-info text-xs_ !p-1.5"
                        onClick={() => {
                          setCurrentId(item.id);
                          setIsOpenCustomerPermissionsModal(true);
                        }}
                        title="ادارة صلاحيات التصنيفات"
                      >
                        <LuUserRoundCog />
                      </button> */}

                      {/* <button
                        className="btn btn-dark text-xs_ !p-1.5"
                        onClick={() => {
                          setCurrentId(item.id);
                          setIsOpenJoinToBrokerModal(true);
                        }}
                        title="الإنضمام لوكيل"
                      >
                        <ImUsers />
                      </button> */}

                      <Guard permission={"delete_customer"}>
                        <button
                          className="btn btn-danger text-xs_ !p-1.5"
                          onClick={() => {
                            setCurrentId(item.id);
                            setIsOpenDeleteCustomerModal(true);
                          }}
                          title="حذف"
                        >
                          <RiDeleteBin3Line />
                        </button>
                      </Guard>
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

        {!customersIsLoading && customers?.data?.user.length === 0 && (
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
              customers?.data?.user.length === 0 ||
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

      <Guard permission={"create_customer"}>
        {isOpenAddCustomerModal && (
          <AddCustomer
            isOpen={isOpenAddCustomerModal}
            toggle={setIsOpenAddCustomerModal}
          />
        )}
      </Guard>

      <Guard permission={"edit_customer"}>
        {isOpenEditCustomerModal && (
          <EditCustomer
            isOpen={isOpenEditCustomerModal}
            toggle={setIsOpenEditCustomerModal}
            customerId={currentId}
          />
        )}
      </Guard>

      <Guard permission={"delete_customer"}>
        {isOpenDeleteCustomerModal && (
          <DeleteCustomer
            isOpen={isOpenDeleteCustomerModal}
            toggle={setIsOpenDeleteCustomerModal}
            customerId={currentId}
          />
        )}
      </Guard>

      {isOpenJoinToBrokerModal && (
        <JoinToBrokerModal
          isOpen={isOpenJoinToBrokerModal}
          toggle={setIsOpenJoinToBrokerModal}
          customerId={currentId}
        />
      )}
    </div>
  );
}
