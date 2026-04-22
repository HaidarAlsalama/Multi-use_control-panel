import { useDeleteProduct, useProductById } from "api/admin/product";
import { Spinner } from "components";
import { useEffect } from "react";
import { TiWarning } from "react-icons/ti";
import ActionModal from "../../ActionModal/ActionModal";

export default function DeleteProduct({ isOpen, toggle, productId }) {
  const {
    data: currentProduct,
    isLoading: currentProductIsLoading,
    isError: currentProductIsError,
  } = useProductById(productId);

  const {
    mutate: deleteProduct,
    isPending: deleteProductIsPending,
    isSuccess: deleteProductIsSuccess,
  } = useDeleteProduct(currentProduct?.data?.products?.id);

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
      {currentProductIsLoading ? (
        <Spinner />
      ) : !currentProductIsError ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <h1 className="mx-auto text-2xl text-gray-800 dark:text-white">
            هل أنت متأكد من حذف المنتج؟
            <br />
            <span className="text-red-500">
              {currentProduct?.data?.products?.name}
            </span>
          </h1>
          <button
            type="submit"
            className="btn btn-primary mx-auto !py-1 w-20"
            disabled={deleteProductIsPending}
          >
            {deleteProductIsPending ? <Spinner sm /> : "حذف"}
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
