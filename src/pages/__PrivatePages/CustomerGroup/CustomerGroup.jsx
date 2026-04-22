import {
  useCustomerGroup,
  useDefaultCustomerGroup,
  useSetDefaultCustomerGroup,
} from "api/admin/customerGroup";
import { Spinner } from "components";
import Guard from "components/PrivateLayoutPages/Guard/Guard";
import { useState } from "react";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin3Line } from "react-icons/ri";

import AddGroup from "components/Modal/Admin/CustomerGroupModal/AddGroup";
import DeleteGroup from "components/Modal/Admin/CustomerGroupModal/DeleteGroup";
import EditGroup from "components/Modal/Admin/CustomerGroupModal/EditGroup";
import { BsToggles } from "react-icons/bs";
import { TbUsersPlus } from "react-icons/tb";

export default function CustomerGroup() {
  const [isOpenAddGroupModal, setIsOpenAddGroupModal] = useState(false);
  const [isOpenEditCatModal, setIsOpenEditCatModal] = useState(false);
  const [isOpenDeleteCatModal, setIsOpenDeleteCatModal] = useState(false);

  const [currentId, setCurrentId] = useState(undefined);

  const {
    data: customersGroups,
    isSuccess: customersGroupsIsSuccess,
    isLoading: customersGroupsIsLoading,
    isFetching: customersGroupsIsFetching,
  } = useCustomerGroup();

  const {
    data: defaultCustomersGroups,
    isSuccess: defaultCustomersGroupsIsSuccess,
    isLoading: defaultCustomersGroupsIsLoading,
    isFetching: defaultCustomersGroupsIsFetching,
  } = useDefaultCustomerGroup();

  const {
    mutate: setRoleDefault,
    isPending: IsPending,
    isSuccess: IsSuccess,
  } = useSetDefaultCustomerGroup();

  return (
    <div className="flex flex-col gap-6 p-4 justify-between bg-gray-50 dark:bg-gray-800 h-full rounded-lg">
      <div className="flex flex-wrap gap-4">
        <Guard permission={"create_customer_groups"}>
          <button
            className="btn btn-primary w-fit !p-2 !text-xl"
            onClick={() => setIsOpenAddGroupModal(true)}
            title="إضافة"
          >
            <TbUsersPlus />
          </button>
        </Guard>
        {customersGroupsIsSuccess && customersGroupsIsFetching && (
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
              <th scope="col" className="px-4 py-2 text-nowrap  max-w-20">
                الادوات
              </th>
            </tr>
          </thead>
          <tbody className="">
            {customersGroupsIsSuccess &&
              customersGroups?.data.map((item, index) => (
                <tr
                  className={`
                        odd:bg-white text-lg_ odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 
                        hover:dark:bg-gray-700 hover:bg-gray-200
                        `}
                  key={index}
                >
                  <td className="px-4 py-2 text-nowrap">{item.id} </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.name}
                  </td>

                  <td className="p-1">
                    <div className="flex gap-2 justify-center items-center p-1">
                      <Guard permission={"edit_customer_groups"}>
                        <button
                          className={`btn ${
                            defaultCustomersGroups?.id === item.id
                              ? "btn-success disabled:bg-green-500 disabled:hover:bg-green-500"
                              : "btn-dark"
                          } text-xs_ !p-1.5`}
                          onClick={() => {
                            setRoleDefault({ role_id: item.id });
                          }}
                          disabled={
                            defaultCustomersGroups?.id === item.id
                              ? true
                              : false
                          }
                          title="تعيين افتراضي"
                        >
                          <BsToggles />
                        </button>
                        <button
                          className="btn btn-primary text-xs_ !p-1.5"
                          onClick={() => {
                            setCurrentId(item.id);
                            setIsOpenEditCatModal(true);
                          }}
                          title="تعديل"
                        >
                          <GrEdit />
                        </button>
                      </Guard>
                      <Guard permission={"delete_customer_groups"}>
                        <button
                          className="btn btn-danger text-xs_ !p-1.5"
                          onClick={() => {
                            setCurrentId(item.id);
                            setIsOpenDeleteCatModal(true);
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

        {customersGroupsIsLoading && (
          <div className="my-4">
            <Spinner />
          </div>
        )}

        {!customersGroupsIsLoading && customersGroups?.data.length === 0 && (
          <div className="w-full text-center p-5 font-semibold bg-gray-200 dark:bg-gray-900 dark:text-white">
            <h1>لا يوجد بيانات</h1>
          </div>
        )}
      </div>

      <Guard permission={"create_customer_groups"}>
        {isOpenAddGroupModal && (
          <AddGroup
            isOpen={isOpenAddGroupModal}
            toggle={setIsOpenAddGroupModal}
          />
        )}
      </Guard>

      <Guard permission={"edit_customer_groups"}>
        {isOpenEditCatModal && (
          <EditGroup
            isOpen={isOpenEditCatModal}
            toggle={setIsOpenEditCatModal}
            groupId={currentId}
          />
        )}
      </Guard>
      <Guard permission={"delete_customer_groups"}>
        {isOpenDeleteCatModal && (
          <DeleteGroup
            isOpen={isOpenDeleteCatModal}
            toggle={setIsOpenDeleteCatModal}
            groupId={currentId}
          />
        )}
      </Guard>
    </div>
  );
}
