import { useCategories } from "api/admin/category";
import Guard from "components/PrivateLayoutPages/Guard/Guard";
import { image_host } from "config/api_host";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Spinner } from "components";
import ToggleStateButton from "components/Buttons/ToggleStateButton";
import InputSearch from "components/InputField/InputSearch";
import AddCategory from "components/Modal/Admin/CategoriesModal/AddCategory";
import DeleteCategory from "components/Modal/Admin/CategoriesModal/DeleteCategory";
import EditCategory from "components/Modal/Admin/CategoriesModal/EditCategory";
import OrderCategories from "components/Modal/Admin/CategoriesModal/OrderCategories";
import CustomerPermissions from "components/Modal/Admin/CustomersModal/CustomerPermissions";
import GroupPermissions from "components/Modal/Admin/CustomersModal/GroupPermissions";
import useParam from "Hooks/useParam";
import { GrArchive, GrEdit } from "react-icons/gr";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { RiDeleteBin3Line, RiUserSettingsLine } from "react-icons/ri";
import { TbArrowsMoveVertical, TbUserShield } from "react-icons/tb";

export default function Categories() {
  const parentId = useParam("parentId");
  const [isOpenAddCatModal, setIsOpenAddCatModal] = useState(false);
  const [isOpenEditCatModal, setIsOpenEditCatModal] = useState(false);
  const [isOpenDeleteCatModal, setIsOpenDeleteCatModal] = useState(false);
  const [isOpenOrderCatModal, setIsOpenOrderCatModal] = useState(false);
  const [isOpenCustomerPermissionsModal, setIsOpenCustomerPermissionsModal] =
    useState(false);
  const [isOpenGroupPermissionsModal, setIsOpenGroupPermissionsModal] =
    useState(false);

  const [currentId, setCurrentId] = useState(undefined);

  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchValue, setSearchValue] = useState("");

  const {
    data: categories,
    isSuccess: categoriesIsSuccess,
    isLoading: categoriesIsLoading,
    isFetching: categoriesIsFetching,
    // isError: categoriesIsError,
  } = useCategories(parentId, searchValue, limit, pageNumber);

  useEffect(() => {
    if (parentId) {
      setSearchValue("");
      setPageNumber(1);
    }
  }, [parentId]);

  return (
    <div className="flex flex-col gap-6 p-4 justify-between bg-gray-50 dark:bg-gray-800 h-full rounded-lg">
      <div className="flex flex-wrap gap-4">
        {/* <Guard permission={"create_category"}>
          <button
            className="btn btn-primary w-fit !p-2 !text-xl"
            title="اضافة"
            onClick={() => setIsOpenAddCatModal(true)}
          >
            <HiOutlineSquaresPlus />
          </button>
        </Guard> */}
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
        <button
          className="btn btn-info w-fit !p-2 !text-xl"
          title="تريتيب"
          onClick={() => setIsOpenOrderCatModal(true)}
        >
          <TbArrowsMoveVertical />
        </button>
        <InputSearch
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setPageNumber={setPageNumber}
        />
        {categoriesIsSuccess && categoriesIsFetching && (
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

              <th scope="col" className="px-4 py-2 text-nowrap  max-w-20">
                الادوات
              </th>
            </tr>
          </thead>
          <tbody className="">
            {categoriesIsSuccess &&
              categories?.data?.categories.map((item, index) => (
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
                        src={`${image_host}${item.image}`}
                        className=" mx-auto rounded-lg"
                        alt=""
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.hasChildren ? (
                      <Link
                        className="text-blue-500 hover:underline"
                        to={`/dashboard/categories?parentId=${item.id}`}
                        title="Show SubCategories"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      item.name
                    )}
                  </td>

                  <td className="p-1">
                    <div className="flex gap-2 justify-center items-center p-1">
                      {item.parentId && !item.hasChildren && (
                        <Link
                          to={"/dashboard/products?categoryId=" + item.id}
                          className="btn btn-primary text-xs_ !p-1.5"
                          title="عرض المنتجات"
                        >
                          <GrArchive />
                        </Link>
                      )}
                      <Guard permission={"update_category"}>
                        <ToggleStateButton
                          type={"categories"}
                          currentState={item.state}
                          id={item.id}
                        />
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
                      {/* <button
                        className="btn btn-dark text-xs_ !p-1.5"
                        onClick={() => {
                          setCurrentId(item.id);
                          setIsOpenGroupPermissionsModal(true);
                        }}
                        title="صلاحيات مجموعات الزبائن"
                      >
                        <TbUserShield />
                      </button> */}
                      <Guard permission={"delete_category"}>
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

        {categoriesIsLoading && (
          <div className="my-4">
            <Spinner />
          </div>
        )}

        {!categoriesIsLoading && categories?.data?.categories.length === 0 && (
          <div className="w-full text-center p-5 font-semibold bg-gray-200 dark:bg-gray-900 dark:text-white">
            <h1>لا يوجد بيانات</h1>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center my-4 w-full">
        <span className="text-sm text-gray-700 dark:text-gray-400 flex gap-1">
          <span className="font-semibold text-gray-900 dark:text-white">
            {categories?.data?.pagination?.current_page || 0}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            من اصل
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {categories?.data?.pagination?.last_page || 0}
          </span>{" "}
        </span>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setPageNumber((prev) => prev - 1)}
            disabled={pageNumber === 1 || categoriesIsLoading}
            className="btn btn-info text-sm !p-1 w-20 "
          >
            السابق
          </button>
          <button
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={
              categories?.data?.categories.length === 0 ||
              pageNumber >= categories?.data.pagination?.last_page ||
              categories?.data?.pagination?.total === 0 ||
              categoriesIsLoading
            }
            className="btn btn-primary text-sm !p-1 w-20 "
          >
            التالي
          </button>
        </div>
      </div>

      <Guard permission={"create_category"}>
        {isOpenAddCatModal && (
          <AddCategory
            isOpen={isOpenAddCatModal}
            toggle={setIsOpenAddCatModal}
            parentId={parentId}
          />
        )}
      </Guard>
      <Guard permission={"update_category"}>
        {isOpenEditCatModal && (
          <EditCategory
            isOpen={isOpenEditCatModal}
            toggle={setIsOpenEditCatModal}
            idCategory={currentId}
          />
        )}
        {isOpenCustomerPermissionsModal && (
          <CustomerPermissions
            isOpen={isOpenCustomerPermissionsModal}
            toggle={setIsOpenCustomerPermissionsModal}
            categoryId={currentId}
            _TYPE={"category"}
          />
        )}
        {isOpenGroupPermissionsModal && (
          <GroupPermissions
            isOpen={isOpenGroupPermissionsModal}
            toggle={setIsOpenGroupPermissionsModal}
            categoryId={currentId}
            _TYPE={"category"}
          />
        )}
      </Guard>
      <Guard permission={"delete_category"}>
        {isOpenDeleteCatModal && (
          <DeleteCategory
            isOpen={isOpenDeleteCatModal}
            toggle={setIsOpenDeleteCatModal}
            idCategory={currentId}
          />
        )}
      </Guard>

      {isOpenOrderCatModal && (
        <OrderCategories
          isOpen={isOpenOrderCatModal}
          toggle={setIsOpenOrderCatModal}
          idCategory={parentId}
        />
      )}

      {/* {categoriesIsSuccess && (
        <ProductTable products={categories?.data?.categories} />
      )} */}
    </div>
  );
}
