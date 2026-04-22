import { useDeleteRepo } from "api/admin/repostre";
import { Spinner } from "components";
import ActionModal from "components/Modal/ActionModal/ActionModal";
import { useEffect } from "react";

export default function DeleteRepo({ isOpen, toggle, productId }) {
  const {
    mutate: deleteProduct,
    isPending: deleteProductIsPending,
    isSuccess: deleteProductIsSuccess,
  } = useDeleteRepo(productId);

  useEffect(() => {
    if (deleteProductIsSuccess) {
      toggle(false);
    }
  }, [deleteProductIsSuccess, toggle]);

  const onSubmit = (e) => {
    e.preventDefault();
    deleteProduct();
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="xSmall" title={"حذف منتج"}>
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="mx-auto text-2xl text-gray-800 dark:text-white">
          هل أنت متأكد من حذف الكود
          <br />
        </h1>
        <button
          type="submit"
          className="btn btn-primary mx-auto !py-1 w-20"
          disabled={deleteProductIsPending}
        >
          {deleteProductIsPending ? <Spinner sm /> : "حذف"}
        </button>
      </form>
    </ActionModal>
  );
}
