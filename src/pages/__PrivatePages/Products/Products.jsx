import Guard from "components/PrivateLayoutPages/Guard/Guard";
import { image_host } from "config/api_host";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useProducts } from "api/admin/product";
import { Spinner } from "components";
import ToggleStateButton from "components/Buttons/ToggleStateButton";
import InputSearch from "components/InputField/InputSearch";
import AddProduct from "components/Modal/Admin/ProductsModal copy/AddProduct";
import DeleteProduct from "components/Modal/Admin/ProductsModal copy/DeleteProduct";
import useParam from "Hooks/useParam";
import { GrEdit } from "react-icons/gr";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { RiDeleteBin3Line, RiUserSettingsLine } from "react-icons/ri";
import EditProduct from "components/Modal/Admin/ProductsModal copy/EditProduct";
import CustomerPermissions from "components/Modal/Admin/ProductsModal copy/CustomerPermissions";
import { TbArrowsMoveVertical, TbUserShield } from "react-icons/tb";
import OrderProducts from "components/Modal/Admin/ProductsModal copy/OrderProducts";
import GroupPermissions from "components/Modal/Admin/ProductsModal copy/GroupPermissions";
import { FaDropbox } from "react-icons/fa6";
import ProductRepostre from "components/Modal/Admin/ProductsModal copy/ProductRepostre";

export default function Products() {
  const categoryId = useParam("categoryId");
  const [isOpenAddProductModal, setIsOpenAddProductModal] = useState(false);
  const [isOpenEditCatModal, setIsOpenEditCatModal] = useState(false);
  const [isOpenOrderCatModal, setIsOpenOrderCatModal] = useState(false);

  const [isOpenDeleteProductModal, setIsOpenDeleteProductModal] =
    useState(false);
  const [isOpenCustomerPermissionsModal, setIsOpenCustomerPermissionsModal] =
    useState(false);
  const [isOpenGroupPermissionsModal, setIsOpenGroupPermissionsModal] =
    useState(false);
  const [isOpenRepostreModal, setIsOpenRepostreModal] = useState(false);

  const [currentId, setCurrentId] = useState(undefined);

  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchValue, setSearchValue] = useState("");

  const {
    data: products,
    isSuccess: productsIsSuccess,
    isLoading: productsIsLoading,
    isFetching: productsIsFetching,
    // isError: productsIsError,
  } = useProducts(categoryId, searchValue, limit, pageNumber);

  // useEffect(() => {
  //   if (categoryId) setSearchValue("");
  // }, [categoryId]);

  return (
    <div className="flex flex-col gap-6 p-4 justify-between bg-gray-50 dark:bg-gray-800 h-full rounded-lg">
      <div className="flex flex-wrap gap-4">
        <Guard permission={"create_products"}>
          <button
            className="btn btn-primary w-fit !p-2 !text-xl"
            onClick={() => setIsOpenAddProductModal(true)}
          >
            <HiOutlineSquaresPlus />
          </button>
        </Guard>
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
        <button
          className="btn btn-info w-fit !p-2 !text-xl"
          title="تريتيب"
          disabled={!!!categoryId}
          onClick={() => setIsOpenOrderCatModal(true)}
        >
          <TbArrowsMoveVertical />
        </button>
        <InputSearch
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setPageNumber={setPageNumber}
        />
        {productsIsSuccess && productsIsFetching && (
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
                التصنيف
              </th>

              <th scope="col" className="px-4 py-2 text-nowrap  max-w-20">
                الادوات
              </th>
            </tr>
          </thead>
          <tbody className="">
            {productsIsSuccess &&
              products?.data?.products.map((item, index) => (
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
                        className=" mx-auto rounded-xl"
                        alt=""
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.name}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-bold">
                    <Link
                      className="text-blue-500 hover:underline"
                      to={`/dashboard/products?categoryId=${item.category.id}`}
                      title="عرض جميع المنتجات لهذا التصنيف"
                    >
                      {item.category.fullPath}
                    </Link>
                  </td>

                  <td className="p-1">
                    <div className="flex gap-2 justify-center items-center p-1">
                      <Guard permission={"edit_products"}>
                        <ToggleStateButton
                          type={"products"}
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
                      <Guard permission={"delete_products"}>
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
                      </Guard>

                      {!!item.repositry_state && (
                        <button
                          className="btn btn-success text-xs_ !p-1.5"
                          onClick={() => {
                            setCurrentId(item.id);
                            setIsOpenRepostreModal(true);
                          }}
                          title="المستودع"
                        >
                          <FaDropbox />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {productsIsLoading && (
          <div className="my-4">
            <Spinner />
          </div>
        )}

        {!productsIsLoading && products?.data?.products.length === 0 && (
          <div className="w-full text-center p-5 font-semibold bg-gray-200 dark:bg-gray-900 dark:text-white">
            <h1>لا يوجد بيانات</h1>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center my-4 w-full">
        <span className="text-sm text-gray-700 dark:text-gray-400 flex gap-1">
          <span className="font-semibold text-gray-900 dark:text-white">
            {products?.data?.pagination?.current_page || 0}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            من اصل
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {products?.data?.pagination?.last_page || 0}
          </span>{" "}
        </span>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setPageNumber((prev) => prev - 1)}
            disabled={pageNumber === 1 || productsIsLoading}
            className="btn btn-info text-sm !p-1 w-20 "
          >
            السابق
          </button>
          <button
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={
              products?.data?.products.length === 0 ||
              pageNumber >= products?.data.pagination?.last_page ||
              products?.data?.pagination?.total === 0 ||
              productsIsLoading
            }
            className="btn btn-primary text-sm !p-1 w-20 "
          >
            التالي
          </button>
        </div>
      </div>

      <Guard permission={"create_products"}>
        {isOpenAddProductModal && (
          <AddProduct
            isOpen={isOpenAddProductModal}
            toggle={setIsOpenAddProductModal}
            parentId={categoryId}
          />
        )}
      </Guard>
      <Guard permission={"create_products"}>
        {isOpenRepostreModal && (
          <ProductRepostre
            isOpen={isOpenRepostreModal}
            toggle={setIsOpenRepostreModal}
            productId={currentId}
          />
        )}
      </Guard>
      <Guard permission={"edit_products"}>
        {isOpenEditCatModal && (
          <EditProduct
            isOpen={isOpenEditCatModal}
            toggle={setIsOpenEditCatModal}
            productId={currentId}
          />
        )}
        {isOpenCustomerPermissionsModal && (
          <CustomerPermissions
            isOpen={isOpenCustomerPermissionsModal}
            toggle={setIsOpenCustomerPermissionsModal}
            productId={currentId}
          />
        )}
        {isOpenGroupPermissionsModal && (
          <GroupPermissions
            isOpen={isOpenGroupPermissionsModal}
            toggle={setIsOpenGroupPermissionsModal}
            categoryId={currentId}
            _TYPE={"products"}
          />
        )}
      </Guard>
      <Guard permission={"delete_products"}>
        {isOpenDeleteProductModal && (
          <DeleteProduct
            isOpen={isOpenDeleteProductModal}
            toggle={setIsOpenDeleteProductModal}
            productId={currentId}
          />
        )}
      </Guard>

      {isOpenOrderCatModal && (
        <OrderProducts
          isOpen={isOpenOrderCatModal}
          toggle={setIsOpenOrderCatModal}
          idCategory={categoryId}
        />
      )}
    </div>
  );
}
