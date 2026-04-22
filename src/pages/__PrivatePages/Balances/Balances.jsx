import { useBalances } from "api/admin/supplier";
import { Spinner } from "components";
import { useNavigate } from "react-router-dom";

export default function BalancesPage() {
  const { data, isLoading, isSuccess } = useBalances();
  const navigate = useNavigate();

  const openLedger = (type, id) => {
    navigate(`/admin/ledger?type=${type}&id=${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );
  }

  const order = ["رصيد", "فواتير", "كاش"];

  const groupedProducts = data?.products
    ? data.products.reduce((acc, product) => {
        const key = product.category_name;

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(product);

        return acc;
      }, {})
    : {};

  Object.keys(groupedProducts).forEach((key) => {
    groupedProducts[key].sort(
      (a, b) => order.indexOf(a.name) - order.indexOf(b.name),
    );
  });

  const balanceColor = (balance) =>
    balance > 0
      ? "text-green-600"
      : balance < 0
        ? "text-red-600"
        : "text-gray-500";

  return (
    <div className="flex flex-col gap-8 p-6 bg-gray-50 dark:bg-gray-800 min-h-full rounded-xl">
      {/* الموردين */}
      {isSuccess && data?.suppliers?.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-700 dark:text-white">
            الموردين
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.suppliers.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openLedger("supplier", item.id)}
                className="flex items-center justify-between gap-3 bg-white dark:bg-gray-900 shadow rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {item.name}
                </span>

                <span
                  dir="ltr"
                  className={`font-mono font-bold whitespace-nowrap min-w-[90px] text-right ${balanceColor(
                    item.balance,
                  )}`}
                >
                  {item.balance}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* الصناديق */}
      {isSuccess && data?.cashboxes?.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-700 dark:text-white">
            الصناديق
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.cashboxes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openLedger("cashbox", item.id)}
                className="flex items-center justify-between gap-3 bg-white dark:bg-gray-900 shadow rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {item.name}
                </span>

                <span
                  dir="ltr"
                  className={`font-mono font-bold whitespace-nowrap min-w-[90px] text-right ${balanceColor(
                    item.balance,
                  )}`}
                >
                  {item.balance}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* التصنيفات */}
      {isSuccess &&
        data?.categories?.map((category) => (
          <div key={category.parent_id} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-700 dark:text-white">
              {category.parent_name}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {category.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openLedger("category", item.id)}
                  className="flex items-center justify-between gap-3 bg-white dark:bg-gray-900 shadow rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {item.name}
                  </span>

                  <span
                    dir="ltr"
                    className={`font-mono font-bold text-sm whitespace-nowrap min-w-[80px] text-right ${balanceColor(
                      item.balance,
                    )}`}
                  >
                    {item.balance}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

      {/* المنتجات */}
      {isSuccess &&
        groupedProducts &&
        Object.entries(groupedProducts).map(([categoryName, products]) => (
          <div key={categoryName} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-700 dark:text-white">
              {categoryName}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {products.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openLedger("product", item.id)}
                  className="flex items-center justify-between gap-3 bg-white dark:bg-gray-900 shadow rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {item.name}
                  </span>

                  <span
                    dir="ltr"
                    className={`font-mono font-bold text-sm whitespace-nowrap min-w-[80px] text-right ${balanceColor(
                      item.balance,
                    )}`}
                  >
                    {item.balance}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
