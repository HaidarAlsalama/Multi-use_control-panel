import { useDeleteUser, useUserById } from "api/admin/user";
import { Spinner } from "components";
import { useEffect } from "react";
import { TiWarning } from "react-icons/ti";
import ActionModal from "../../ActionModal/ActionModal";

export default function DeleteUser({ isOpen, toggle, userId }) {
  const {
    data: currentUser,
    // isSuccess: currentUserIsSuccess,
    isLoading: currentUserIsLoading,
    isError: currentUserIsError,
  } = useUserById(userId);

  const {
    mutate: deleteUser,
    isPending: deleteUserIsPending,
    isSuccess: deleteUserIsSuccess,
  } = useDeleteUser(currentUser?.data?.id);

  useEffect(() => {
    if (deleteUserIsSuccess) {
      toggle(false);
    }
  }, [deleteUserIsSuccess, toggle]);

  const onSubmit = (e) => {
    e.preventDefault();
    deleteUser();
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="xSmall"
      title={"حذف مستخدم"}
    >
      {currentUserIsLoading ? (
        <Spinner />
      ) : !currentUserIsError ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <h1 className="mx-auto text-2xl text-gray-800 dark:text-white">
            هل أنت متأكد من حذف المستخدم?{" "}
            <span className="text-red-500">{currentUser?.data?.name}</span>
          </h1>
          <button
            type="submit"
            className="btn btn-primary mx-auto !py-1 w-20"
            disabled={deleteUserIsPending}
          >
            {deleteUserIsPending ? <Spinner sm /> : "حذف"}
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
