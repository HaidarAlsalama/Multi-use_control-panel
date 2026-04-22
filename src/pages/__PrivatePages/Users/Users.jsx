import Guard from "components/PrivateLayoutPages/Guard/Guard";
import { useState } from "react";

import { useUsers } from "api/admin/user";
import { Spinner } from "components";
import ToggleStateButton from "components/Buttons/ToggleStateButton";
import InputSearch from "components/InputField/InputSearch";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin3Line } from "react-icons/ri";

import AddUser from "components/Modal/Admin/usersModal/AddUser";
import DeleteUser from "components/Modal/Admin/usersModal/DeleteUser";
import EditUser from "components/Modal/Admin/usersModal/EditUser";
import { FiUserPlus } from "react-icons/fi";

export default function Categories() {
  const [isOpenAddUserModal, setIsOpenUsersCatModal] = useState(false);
  const [isOpenEditUserModal, setIsOpenEditUserModal] = useState(false);
  const [isOpenDeleteCatModal, setIsOpenDeleteCatModal] = useState(false);

  const [currentId, setCurrentId] = useState(undefined);

  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchValue, setSearchValue] = useState("");

  const {
    data: users,
    isSuccess: usersIsSuccess,
    isLoading: usersIsIsLoading,
  } = useUsers(searchValue, limit, pageNumber);

  // useEffect(() => {
  //   if (parentId) setSearchValue("");
  // }, [parentId]);

  return (
    <div className="flex flex-col gap-6 p-4 justify-between bg-gray-50 dark:bg-gray-800 h-full rounded-lg">
      <div className="flex flex-wrap gap-4">
        <Guard permission={"create_users"}>
          <button
            className="btn btn-primary w-fit !p-2 !text-xl"
            onClick={() => setIsOpenUsersCatModal(true)}
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
                البريد الإلكتروني
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap  max-w-20">
                الادوات
              </th>
            </tr>
          </thead>
          <tbody className="">
            {usersIsSuccess &&
              users?.data?.users.map((item, index) => (
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
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.email}
                  </td>

                  <td className="p-1">
                    <div className="flex gap-2 justify-center items-center p-1">
                      <Guard permission={"edit_users"}>
                        <ToggleStateButton
                          type={"users"}
                          currentState={item.state}
                          id={item.id}
                        />
                        <button
                          className="btn btn-primary text-xs_ !p-1.5"
                          onClick={() => {
                            setCurrentId(item.id);
                            setIsOpenEditUserModal(true);
                          }}
                          title="Edit"
                        >
                          <GrEdit />
                        </button>
                      </Guard>
                      <Guard permission={"delete_users"}>
                        <button
                          className="btn btn-danger text-xs_ !p-1.5"
                          onClick={() => {
                            setCurrentId(item.id);
                            setIsOpenDeleteCatModal(true);
                          }}
                          title="Delete"
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

        {usersIsIsLoading && (
          <div className="my-4">
            <Spinner />
          </div>
        )}

        {!usersIsIsLoading && users?.data?.users.length === 0 && (
          <div className="w-full text-center p-5 font-semibold bg-gray-200 dark:bg-gray-900 dark:text-white">
            <h1>لا يوجد بيانات</h1>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center my-4 w-full">
        <span className="text-sm text-gray-700 dark:text-gray-400 flex gap-1">
          <span className="font-semibold text-gray-900 dark:text-white">
            {users?.data?.pagination?.current_page || 0}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            من اصل
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {users?.data?.pagination?.last_page || 0}
          </span>{" "}
        </span>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setPageNumber((prev) => prev - 1)}
            disabled={pageNumber === 1 || usersIsIsLoading}
            className="btn btn-info text-sm !p-1 w-20 "
          >
            السابق
          </button>
          <button
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={
              users?.data?.users.length === 0 ||
              pageNumber >= users?.data.pagination?.last_page ||
              users?.data?.pagination?.total === 0 ||
              usersIsIsLoading
            }
            className="btn btn-primary text-sm !p-1 w-20 "
          >
            التالي
          </button>
        </div>
      </div>

      <Guard permission={"create_users"}>
        {isOpenAddUserModal && (
          <AddUser
            isOpen={isOpenAddUserModal}
            toggle={setIsOpenUsersCatModal}
          />
        )}
      </Guard>
      <Guard permission={"edit_users"}>
        {isOpenEditUserModal && (
          <EditUser
            isOpen={isOpenEditUserModal}
            toggle={setIsOpenEditUserModal}
            userId={currentId}
          />
        )}
      </Guard>
      <Guard permission={"delete_users"}>
        {isOpenDeleteCatModal && (
          <DeleteUser
            isOpen={isOpenDeleteCatModal}
            toggle={setIsOpenDeleteCatModal}
            userId={currentId}
          />
        )}
      </Guard>
    </div>
  );
}
