import Guard from "components/PrivateLayoutPages/Guard/Guard";
import { useState } from "react";

import { useRole } from "api/admin/roleAndPerm";
import { Spinner } from "components";
import AddRole from "components/Modal/Admin/RoleAndPermModal/AddRole";
import DeleteRole from "components/Modal/Admin/RoleAndPermModal/DeleteRole";
import EditRole from "components/Modal/Admin/RoleAndPermModal/EditRole";
import { GrEdit } from "react-icons/gr";
import { LuShieldPlus } from "react-icons/lu";
import { RiDeleteBin3Line } from "react-icons/ri";

export default function RoleAndPermission() {
  const [isOpenAddRoleModal, setIsOpenAddRoleModal] = useState(false);
  const [isOpenEditCatModal, setIsOpenEditCatModal] = useState(false);
  const [isOpenDeleteCatModal, setIsOpenDeleteCatModal] = useState(false);

  const [currentId, setCurrentId] = useState(undefined);

  const {
    data: roles,
    isSuccess: rolesIsSuccess,
    isLoading: rolesIsIsLoading,
  } = useRole();

  return (
    <div className="flex flex-col gap-6 p-4 justify-between bg-gray-50 dark:bg-gray-800 h-full rounded-lg">
      <div className="flex flex-wrap gap-4">
        <Guard permission={"create_roles"}>
          <button
            className="btn btn-primary w-fit !p-2 !text-xl"
            onClick={() => setIsOpenAddRoleModal(true)}
            title="إضافة"
          >
            <LuShieldPlus />
          </button>
        </Guard>
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
            {rolesIsSuccess &&
              roles?.data.map((item, index) => (
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
                      <Guard permission={"edit_roles"}>
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
                      <Guard permission={"delete_roles"}>
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

        {rolesIsIsLoading && (
          <div className="my-4">
            <Spinner />
          </div>
        )}

        {!rolesIsIsLoading && roles?.data.length === 0 && (
          <div className="w-full text-center p-5 font-semibold bg-gray-200 dark:bg-gray-900 dark:text-white">
            <h1>لا يوجد بيانات</h1>
          </div>
        )}
      </div>

      <Guard permission={"create_roles"}>
        {isOpenAddRoleModal && (
          <AddRole isOpen={isOpenAddRoleModal} toggle={setIsOpenAddRoleModal} />
        )}
      </Guard>

      <Guard permission={"edit_roles"}>
        {isOpenEditCatModal && (
          <EditRole
            isOpen={isOpenEditCatModal}
            toggle={setIsOpenEditCatModal}
            roleId={currentId}
          />
        )}
      </Guard>
      <Guard permission={"delete_roles"}>
        {isOpenDeleteCatModal && (
          <DeleteRole
            isOpen={isOpenDeleteCatModal}
            toggle={setIsOpenDeleteCatModal}
            roleId={currentId}
          />
        )}
      </Guard>
    </div>
  );
}
