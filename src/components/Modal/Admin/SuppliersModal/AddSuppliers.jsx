import { zodResolver } from "@hookform/resolvers/zod";
import { useAddSupplier } from "api/admin/supplier";
import { Spinner } from "components";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";

const schema = z.object({
  name: z.string().nonempty("يرجى إدخال الاسم."),
  phone: z
    .string()
    .regex(
      /^\d{10}$/,
      "رقم الهاتف يجب أن يتكون من 10 أرقام مع رمز النداء الدولي.",
    )
    .optional(), // ❌ .regex قبل .optional
  initial_balance: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return undefined; // اختياري
      const n = Number(val);
      return isNaN(n) ? val : n; // إذا نص غير رقمي يبقى نص → يفشل الـ number
    },
    z
      .number({ invalid_type_error: "الرجاء إدخال رقم صحيح أو عشري." })
      .optional(),
  ),
});

const fields = [
  {
    title: "الاسم",
    id: "name",
    required: true,
    type: "text",
  },
  {
    title: "رقم الموبايل",
    id: "phone",
    required: false,
    type: "tel",
    direction: "ltr",
  },
  {
    title: "الرصيد الابتدائي",
    id: "initial_balance",
    required: false,
    type: "number",
    step: "0.01", // للسماح بالعشري
    className: "md:col-span-2",
  },
];

export default function AddSuppliers({ isOpen, toggle, parentId }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    mutate: addSuppliers,
    isPending: addSuppliersIsPending,
    isSuccess: addSuppliersIsSuccess,
  } = useAddSupplier();

  useEffect(() => {
    if (addSuppliersIsSuccess) {
      toggle(false);
    }
  }, [addSuppliersIsSuccess, toggle]);

  const onSubmit = (data) => {
    addSuppliers(data);
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="small" title={"اضافة وكيل"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(({ title, id, required, type, direction, className }) => (
            <InputFieldZod
              key={id}
              title={title}
              name={id}
              required={required}
              type={type}
              register={register}
              errors={errors}
              direction={direction || "rtl"}
              className={className}
            />
          ))}
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
