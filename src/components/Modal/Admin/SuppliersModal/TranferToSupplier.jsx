import { zodResolver } from "@hookform/resolvers/zod";
import { useSuppliers, useTransferToSupplier } from "api/admin/supplier";
import { Spinner } from "components";
import DataList from "components/InputField/DataList";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";

const schema = z.object({
  initial_balance: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return undefined; // اختياري
      const n = Number(val);
      return isNaN(n) ? val : n; // إذا نص غير رقمي يفشل الـ number
    },
    z
      .number({ invalid_type_error: "الرجاء إدخال رقم صحيح أو عشري." })
      .optional(),
  ),

  // الحقول الخاصة بالتحويل (transfer)
  from_type: z.enum(["cashbox", "Supplier"]).optional(), // من الصندوق أو مورد
  from_id: z.number().optional(), // موجود فقط إذا from_type = Supplier
  to_id: z.number().optional(), // مورد المستلم (لازم موجود إذا transfer)
  description: z.string().optional(),
  amount: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const n = Number(val);
      return isNaN(n) ? val : n;
    },
    z
      .number({ invalid_type_error: "الرجاء إدخال مبلغ صحيح أو عشري." })
      .optional(),
  ),
});

export default function TranferToSupplier({ isOpen, toggle, supplierId }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const watcher = watch();
  const {
    mutate: addSuppliers,
    isPending: addSuppliersIsPending,
    isSuccess: addSuppliersIsSuccess,
  } = useTransferToSupplier();

  const { data: supllierData, isSuccess: supllierDataIsSuccess } =
    useSuppliers();

  useEffect(() => {
    if (addSuppliersIsSuccess) {
      toggle(false);
    }
  }, [addSuppliersIsSuccess, toggle]);

  const onSubmit = (data) => {
    addSuppliers({ ...data, to_id: supplierId });
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="small" title={"اضافة وكيل"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1  gap-4">
          <InputFieldZod
            title="نوع التحويل"
            name="from_type"
            required={false}
            type="select"
            register={register}
            errors={errors}
            direction="rtl"
            options={[
              { title: "الصندوق", id: "cashbox" },
              { title: "مورد", id: "Supplier" },
            ]}
          />
          {watcher.from_type === "Supplier" && (
            <DataList
              title={"حدد المورد"}
              data={supllierData?.data}
              successFetch={supllierDataIsSuccess}
              name={"from_id"}
              rest={reset}
              errors={errors}
            />
          )}

          <InputFieldZod
            title="المبلغ"
            name="amount"
            required={false}
            type="number"
            step="0.01"
            register={register}
            errors={errors}
            direction="rtl"
          />

          <InputFieldZod
            title="الوصف"
            name="description"
            required={false}
            type="textarea"
            register={register}
            errors={errors}
            direction="rtl"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mx-auto !py-1 w-20"
          disabled={addSuppliersIsPending}
        >
          {addSuppliersIsPending ? <Spinner sm /> : "إضافة"}
        </button>
      </form>
    </ActionModal>
  );
}
