import { useCategoryById, useDeleteCategory } from "api/admin/category";
import { Spinner } from "components";
import { useEffect } from "react";
import { TiWarning } from "react-icons/ti";
import ActionModal from "../../ActionModal/ActionModal";

export default function DeleteCategory({ isOpen, toggle, idCategory }) {
  const {
    data: currentCategory,
    isSuccess: currentCategoryIsSuccess,
    isLoading: currentCategoryIsLoading,
    isError: currentCategoryIsError,
  } = useCategoryById(idCategory);

  const {
    mutate: deleteCategory,
    isPending: deleteCategoryIsPending,
    isSuccess: deleteCategoryIsSuccess,
  } = useDeleteCategory(currentCategory?.data?.id);

  useEffect(() => {
    if (deleteCategoryIsSuccess) {
      toggle(false);
    }
  }, [deleteCategoryIsSuccess, toggle]);

  const onSubmit = (e) => {
    e.preventDefault();
    deleteCategory();
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="xSmall" title={"حذف تصنيف"}>
      {currentCategoryIsLoading ? (
        <Spinner />
      ) : !currentCategoryIsError ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <h1 className="mx-auto text-2xl text-gray-800 dark:text-white">
            هل أنت متأكد من حذف التصنيف؟
            <br />
            <span className="text-red-500">{currentCategory?.data?.name}</span>
          </h1>
          <button
            type="submit"
            className="btn btn-primary mx-auto !py-1 w-20"
            disabled={deleteCategoryIsPending}
          >
            {deleteCategoryIsPending ? <Spinner sm /> : "حذف"}
          </button>
        </form>
      ) : (
        <div className="w-full text-7xl text-yellow-500 flex justify-center">
          <TiWarning />
        </div>
      )}
    </ActionModal>
  );
}
