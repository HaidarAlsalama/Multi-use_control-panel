import { zodResolver } from "@hookform/resolvers/zod";
import { useCustomerById, useEditCustomer } from "api/admin/customer";
import { useCustomerGroup } from "api/admin/customerGroup";
import { useCustomersHaventHolder } from "api/admin/mandob";
import { Spinner } from "components";
import { CheckboxZod } from "components/InputField/CheckboxZod";
import DataList from "components/InputField/DataList";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import MultiSelect from "components/InputField/MultiSelect";
import Guard from "components/PrivateLayoutPages/Guard/Guard";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";
import { useAddBalance } from "api/admin/financialStatement";

const schema = z.object({
  amount: z.preprocess(
    (val) => Number(val),
    z.number().refine((value) => value !== 0, {
      message: "المبلغ مطلوب.",
    }),
  ),

  notify_number: z.union([
    z.string().nonempty("رقم الإشعار مطلوب."),
    z.number().refine((val) => val !== "", { message: "رقم الإشعار مطلوب." }),
  ]),
  notes: z.string().optional(),
});

const fields = [
  {
    title: "المبلغ",
    id: "amount",
    required: true,
    type: "number",
  },
  {
    title: "رقم الاشعار",
    id: "notify_number",
    type: "text",
    required: true,
  },
  {
    title: "الملاحظات",
    id: "notes",
    type: "textarea",
    required: false,
  },
];

export default function AddMoney({ isOpen, toggle, customerId }) {
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
    mutate: addMoney,
    isPending: addMoneyIsPending,
    isSuccess: addMoneyIsSuccess,
  } = useAddBalance(customerId);

  useEffect(() => {
    reset((prev) => {
      return { ...prev, notify_number: Date.now() };
    });
  }, []);

  useEffect(() => {
    if (addMoneyIsSuccess) {
      toggle(false);
    }
  }, [addMoneyIsSuccess, toggle]);

  const onSubmit = (data) => {
    addMoney(data);
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="xSmall"
      title={"اضافة رصيد"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1  gap-4">
          {fields.map(({ title, id, required, type, direction }) => (
            <InputFieldZod
              key={id}
              title={title}
              name={id}
              required={required}
              type={type}
              register={register}
              errors={errors}
              direction={direction || "rtl"}
            />
          ))}
        </div>

        <button
          type="submit"
          className="btn btn-primary mx-auto !py-1 w-20"
          disabled={addMoneyIsPending}
        >
          {addMoneyIsPending ? <Spinner sm /> : "اضافة"}
        </button>
      </form>
    </ActionModal>
  );
}
