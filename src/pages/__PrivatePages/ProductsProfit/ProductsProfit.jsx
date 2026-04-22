import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProductsProfit } from "api/admin/productsProfit";
import { Spinner } from "components";
import { InputFieldZod } from "components/InputField/InputFieldZod";

const filterSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  product_id: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().int().min(1).optional(),
  ),
  category_id: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().int().min(1).optional(),
  ),
});

function formatAmount(num) {
  if (num == null || num === "" || Number.isNaN(Number(num))) return "—";
  return Number(num).toLocaleString("en-US", { maximumFractionDigits: 3 });
}

export default function ProductsProfit() {
  const today = new Date().toISOString().slice(0, 10);

  const [filters, setFilters] = useState({
    from: today,
    to: today,
    product_id: undefined,
    category_id: undefined,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      from: today,
      to: today,
    },
  });

  const { data, isLoading, isError } = useProductsProfit(filters);

  // تجميع الأرباح حسب (مجموعة المشغل × نوع المنتج)
  const summary = (data || []).reduce((acc, row) => {
    const group = row.group_label || "UNKNOWN";
    const type = row.type_label || "OTHER";
    const profit = Number(row.profit) || 0;

    if (!acc[group]) acc[group] = {};
    if (!acc[group][type]) acc[group][type] = 0;
    acc[group][type] += profit;
    return acc;
  }, {});

  const getProfit = (group, type) =>
    formatAmount(summary?.[group]?.[type] || 0);

  const onSubmit = (values) => {
    setFilters({
      from: values.from || "",
      to: values.to || "",
      product_id: values.product_id,
      category_id: values.category_id,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            الأرباح
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            يعرض إجمالي المبيعات، التكلفة (بعد توزيع العمولة على الرصيد)، والربح
            الصافي لكل منتج ضمن الفترة المحددة.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <InputFieldZod
          title="من تاريخ"
          name="from"
          type="date"
          register={register}
          errors={errors}
        />
        <InputFieldZod
          title="إلى تاريخ"
          name="to"
          type="date"
          register={register}
          errors={errors}
        />

        <div className="md:col-span-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
          >
            تحديث التقرير
          </button>
        </div>
      </form>

      {/* كروت تجميعية حسب الأنواع */}
      <div className="flex flex-col gap-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        {/* قسم انترنت */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-700 dark:text-white">
            انترنت
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
            {[
              "زاد",
              "MTN",
              "ليما",
              "MTS",
              "HiFi",
              "فيو",
              "رنت",
              "سما",
              "بطاقات",
              "هايبر",
              "دنيا",
              "تكامل",
              "برونت",
              "لاينت",
              "يارا",
              "امواج",
              "ليزر",
              "اينت",
              "جمعية",
              "الكوم",
              "ناس",
              "سوا",
              "امنية",
              "اية",
            ].map((name) => (
              <button
                key={name}
                type="button"
                className="flex items-center justify-between gap-3 bg-white dark:bg-gray-900 shadow rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {name}
                </span>
                <span
                  dir="ltr"
                  className="font-mono font-bold text-sm whitespace-nowrap min-w-[80px] text-right text-gray-500"
                >
                  {getProfit("انترنت", name)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* مفرق / جملة MTN / SYRIATEL */}
        {[
          { title: "مفرق MTN", key: "مفرق MTN" },
          { title: "مفرق SYRIATEL", key: "مفرق SYRIATEL" },
          { title: "جملة MTN", key: "جملة MTN" },
          { title: "جملة SYRIATEL", key: "جملة SYRIATEL" },
        ].map((group) => (
          <div key={group.key} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-700 dark:text-white">
              {group.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["رصيد", "فواتير", "كاش"].map((type) => (
                <button
                  key={type}
                  type="button"
                  className="flex items-center justify-between gap-3 bg-white dark:bg-gray-900 shadow rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {type}
                  </span>
                  <span
                    dir="ltr"
                    className="font-mono font-bold text-sm whitespace-nowrap min-w-[80px] text-right text-gray-500"
                  >
                    {getProfit(group.key, type)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* رصيد بنوك */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-700 dark:text-white">
            رصيد بنوك
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
            {["شام كاش"].map((name) => (
              <button
                key={name}
                type="button"
                className="flex items-center justify-between gap-3 bg-white dark:bg-gray-900 shadow rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {name}
                </span>
                <span
                  dir="ltr"
                  className="font-mono font-bold text-sm whitespace-nowrap min-w-[80px] text-right text-gray-500"
                >
                  {getProfit("رصيد بنوك", name)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
        <div className="px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            قائمة المنتجات
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner />
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500 dark:text-red-400">
            حدث خطأ أثناء جلب البيانات
          </div>
        ) : !data?.length ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            لا توجد بيانات ضمن المعايير المحددة
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  <th className="px-4 py-3 font-medium">المنتج</th>
                  <th className="px-4 py-3 font-medium">عدد الطلبات</th>
                  <th className="px-4 py-3 font-medium">إجمالي المبيعات</th>
                  <th className="px-4 py-3 font-medium">إجمالي التكلفة</th>
                  <th className="px-4 py-3 font-medium">الربح الصافي</th>
                  <th className="px-4 py-3 font-medium">هامش الربح %</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr
                    key={row.product_id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                  >
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {row.product_name}
                        </span>
                        {row.product_name_en && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {row.product_name_en}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      {row.orders_count}
                    </td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">
                      {formatAmount(row.total_revenue)} ل.س
                    </td>
                    <td className="px-4 py-3 text-yellow-600 dark:text-yellow-400 font-semibold">
                      {formatAmount(row.total_cost)} ل.س
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        row.profit >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatAmount(row.profit)} ل.س
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      {row.profit_margin != null
                        ? `${formatAmount(row.profit_margin)} %`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
