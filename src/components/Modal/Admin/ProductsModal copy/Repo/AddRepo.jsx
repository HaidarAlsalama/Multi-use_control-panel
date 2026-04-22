import { useAddRepo } from "api/admin/repostre";
import { Spinner } from "components";
import ActionModal from "components/Modal/ActionModal/ActionModal";
import { useEffect } from "react";

export default function AddRepo({ isOpen, toggle, productId }) {
  const {
    mutate: addProduct,
    isPending: addProductIsPending,
    isSuccess: addProductIsSuccess,
  } = useAddRepo(productId);

  useEffect(() => {
    if (addProductIsSuccess) {
      toggle(false);
    }
  }, [addProductIsSuccess, addProductIsPending]);

  const onSubmit = (e) => {
    e.preventDefault();

    // اجلب النص من textarea
    const cods = e.target.cods.value;

    // تحويل كل سطر إلى عنصر في مصفوفة
    const arr = cods
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // تحويل كل عنصر إلى Base64
    const encoded = arr.map((code) => btoa(code));

    // إرسال للباك إند
    addProduct({ codes: encoded });
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="medium" title={"اضافة كود"}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="h-auto relative">
          <label
            htmlFor="cods"
            className="text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            الاكواد
          </label>

          <span className="text-red-600 font-bold dark:text-green-600">*</span>

          <textarea
            id="cods"
            name="cods"
            rows={20}
            placeholder="ضع الاكواد هنا ... كل كود في سطر"
            className="block w-full px-4 py-1 mt-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring disabled:bg-gray-200 placeholder:text-sm resize-none"
          ></textarea>
        </div>

        <button
          disabled={addProductIsPending}
          type="submit"
          className="btn btn-primary mx-auto !py-1 w-20"
        >
          {addProductIsPending ? <Spinner sm /> : "حفظ"}
        </button>
      </form>
    </ActionModal>
  );
}
