import { Spinner } from "components";
import { useEffect } from "react";
import { TiWarning } from "react-icons/ti";
import ActionModal from "../../ActionModal/ActionModal";
import { useCustomerById, useDeleteCustomer } from "api/admin/customer";

export default function DeleteCustomer({ isOpen, toggle, customerId }) {
  const {
    data: currentCustomer,
    // isSuccess: currentCustomerIsSuccess,
    isLoading: currentCustomerIsLoading,
    isError: currentCustomerIsError,
  } = useCustomerById(customerId);

  const {
    mutate: deleteCustomer,
    isPending: deleteCustomerIsPending,
    isSuccess: deleteCustomerIsSuccess,
  } = useDeleteCustomer(customerId);

  useEffect(() => {
    if (deleteCustomerIsSuccess) {
      toggle(false);
    }
  }, [deleteCustomerIsSuccess, toggle]);

  const onSubmit = (e) => {
    e.preventDefault();
    deleteCustomer();
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="xSmall" title={"حذف زبون"}>
      {currentCustomerIsLoading ? (
        <Spinner />
      ) : !currentCustomerIsError ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <h1 className="mx-auto text-xl text-gray-800 dark:text-white">
            هل أنت متأكد من حذف الزبون؟
            <br />
            <span className="text-red-500">
              {currentCustomer.data.user.name}
            </span>
          </h1>
          <button
            type="submit"
            className="btn btn-primary mx-auto !py-1 w-20"
            disabled={deleteCustomerIsPending}
          >
            {deleteCustomerIsPending ? <Spinner sm /> : "حذف"}
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
