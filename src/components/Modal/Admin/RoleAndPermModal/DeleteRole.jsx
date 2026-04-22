import { useDeleteRole, useRole } from "api/admin/roleAndPerm";
import { Spinner } from "components";
import { useEffect } from "react";
import { TiWarning } from "react-icons/ti";
import ActionModal from "../../ActionModal/ActionModal";

export default function DeleteRole({ isOpen, toggle, roleId }) {
  const {
    data: currentRole,
    isLoading: roleIsLoading,
    isError: roleIsError,
  } = useRole(roleId);

  const {
    mutate: deleteCategory,
    isPending: deleteCategoryIsPending,
    isSuccess: deleteCategoryIsSuccess,
  } = useDeleteRole(currentRole?.data?.id);

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
    <ActionModal open={isOpen} close={toggle} size="xSmall" title={"حذف دور"}>
      {roleIsLoading ? (
        <Spinner />
      ) : !roleIsError ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <h1 className="mx-auto text-2xl text-gray-800 dark:text-white">
            هل أنت متأكد من حذف الدور?{" "}
            <span className="text-red-500">{currentRole?.data?.name}</span>
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
