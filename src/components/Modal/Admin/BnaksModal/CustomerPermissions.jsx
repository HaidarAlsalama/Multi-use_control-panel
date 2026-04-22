import {
  useBankBlockList,
  useToggleBlockBank,
  useToggleBlockBankAll,
} from "api/admin/bank";
import { Spinner } from "components";
import InputSearch from "components/InputField/InputSearch";
import { useState } from "react";
import { BsToggles } from "react-icons/bs";
import { FaBan, FaRegCheckCircle } from "react-icons/fa";
import ActionModal from "../../ActionModal/ActionModal";

export default function CustomerPermissions({ isOpen, toggle, bankId }) {
  const [searchValue, setSearchValue] = useState("");

  const {
    data: users,
    isSuccess: usersIsSuccess,
    isLoading: usersIsLoading,
    isFetching: usersIsFetching,
  } = useBankBlockList(bankId, searchValue);

  const { mutate: onStatusAll, isPending: onStatusIsPending } =
    useToggleBlockBankAll(bankId);

  const { mutate: offStatusAll, isPending: offStatusIsPending } =
    useToggleBlockBankAll(bankId);

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="small"
      title={`تعديل صلاحيات الزبائن للبنوك`}
    >
      <div className="flex flex-wrap gap-4">
        <InputSearch
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setPageNumber={(n) => null}
        />

        <button
          disabled={onStatusIsPending}
          className="btn btn-success w-fit !p-2 !text-xl"
          onClick={() => onStatusAll({ action: "show" })}
          title="تفعيل للكل"
        >
          <FaRegCheckCircle />
        </button>

        <button
          disabled={offStatusIsPending}
          className="btn btn-danger w-fit !p-2 !text-xl"
          onClick={() => offStatusAll({ action: "hide" })}
          title="تعطيل للكل"
        >
          <FaBan />
        </button>

        {usersIsSuccess && usersIsFetching && (
          <span className="btn btn-success w-fit !p-2 ">
            تحديث البيانات <Spinner xs className="text-white" />
          </span>
        )}
      </div>
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
              users?.data?.map((item, index) => (
                <tr
                  className={`
                                odd:bg-white text-lg_ odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 
                                hover:dark:bg-gray-700 hover:bg-gray-200
                                `}
                  key={index}
                >
                  <td className="px-4 py-2 text-nowrap">{item.user_id} </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.name}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.email}
                  </td>

                  <td className="p-1">
                    <div className="flex gap-2 justify-center items-center p-1">
                      <ToggleBlockBankButton
                        currentState={item.is_blocked}
                        userId={item.user_id}
                        categoryId={bankId}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {usersIsLoading && (
          <div className="my-4">
            <Spinner />
          </div>
        )}

        {!usersIsLoading && users?.data?.length === 0 && (
          <div className="w-full text-center p-5 font-semibold bg-gray-200 dark:bg-gray-900 dark:text-white">
            <h1>لا يوجد بيانات</h1>
          </div>
        )}
      </div>

      {/* Pagination */}
      {/* <div className="flex flex-col items-center my-4 w-full">
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
      </div> */}
    </ActionModal>
  );
}

function ToggleBlockBankButton({ currentState, userId, categoryId }) {
  const { mutate: toggleStatus, isPending: toggleStatusIsPending } =
    useToggleBlockBank(categoryId);
  return (
    <button
      className={`btn ${
        !currentState ? "btn-success" : "btn-warning"
      } text-xs_ !p-1.5`}
      onClick={() => toggleStatus({ userId })}
      title={`${!currentState ? "تعطيل" : "تفعيل"}`}
      disabled={toggleStatusIsPending}
    >
      {toggleStatusIsPending ? <Spinner xs /> : <BsToggles />}
    </button>
  );
}
