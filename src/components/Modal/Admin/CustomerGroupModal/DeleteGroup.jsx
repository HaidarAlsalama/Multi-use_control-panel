import { useCustomerGroup, useDeleteGroup } from "api/admin/customerGroup";
import { Spinner } from "components";
import { useEffect } from "react";
import { TiWarning } from "react-icons/ti";
import ActionModal from "../../ActionModal/ActionModal";

export default function DeleteGroup({ isOpen, toggle, groupId }) {
  const {
    data: currentGroup,
    isLoading: currentGroupIsLoading,
    isError: currentGroupIsError,
  } = useCustomerGroup(groupId);

  const {
    mutate: deleteGroup,
    isPending: deleteGroupIsPending,
    isSuccess: deleteGroupIsSuccess,
  } = useDeleteGroup(currentGroup?.data?.id);

  useEffect(() => {
    if (deleteGroupIsSuccess) {
      toggle(false);
    }
  }, [deleteGroupIsSuccess, toggle]);

  const onSubmit = (e) => {
    e.preventDefault();
    deleteGroup();
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="xSmall"
      title={"حذف تصنيف زبائن"}
    >
      {currentGroupIsLoading ? (
        <Spinner />
      ) : !currentGroupIsError ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <h1 className="mx-auto text-2xl text-gray-800 dark:text-white">
            هل أنت متأكد من حذف التصنيف?{" "}
            <span className="text-red-500">{currentGroup?.data?.name}</span>
          </h1>
          <button
            type="submit"
            className="btn btn-primary mx-auto !py-1 w-20"
            disabled={deleteGroupIsPending}
          >
            {deleteGroupIsPending ? <Spinner sm /> : "حذف"}
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
