import Guard from "components/PrivateLayoutPages/Guard/Guard";
import { useState } from "react";

import { useAds } from "api/admin/ads";
import { Spinner } from "components";
import ToggleStateButton from "components/Buttons/ToggleStateButton";
import InputSearch from "components/InputField/InputSearch";
import AddAds from "components/Modal/Admin/AdsModal/AddAds";
import DeleteAds from "components/Modal/Admin/AdsModal/DeleteAds";
import EditAds from "components/Modal/Admin/AdsModal/EditAds";
import { GrEdit } from "react-icons/gr";
import { MdOutlineAddAlert } from "react-icons/md";
import { RiDeleteBin3Line } from "react-icons/ri";

export default function Ads() {
  const [isOpenAddCatModal, setIsOpenAddCatModal] = useState(false);
  const [isOpenEditCatModal, setIsOpenEditCatModal] = useState(false);
  const [isOpenDeleteCatModal, setIsOpenDeleteCatModal] = useState(false);

  const [currentId, setCurrentId] = useState(undefined);

  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchValue, setSearchValue] = useState("");

  const {
    data: ads,
    isSuccess: adsIsSuccess,
    isLoading: adsIsLoading,
    isFetching: adsIsFetching,
  } = useAds(searchValue, limit, pageNumber);

  return (
    <div className="flex flex-col gap-6 p-4 justify-between bg-gray-50 dark:bg-gray-800 h-full rounded-lg">
      <div className="flex flex-wrap gap-4">
        <Guard permission={"create_advertisements"}>
          <button
            className="btn btn-primary w-fit !p-2 !text-xl"
            onClick={() => setIsOpenAddCatModal(true)}
            title="اضافة اعلان"
          >
            <MdOutlineAddAlert />
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
        {adsIsSuccess && adsIsFetching && (
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
                العنوان
              </th>

              <th scope="col" className="px-4 py-2 text-nowrap  max-w-20">
                الادوات
              </th>
            </tr>
          </thead>
          <tbody className="">
            {adsIsSuccess &&
              ads?.data?.ads.map((item, index) => (
                <tr
                  className={`
                        odd:bg-white text-lg_ odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 
                        hover:dark:bg-gray-700 hover:bg-gray-200
                        `}
                  key={index}
                >
                  <td className="px-4 py-2 text-nowrap">{item.id} </td>

                  <td className="px-4 py-2 text-nowrap font-bold">
                    {item.title}
                  </td>

                  <td className="p-1">
                    <div className="flex gap-2 justify-center items-center p-1">
                      <Guard permission={"edit_advertisements"}>
                        <ToggleStateButton
                          type={"advertisement"}
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

                      <Guard permission={"delete_advertisements"}>
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

        {adsIsLoading && (
          <div className="my-4">
            <Spinner />
          </div>
        )}

        {!adsIsLoading && ads?.data?.ads.length === 0 && (
          <div className="w-full text-center p-5 font-semibold bg-gray-200 dark:bg-gray-900 dark:text-white">
            <h1>لا يوجد بيانات</h1>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center my-4 w-full">
        <span className="text-sm text-gray-700 dark:text-gray-400 flex gap-1">
          <span className="font-semibold text-gray-900 dark:text-white">
            {ads?.data?.pagination?.current_page || 0}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            من اصل
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {ads?.data?.pagination?.last_page || 0}
          </span>{" "}
        </span>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setPageNumber((prev) => prev - 1)}
            disabled={pageNumber === 1 || adsIsLoading}
            className="btn btn-info text-sm !p-1 w-20 "
          >
            السابق
          </button>
          <button
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={
              ads?.data?.ads.length === 0 ||
              pageNumber >= ads?.data.pagination?.last_page ||
              ads?.data?.pagination?.total === 0 ||
              adsIsLoading
            }
            className="btn btn-primary text-sm !p-1 w-20 "
          >
            التالي
          </button>
        </div>
      </div>

      <Guard permission={"create_advertisements"}>
        {isOpenAddCatModal && (
          <AddAds isOpen={isOpenAddCatModal} toggle={setIsOpenAddCatModal} />
        )}
      </Guard>
      <Guard permission={"edit_advertisements"}>
        {isOpenEditCatModal && (
          <EditAds
            isOpen={isOpenEditCatModal}
            toggle={setIsOpenEditCatModal}
            adsId={currentId}
          />
        )}
      </Guard>
      <Guard permission={"delete_advertisements"}>
        {isOpenDeleteCatModal && (
          <DeleteAds
            isOpen={isOpenDeleteCatModal}
            toggle={setIsOpenDeleteCatModal}
            adsId={currentId}
          />
        )}
      </Guard>
    </div>
  );
}
