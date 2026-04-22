import { useProductById } from "api/admin/product";
import { useState } from "react";
import ActionModal from "../../ActionModal/ActionModal";

import { useRepository } from "api/admin/repostre";
import { Spinner } from "components";
import InputSearch from "components/InputField/InputSearch";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { RiDeleteBin3Line } from "react-icons/ri";
import AddRepo from "./Repo/AddRepo";
import DeleteRepo from "./Repo/DeleteRepo";

export default function ProductRepostre({ isOpen, toggle, productId }) {
  const {
    data: currentProduct,
    isLoading: currentProductIsLoading,
    isSuccess: currentProductIsSuccess,
  } = useProductById(productId);

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="large"
      title={`المستودع الخاص بـ ${
        currentProductIsSuccess ? currentProduct?.data?.products?.name : ""
      }`}
    >
      <M productId={productId} />
    </ActionModal>
  );
}

const M = ({ productId }) => {
  const [currentId, setCurrentId] = useState(undefined);

  const [isOpenAddRepoModal, setIsOpenAddRepoModal] = useState(false);

  const [isOpenDeleteProductModal, setIsOpenDeleteProductModal] =
    useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchValue, setSearchValue] = useState("");

  const {
    data: repo,
    isSuccess: repoIsSuccess,
    isLoading: repoIsLoading,
    isFetching: repoIsFetching,
  } = useRepository(productId, searchValue, limit, pageNumber);

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <button
          className="btn btn-primary w-fit !p-2 !text-xl"
          onClick={() => setIsOpenAddRepoModal(true)}
        >
          <HiOutlineSquaresPlus />
        </button>
        <select
          id="underline_select"
          className="block py-1 px-2 font-bold text-gray-600 dark:text-white cursor-pointer bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => {
            setLimit(e.target.value);
            setPageNumber(1);
          }}
        >
          <option value={10}>10 عناصر</option>
          <option value={25}>25 عنصر</option>
          <option value={50}>50 عنصر</option>
          <option value={75}>75 عنصر</option>
          <option value={100}>100 عنصر</option>{" "}
          <option value={10000000}>الجميع</option>
        </select>

        <InputSearch
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setPageNumber={setPageNumber}
        />
        {repoIsSuccess && repoIsFetching && (
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
                الكود
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                اسم المركز
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                تاريخ الانشاء
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap">
                تاريخ اخر تعديل
              </th>
              <th scope="col" className="px-4 py-2 text-nowrap  max-w-20">
                الادوات
              </th>
            </tr>
          </thead>
          <tbody className="">
            {repoIsSuccess &&
              repo?.data?.repo.map((item, index) => (
                <tr
                  className={`
                          odd:bg-white text-lg_ odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 
                          hover:dark:bg-gray-700 hover:bg-gray-200
                          `}
                  key={index}
                >
                  <td className="px-4 py-2 text-nowrap">{item.id} </td>

                  <td className="px-4 py-2 text-nowrap font-bold">
                    {atob(item.code)}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.center_name}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.created_at}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.updated_at || " - - - "}
                  </td>

                  <td className="p-1">
                    <div className="flex gap-2 justify-center items-center p-1">
                      <button
                        className="btn btn-danger text-xs_ !p-1.5"
                        onClick={() => {
                          setCurrentId(item.id);
                          setIsOpenDeleteProductModal(true);
                        }}
                        title="حذف"
                      >
                        <RiDeleteBin3Line />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {repoIsLoading && (
          <div className="my-4">
            <Spinner />
          </div>
        )}

        {!repoIsLoading && repo?.data?.repo.length === 0 && (
          <div className="w-full text-center p-5 font-semibold bg-gray-200 dark:bg-gray-900 dark:text-white">
            <h1>لا يوجد بيانات</h1>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center my-4 w-full">
        <span className="text-sm text-gray-700 dark:text-gray-400 flex gap-1">
          <span className="font-semibold text-gray-900 dark:text-white">
            {repo?.data?.pagination?.current_page || 0}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            من اصل
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {repo?.data?.pagination?.last_page || 0}
          </span>{" "}
        </span>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setPageNumber((prev) => prev - 1)}
            disabled={pageNumber === 1 || repoIsLoading}
            className="btn btn-info text-sm !p-1 w-20 "
          >
            السابق
          </button>
          <button
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={
              repo?.data?.repo.length === 0 ||
              pageNumber >= repo?.data.pagination?.last_page ||
              repo?.data?.pagination?.total === 0 ||
              repoIsLoading
            }
            className="btn btn-primary text-sm !p-1 w-20 "
          >
            التالي
          </button>
        </div>
      </div>

      {isOpenDeleteProductModal && (
        <DeleteRepo
          isOpen={isOpenDeleteProductModal}
          toggle={setIsOpenDeleteProductModal}
          productId={currentId}
        />
      )}

      {isOpenAddRepoModal && (
        <AddRepo
          isOpen={isOpenAddRepoModal}
          toggle={setIsOpenAddRepoModal}
          productId={productId}
        />
      )}
    </>
  );
};
