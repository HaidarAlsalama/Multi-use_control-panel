import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLedger, useAddFundsToLedgerEntity } from "api/admin/ledger";
import { useBalances } from "api/admin/supplier";
import { Spinner } from "components";
import ActionModal from "components/Modal/ActionModal/ActionModal";
import { InputFieldZod } from "components/InputField/InputFieldZod";

const TYPE_LABELS = {
  supplier: "مورد",
  cashbox: "صندوق",
  category: "تصنيف",
  product: "منتج",
};

/** مبالغ بأرقام إنجليزية مع فاصلة آلاف */
function formatAmount(num) {
  if (num == null || num === "" || Number.isNaN(Number(num))) return "—";
  return Number(num).toLocaleString("en-US", { maximumFractionDigits: 3 });
}

function formatOrderTooltip(order) {
  if (!order) return "";
  const parts = [];
  if (order.id != null) parts.push(`طلب #${order.id}`);
  if (order.state) parts.push(`الحالة: ${order.state}`);
  if (order.total != null)
    parts.push(`الإجمالي: ${formatAmount(order.total)} ل.س`);
  if (order.quantity != null)
    parts.push(`الكمية: ${formatAmount(order.quantity)}`);
  if (order.customer?.center_name)
    parts.push(`الزبون: ${order.customer.center_name}`);
  if (order.product?.full_path)
    parts.push(`المنتج: ${order.product.full_path}`);
  if (order.service) parts.push(`الخدمة: ${order.service}`);
  return parts.filter(Boolean).join(" | ");
}

function getEntityName(entity, type) {
  if (!entity) return "—";
  if (entity.name) return entity.name;
  return `#${entity.id ?? "—"}`;
}

const addFundsSchema = z.object({
  from_type: z.enum(["cashbox", "supplier"], { required_error: "اختر المصدر" }),
  from_id: z.preprocess(Number, z.number().min(1, "اختر المصدر")),
  amount: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().min(0.001, "المبلغ مطلوب وأكبر من صفر"),
  ),
  commission: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().min(0, "العمولة لا تكون سالبة").optional(),
  ),
  title: z.string().optional(),
  description: z.string().optional(),
});

export default function LedgerPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type") || null;
  const idParam = searchParams.get("id");
  const id = idParam ? parseInt(idParam, 10) : null;

  const { data, isLoading, isError, error } = useLedger(type, id);
  const { data: balancesData, isSuccess: balancesSuccess } = useBalances();
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const addFundsMutation = useAddFundsToLedgerEntity(type, id);
  const goBack = () => navigate(-1);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addFundsSchema),
    defaultValues: { from_type: "cashbox", amount: "" },
  });
  const watchFromType = watch("from_type");

  useEffect(() => {
    if (addFundsMutation.isSuccess) {
      setIsAddFundsOpen(false);
      reset();
      addFundsMutation.reset();
    }
  }, [addFundsMutation.isSuccess, reset, addFundsMutation]);

  useEffect(() => {
    setValue("from_id", undefined);
  }, [watchFromType, setValue]);

  if (!type || !id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p className="text-gray-600 dark:text-gray-400">
          يجب تحديد نوع الكيان ورقمه (type و id)
        </p>
        <button
          type="button"
          onClick={goBack}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          رجوع
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p className="text-red-600 dark:text-red-400">
          {error?.message || "حدث خطأ أثناء جلب البيانات"}
        </p>
        <button
          type="button"
          onClick={goBack}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          رجوع
        </button>
      </div>
    );
  }

  const entityName = getEntityName(data?.entity, data?.type);
  const typeLabel = TYPE_LABELS[data?.type ?? type] ?? type;

  const onSubmitAddFunds = (formData) => {
    addFundsMutation.mutate({
      from_type: formData.from_type,
      from_id: formData.from_id,
      amount: formData.amount,
      commission: formData.commission > 0 ? formData.commission : undefined,
      title: formData.title || undefined,
      description: formData.description || undefined,
    });
  };

  const fromOptions =
    watchFromType === "cashbox"
      ? (balancesData?.cashboxes ?? []).map((c) => ({
          title: c.name,
          id: c.id,
        }))
      : (balancesData?.suppliers ?? []).map((s) => ({
          title: s.name,
          id: s.id,
        }));

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 dark:bg-gray-800 min-h-full rounded-xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={goBack}
            className="p-2 rounded-lg bg-white dark:bg-gray-900 shadow hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="رجوع"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l7-7m0 0l-7-7m7 7H3"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              دفتر الحركات — {typeLabel}: {entityName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {typeLabel} #{id}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsAddFundsOpen(true)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
        >
          إضافة مبلغ
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          الرصيد الحالي
        </p>
        <p
          className={`text-2xl font-bold ${
            (data?.balance ?? 0) >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {formatAmount(data?.balance)} ل.س
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            الحركات
          </h2>
        </div>

        {!data?.transactions?.length ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            لا توجد حركات
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                  <th className="px-4 py-3 font-medium">من ← إلى</th>
                  <th className="px-4 py-3 font-medium">النوع</th>
                  <th className="px-4 py-3 font-medium">المبلغ</th>
                  <th className="px-4 py-3 font-medium">العمولة</th>
                  <th className="px-4 py-3 font-medium">الرصيد بعد العملية</th>
                  <th className="px-4 py-3 font-medium">التاريخ</th>
                  <th className="px-4 py-3 font-medium">العنوان</th>
                  {/* <th className="px-4 py-3 font-medium">الوصف</th> */}
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td
                      className="px-4 py-3 text-gray-700 text-nowrap dark:text-gray-300"
                      title={`من: ${tx.from_label ?? "—"} → إلى: ${tx.to_label ?? "—"}`}
                    >
                      <span className="text-sm">
                        من <strong>{tx.from_label ?? "—"}</strong> ← إلى{" "}
                        <strong>{tx.to_label ?? "—"}</strong>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                          tx.type === "credit"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {tx.type === "credit" ? "إضافة" : "خصم"}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        tx.type === "credit"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}
                      {formatAmount(tx.amount)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {tx.commission != null && Number(tx.commission) > 0
                        ? formatAmount(tx.commission)
                        : "—"}
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        (tx.running_balance ?? 0) >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatAmount(tx.running_balance)}
                    </td>
                    <td className="px-4 py-3 text-sm text-nowrap text-gray-700 dark:text-gray-300">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-700 dark:text-gray-300"
                      title={formatOrderTooltip(tx.order) || tx.title || "—"}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm text-nowrap">
                          {tx.title ?? "—"}
                        </span>
                        {tx.order?.state ? (
                          <span className="text-xs text-nowrap text-gray-500 dark:text-gray-400 mt-1">
                            {tx.order?.service ? `${tx.order.service}` : ""}{" "}
                            <br />
                            {tx.order.field?.quantity?.value
                              ? `كمية: ${tx.order.field?.quantity?.value}`
                              : ""}{" "}
                            <br />
                            {tx.order.field?.number?.value
                              ? `رقم: ${tx.order.field?.number?.value}`
                              : ""}{" "}
                            <br />
                            {tx.order.field?.code?.value
                              ? `كود: ${tx.order.field?.code?.value}`
                              : ""}{" "}
                            <br />
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ActionModal
        open={isAddFundsOpen}
        close={setIsAddFundsOpen}
        size="small"
        title="إضافة مبلغ لهذا الكيان"
      >
        <form onSubmit={handleSubmit(onSubmitAddFunds)} className="space-y-4">
          <InputFieldZod
            title="المصدر (من)"
            name="from_type"
            type="select"
            register={register}
            errors={errors}
            direction="rtl"
            options={[
              { title: "الصندوق", id: "cashbox" },
              { title: "مورد", id: "supplier" },
            ]}
          />
          <InputFieldZod
            title={watchFromType === "cashbox" ? "الصندوق" : "المورد"}
            name="from_id"
            type="select"
            register={register}
            errors={errors}
            direction="rtl"
            options={fromOptions}
          />
          <InputFieldZod
            title="المبلغ (اللي يصل للكيان)"
            name="amount"
            type="number"
            step="0.001"
            register={register}
            errors={errors}
            direction="rtl"
          />
          <InputFieldZod
            title="العمولة (اختياري - تُسحب من المصدر وتُضاف للصندوق)"
            name="commission"
            type="number"
            step="0.001"
            register={register}
            errors={errors}
            direction="rtl"
          />
          <InputFieldZod
            title="العنوان (اختياري)"
            name="title"
            type="text"
            register={register}
            errors={errors}
            direction="rtl"
          />
          <InputFieldZod
            title="الوصف (اختياري)"
            name="description"
            type="textarea"
            register={register}
            errors={errors}
            direction="rtl"
          />
          <button
            type="submit"
            className="btn btn-primary mx-auto !py-1 w-20 block"
            disabled={addFundsMutation.isPending}
          >
            {addFundsMutation.isPending ? <Spinner sm /> : "إضافة"}
          </button>
        </form>
      </ActionModal>
    </div>
  );
}
