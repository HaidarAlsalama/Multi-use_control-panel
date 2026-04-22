import { useState } from "react";

import { useSupplierById, useSuppliers } from "api/admin/supplier";
import { Spinner } from "components";
import { TbUserDollar } from "react-icons/tb";
import { useParams } from "react-router-dom";
import TranferToSupplier from "components/Modal/Admin/SuppliersModal/TranferToSupplier";

export default function SupplierById() {
  const { supplierId } = useParams();

  const [isOpenAddAgentsModal, setIsOpenAddAgentsModal] = useState(false);
  const [isOpenEditAgentsModal, setIsOpenEditAgentsModal] = useState(false);
  const [isOpenDeleteAgentsModal, setIsOpenDeleteAgentsModal] = useState(false);

  const [currentId, setCurrentId] = useState(undefined);

  const {
    data: agents,
    isSuccess: agentsIsSuccess,
    isLoading: agentsIsLoading,
    isFetching: agentsIsFetching,
  } = useSupplierById(supplierId);

  return (
    <div className="flex flex-col gap-6 p-4 justify-between bg-gray-50 dark:bg-gray-800 h-full rounded-lg">
      <div className="flex flex-wrap gap-4">
        {/* <Guard permission={"create_suppliers"}> */}
        <button
          className="btn btn-primary w-fit !p-2 !text-xl"
          onClick={() => setIsOpenAddAgentsModal(true)}
        >
          <TbUserDollar />
        </button>

        {agentsIsSuccess && agentsIsFetching && (
          <span className="btn btn-success w-fit !p-2 ">
            تحديث البيانات <Spinner xs className="text-white" />
          </span>
        )}
      </div>

      {agentsIsSuccess && (
        <div className="dark:bg-gray-900 bg-white px-4 py-2 rounded-xl shadow-md w-fit">
          <div className="flex flex-wrap justify-between_ items-center gap-4">
            {/* المركز */}
            <div className="flex items-center gap-2">
              <span className=" *: font-semibold text-gray-700 dark:text-white">
                المورد:
              </span>
              <span className="font-extrabold text-yellow-500">
                {agents.data.supplier.name}
              </span>
            </div>

            {/* الرصيد */}
            <div className="flex items-center gap-2">
              <span className=" *: font-semibold text-gray-700 dark:text-white">
                الرصيد:
              </span>
              <div className="inline-block md:text-xl font-bold">
                <span
                  className={`${
                    agents.data.supplier.balance === 0
                      ? "text-yellow-500 dark:text-yellow-400"
                      : agents.data.supplier.balance < 0
                        ? "text-red-500 dark:text-red-400"
                        : "text-green-500 dark:text-green-400"
                  }`}
                >
                  {Number(agents.data.supplier.balance).toLocaleString()}
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  ل.س
                </span>
              </div>
            </div>
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
                من
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                المبلغ
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                التفاصيل
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                التاريخ
              </th>
            </tr>
          </thead>
          <tbody className="">
            {agentsIsSuccess &&
              agents?.data?.transactions.map((item, index) => (
                <tr
                  className={`
                        odd:bg-white text-lg_ odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 
                        hover:dark:bg-gray-700 hover:bg-gray-200
                        `}
                  key={index}
                >
                  <td className="px-4 py-2 text-nowrap">{item.id} </td>

                  <td className="px-4 py-2 font-bold">
                    {item.type == "credit" ? item.from_name : item.to_name}
                  </td>

                  <td className="px-4 py-2 font-bold">
                    <div className="w-full max-w-56 mx-auto overflow-hidden whitespace-nowrap text-ellipsis">
                      <span
                        className={`${item.type == "credit" ? "text-green-500" : "text-red-500"} `}
                      >
                        {item.amount}
                      </span>{" "}
                      <span className="text-xs">ل.س</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.description}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.created_at}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {agentsIsLoading && (
          <div className="my-4">
            <Spinner />
          </div>
        )}

        {!agentsIsLoading && agents?.data?.length === 0 && (
          <div className="w-full text-center p-5 font-semibold bg-gray-200 dark:bg-gray-900 dark:text-white">
            <h1>لا يوجد بيانات</h1>
          </div>
        )}
      </div>

      {isOpenAddAgentsModal && (
        <TranferToSupplier
          isOpen={isOpenAddAgentsModal}
          toggle={setIsOpenAddAgentsModal}
          supplierId={supplierId}
        />
      )}
    </div>
  );
}
