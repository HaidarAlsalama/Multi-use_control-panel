import { zodResolver } from "@hookform/resolvers/zod";
import { useEditExchangeRate } from "api/admin/exchangeRate";
import { Spinner } from "components";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";

const schema = z.object({
  purchase_price: z
    .string()
    .transform((val) => parseFloat(val.trim()))
    .refine((val) => !isNaN(val), { message: "يرجى إدخال سعر الشراء الصحيح." })
    .refine((val) => val >= 0, { message: "يجب أن يكون السعر رقمًا موجبًا." }),

  selling_price: z
    .string()
    .transform((val) => parseFloat(val.trim()))
    .refine((val) => !isNaN(val), { message: "يرجى إدخال سعر المبيع الصحيح." })
    .refine((val) => val >= 0, { message: "يجب أن يكون السعر رقمًا موجبًا." }),
  purchase_plus: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: "يرجى إدخال سعر صحيح.",
    }),

  selling_plus: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: "يرجى إدخال سعر صحيح.",
    }),

  is_auto: z.union([z.string(), z.number()]),
});

const fields = [
  {
    title: "سعر الإيداع",
    id: "purchase_price",
    required: true,
    type: "number",
    direction: "ltr",
  },
  {
    title: "سعر السحب",
    id: "selling_price",
    required: true,
    type: "number",
    direction: "ltr",
  },
  {
    title: "سعر مضاف للإيداع",
    id: "purchase_plus",
    type: "number",
    direction: "ltr",
  },
  {
    title: "سعر  مضاف للسحب",
    id: "selling_plus",
    type: "number",
    direction: "ltr",
  },
  {
    title: "الربط الالي",
    id: "is_auto",
    type: "select",
    options: [
      {
        id: 0,
        name: "غير مفعل",
      },
      {
        id: 1,
        name: "مفعل",
      },
    ],
    direction: "rtl",
  },
];

export default function EditExchangeRate({
  isOpen,
  toggle,
  selling_price,
  purchase_price,
  selling_plus,
  purchase_plus,
  is_auto,
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    reset({
      selling_price,
      purchase_price,
      selling_plus,
      purchase_plus,
      is_auto,
    });
  }, []);

  const {
    mutate: addExchangeRate,
    isPending: addExchangeRateIsPending,
    isSuccess: addExchangeRateIsSuccess,
  } = useEditExchangeRate();

  useEffect(() => {
    if (addExchangeRateIsSuccess) {
      toggle(false);
    }
  }, [addExchangeRateIsSuccess, toggle]);

  const onSubmit = (data) => {
    addExchangeRate(data);
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="small"
      title={"إضافة سعر الصرف"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(
            ({ title, id, required, type, direction, className, options }) => (
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
                options={options}
              />
            )
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary mx-auto !py-1 w-20"
          disabled={addExchangeRateIsPending}
        >
          {addExchangeRateIsPending ? <Spinner sm /> : "تعديل"}
        </button>
      </form>
    </ActionModal>
  );
}
