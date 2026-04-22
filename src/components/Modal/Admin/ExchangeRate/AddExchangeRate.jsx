import { zodResolver } from "@hookform/resolvers/zod";
import { useAddExchangeRate } from "api/admin/exchangeRate";
import { Spinner } from "components";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";

const schema = z.object({
  purchase_price: z.coerce
    .number({ invalid_type_error: "يرجى إدخال سعر الشراء." })
    .min(1, "يجب أن يكون السعر رقمًا موجبًا."),
  selling_price: z.coerce
    .number({ invalid_type_error: "يرجى إدخال سعر المبيع." })
    .min(1, "يجب أن يكون السعر رقمًا موجبًا."),
});

const fields = [
  {
    title: "سعر الاشعار البنكي",
    id: "purchase_price",
    required: true,
    type: "number",
    direction: "ltr",
  },
  {
    title: "سعر المنتج الديناميكي",
    id: "selling_price",
    required: true,
    type: "number",
    direction: "ltr",
  },
];
export default function AddExchangeRate({ isOpen, toggle }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    mutate: addExchangeRate,
    isPending: addExchangeRateIsPending,
    isSuccess: addExchangeRateIsSuccess,
  } = useAddExchangeRate();

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
          {addExchangeRateIsPending ? <Spinner sm /> : "إضافة"}
        </button>
      </form>
    </ActionModal>
  );
}
