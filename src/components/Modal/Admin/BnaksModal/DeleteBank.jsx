import { useCategoryById, useDeleteCategory } from "api/admin/category";
import { Spinner } from "components";
import { useEffect } from "react";
import { TiWarning } from "react-icons/ti";
import ActionModal from "../../ActionModal/ActionModal";
import { useBankById, useDeleteBank } from "api/admin/bank";

export default function DeleteBank({ isOpen, toggle, bankId }) {
  const {
    data: currentBank,
    isLoading: currentBankIsLoading,
    isError: currentBankIsError,
  } = useBankById(bankId);

  const {
    mutate: deleteBank,
    isPending: deleteBankIsPending,
    isSuccess: deleteBankIsSuccess,
  } = useDeleteBank(currentBank?.data?.banks.id);

  useEffect(() => {
    if (deleteBankIsSuccess) {
      toggle(false);
    }
  }, [deleteBankIsSuccess, toggle]);

  const onSubmit = (e) => {
    e.preventDefault();
    deleteBank();
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="xSmall" title={"حذف بنك"}>
      {currentBankIsLoading ? (
        <Spinner />
      ) : !currentBankIsError ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <h1 className="mx-auto text-2xl text-gray-800 dark:text-white">
            هل أنت متأكد من حذف البنك؟
            <br />
            <span className="text-red-500">
              {currentBank?.data?.banks.name}
            </span>
          </h1>
          <button
            type="submit"
            className="btn btn-primary mx-auto !py-1 w-20"
            disabled={deleteBankIsPending}
          >
            {deleteBankIsPending ? <Spinner sm /> : "حذف"}
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
