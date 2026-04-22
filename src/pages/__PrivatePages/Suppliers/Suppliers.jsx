import Guard from "components/PrivateLayoutPages/Guard/Guard";
import { useState } from "react";

import { useSuppliers } from "api/admin/supplier";
import { Spinner } from "components";
import ToggleStateButton from "components/Buttons/ToggleStateButton";
import InputSearch from "components/InputField/InputSearch";
import DeleteAgent from "components/Modal/Admin/AgentsModal/DeleteAgent";
import EditAgent from "components/Modal/Admin/AgentsModal/EditAgent";
import AddSuppliers from "components/Modal/Admin/SuppliersModal/AddSuppliers";
import { FiUserPlus } from "react-icons/fi";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin3Line } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function Suppliers() {
  const [isOpenAddAgentsModal, setIsOpenAddAgentsModal] = useState(false);
  const [isOpenEditAgentsModal, setIsOpenEditAgentsModal] = useState(false);
  const [isOpenDeleteAgentsModal, setIsOpenDeleteAgentsModal] = useState(false);

  const [currentId, setCurrentId] = useState(undefined);

  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchValue, setSearchValue] = useState("");

  const {
    data: agents,
    isSuccess: agentsIsSuccess,
    isLoading: agentsIsLoading,
    isFetching: agentsIsFetching,
  } = useSuppliers(searchValue, limit, pageNumber);

  return (
    <div className="flex flex-col gap-6 p-4 justify-between bg-gray-50 dark:bg-gray-800 h-full rounded-lg">
      <div className="flex flex-wrap gap-4">
        {/* <Guard permission={"create_suppliers"}> */}
        <button
          className="btn btn-primary w-fit !p-2 !text-xl"
          onClick={() => setIsOpenAddAgentsModal(true)}
        >
          <FiUserPlus />
        </button>

        {agentsIsSuccess && agentsIsFetching && (
          <span className="btn btn-success w-fit !p-2 ">
            تحديث البيانات <Spinner xs className="text-white" />
          </span>
        )}
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
                الاسم
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                رقم الموبايل
              </th>

              <th scope="col" className="px-4 py-2 text-nowrap">
                الرصيد
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap  max-w-20">
                الادوات
              </th>
            </tr>
          </thead>
          <tbody className="">
            {agentsIsSuccess &&
              agents?.data?.map((item, index) => (
                <tr
                  className={`
                        odd:bg-white text-lg_ odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 
                        hover:dark:bg-gray-700 hover:bg-gray-200
                        `}
                  key={index}
                >
                  <td className="px-4 py-2 text-nowrap">{item.id} </td>

                  <td className="px-4 py-2 font-bold">
                    <Link to={`/dashboard/suppliers/${item.id}`}>
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.phone}
                  </td>

                  <td className="px-4 py-2 font-bold">
                    <div className="w-full max-w-56 mx-auto overflow-hidden whitespace-nowrap text-ellipsis">
                      {item.balance} <span className="text-xs">ل.س</span>
                    </div>
                  </td>

                  <td className="p-1">
                    <div className="flex gap-2 justify-center items-center p-1">
                      <button
                        className="btn btn-primary text-xs_ !p-1.5"
                        onClick={() => {
                          setCurrentId(item.id);
                          // setIsOpenEditAgentsModal(true);
                        }}
                        title="تعديل"
                      >
                        <GrEdit />
                      </button>

                      <Guard permission={"delete_agents"}>
                        <button
                          className="btn btn-danger text-xs_ !p-1.5"
                          onClick={() => {
                            setCurrentId(item.id);
                            // setIsOpenDeleteAgentsModal(true);
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

      {/* Pagination */}

      {isOpenAddAgentsModal && (
        <AddSuppliers
          isOpen={isOpenAddAgentsModal}
          toggle={setIsOpenAddAgentsModal}
        />
      )}
      {isOpenEditAgentsModal && (
        <EditAgent
          isOpen={isOpenEditAgentsModal}
          toggle={setIsOpenEditAgentsModal}
          agentId={currentId}
        />
      )}
      {isOpenDeleteAgentsModal && (
        <DeleteAgent
          isOpen={isOpenDeleteAgentsModal}
          toggle={setIsOpenDeleteAgentsModal}
          agentId={currentId}
        />
      )}
    </div>
  );
}
