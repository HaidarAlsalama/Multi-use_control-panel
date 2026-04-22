import Guard from "components/PrivateLayoutPages/Guard/Guard";
import { image_host } from "config/api_host";
import { useState } from "react";

import { useBanks } from "api/admin/bank";
import { Spinner } from "components";
import ToggleStateButton from "components/Buttons/ToggleStateButton";
import InputSearch from "components/InputField/InputSearch";
import AddBank from "components/Modal/Admin/BnaksModal/AddBank";
import DeleteBank from "components/Modal/Admin/BnaksModal/DeleteBank";
import EditBank from "components/Modal/Admin/BnaksModal/EditBank";
import { GrEdit } from "react-icons/gr";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { RiDeleteBin3Line, RiUserSettingsLine } from "react-icons/ri";
import CustomerPermissions from "components/Modal/Admin/BnaksModal/CustomerPermissions";
import { TbUserShield } from "react-icons/tb";
import GroupPermissions from "components/Modal/Admin/BnaksModal/GroupPermissions";

export default function Banks() {
  const [isOpenAddBankModal, setIsOpenAddBankModal] = useState(false);
  const [isOpenEditBankModal, setIsOpenEditBankModal] = useState(false);
  const [isOpenDeleteBankModal, setIsOpenDeleteBankModal] = useState(false);
  const [isOpenCustomerPermissionsModal, setIsOpenCustomerPermissionsModal] =
    useState(false);
  const [isOpenGroupPermissionsModal, setIsOpenGroupPermissionsModal] =
    useState(false);
  const [currentId, setCurrentId] = useState(undefined);

  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchValue, setSearchValue] = useState("");

  const {
    data: banks,
    isSuccess: banksIsSuccess,
    isLoading: banksIsLoading,
    isFetching: banksIsFetching,
  } = useBanks(searchValue, limit, pageNumber);

  return (
    <div className="flex flex-col gap-6 p-4 justify-between bg-gray-50 dark:bg-gray-800 h-full rounded-lg">
      <div className="flex flex-wrap gap-4">
        <Guard permission={"create_banks"}>
          <button
            className="btn btn-primary w-fit !p-2 !text-xl"
            onClick={() => setIsOpenAddBankModal(true)}
          >
            <HiOutlineSquaresPlus />
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
        {banksIsSuccess && banksIsFetching && (
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
                الصورة
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                الاسم
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                الاسم بالانكليزية
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                العملة
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                العمولة
              </th>

              <th scope="col" className="px-4 py-2 text-nowrap  max-w-20">
                الادوات
              </th>
            </tr>
          </thead>
          <tbody className="">
            {banksIsSuccess &&
              banks?.data?.banks.map((item, index) => (
                <tr
                  className={`
                        odd:bg-white text-lg_ odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 
                        hover:dark:bg-gray-700 hover:bg-gray-200
                        `}
                  key={index}
                >
                  <td className="px-4 py-2 text-nowrap">{item.id} </td>
                  <td className="px-4 py-2 ">
                    <div className="h-16 w-28 md:h-fit md:w-32 m-auto">
                      <img
                        src={`${image_host}/storage/${item.image}`}
                        className=" mx-auto"
                        alt=""
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.name}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.name_en ?? "- - - -"}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.currency ?? "- - - -"}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.commission_percentage ?? "- - - -"}
                  </td>

                  <td className="p-1">
                    <div className="flex gap-2 justify-center items-center p-1">
                      <Guard permission={"edit_banks"}>
                        <ToggleStateButton
                          type={"bank"}
                          currentState={item.state}
                          id={item.id}
                        />
                        <button
                          className="btn btn-primary text-xs_ !p-1.5"
                          onClick={() => {
                            setCurrentId(item.id);
                            setIsOpenEditBankModal(true);
                          }}
                          title="تعديل"
                        >
                          <GrEdit />
                        </button>
                        <button
                          className="btn btn-info text-xs_ !p-1.5"
                          onClick={() => {
                            setCurrentId(item.id);
                            setIsOpenCustomerPermissionsModal(true);
                          }}
                          title="صلاحيات الزبائن"
                        >
                          <RiUserSettingsLine />
                        </button>
                        <button
                          className="btn btn-dark text-xs_ !p-1.5"
                          onClick={() => {
                            setCurrentId(item.id);
                            setIsOpenGroupPermissionsModal(true);
                          }}
                          title="صلاحيات مجموعات الزبائن"
                        >
                          <TbUserShield />
                        </button>
                      </Guard>
                      <Guard permission={"delete_banks"}>
                        <button
                          className="btn btn-danger text-xs_ !p-1.5"
                          onClick={() => {
                            setCurrentId(item.id);
                            setIsOpenDeleteBankModal(true);
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

        {banksIsLoading && (
          <div className="my-4">
            <Spinner />
          </div>
        )}

        {!banksIsLoading && banks?.data?.banks.length === 0 && (
          <div className="w-full text-center p-5 font-semibold bg-gray-200 dark:bg-gray-900 dark:text-white">
            <h1>لا يوجد بيانات</h1>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center my-4 w-full">
        <span className="text-sm text-gray-700 dark:text-gray-400 flex gap-1">
          <span className="font-semibold text-gray-900 dark:text-white">
            {banks?.data?.pagination?.current_page || 0}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            من اصل
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {banks?.data?.pagination?.last_page || 0}
          </span>{" "}
        </span>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setPageNumber((prev) => prev - 1)}
            disabled={pageNumber === 1 || banksIsLoading}
            className="btn btn-info text-sm !p-1 w-20 "
          >
            السابق
          </button>
          <button
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={
              banks?.data?.banks.length === 0 ||
              pageNumber >= banks?.data.pagination?.last_page ||
              banks?.data?.pagination?.total === 0 ||
              banksIsLoading
            }
            className="btn btn-primary text-sm !p-1 w-20 "
          >
            التالي
          </button>
        </div>
      </div>

      <Guard permission={"create_banks"}>
        {isOpenAddBankModal && (
          <AddBank isOpen={isOpenAddBankModal} toggle={setIsOpenAddBankModal} />
        )}
      </Guard>
      <Guard permission={"edit_banks"}>
        {isOpenEditBankModal && (
          <EditBank
            isOpen={isOpenEditBankModal}
            toggle={setIsOpenEditBankModal}
            bankId={currentId}
          />
        )}
        {isOpenCustomerPermissionsModal && (
          <CustomerPermissions
            isOpen={isOpenCustomerPermissionsModal}
            toggle={setIsOpenCustomerPermissionsModal}
            bankId={currentId}
            _TYPE={"bank"}
          />
        )}

        {isOpenGroupPermissionsModal && (
          <GroupPermissions
            isOpen={isOpenGroupPermissionsModal}
            toggle={setIsOpenGroupPermissionsModal}
            bankId={currentId}
            _TYPE={"bank"}
          />
        )}
      </Guard>
      <Guard permission={"delete_banks"}>
        {isOpenDeleteBankModal && (
          <DeleteBank
            isOpen={isOpenDeleteBankModal}
            toggle={setIsOpenDeleteBankModal}
            bankId={currentId}
          />
        )}
      </Guard>
    </div>
  );
}
