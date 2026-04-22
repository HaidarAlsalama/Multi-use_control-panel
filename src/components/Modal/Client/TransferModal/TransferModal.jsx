import { useMyPaymentById } from "api/Client/balance";
import { GiSandsOfTime } from "react-icons/gi";
import ClientActionModal from "../ClientActionModal/ClientActionModal";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdNumbers } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { image_host } from "config/api_host";
import { Spinner } from "components";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ClientInputFieldZod from "components/ClientLayoutPages/ClientInputField/ClientInputFieldZod";
import { useTransfer } from "api/Client/broker";
import { useEffect } from "react";

const transferSchema = z
  .object({
    amount: z.coerce.number().refine((val) => val > 0, {
      message: "الرجاء إدخال مبلغ التحويل",
    }),
    confirmation_amount: z.coerce.number().refine((val) => val > 0, {
      message: "الرجاء تأكيد مبلغ التحويل",
    }),
  })
  .refine((data) => data.amount === data.confirmation_amount, {
    message: "يجب أن يتطابق مبلغ التحويل مع مبلغ التأكيد",
    path: ["confirmation_amount"],
  });

const fieldsZod = [
  {
    label: "المبلغ",
    id: "amount",
    autoComplete: "off",
    required: true,
    type: "number",
    pull: true,
  },
  {
    label: "تأكيد المبلغ",
    id: "confirmation_amount",
    autoComplete: "off",
    required: true,
    type: "number",
    pull: true,
  },
];

export default function TransferModal({ isOpen, toggle, currentCustomer }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transferSchema),
  });

  const {
    mutate: transfer,
    isPending: transferIsPending,
    isSuccess: transferIsSuccess,
  } = useTransfer();

  useEffect(() => {
    if (transferIsSuccess) {
      toggle(false);
    }
  }, [transferIsSuccess, toggle]);

  const onSubmit = (data) => {
    transfer({ amount: data.amount, customer_id: currentCustomer?.id });
  };
  return (
    <ClientActionModal
      open={isOpen}
      close={toggle}
      size="xSmall"
      title={`ارسال رصيد لـ  ${currentCustomer?.center_name}`}
    >
      <form
        className=" grid grid-cols-1 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {fieldsZod.map((field) => (
          <ClientInputFieldZod
            key={field.id}
            name={field.id}
            label={field.label}
            register={register}
            type={field.type}
            required={field.required}
            autoComplete={field.autoComplete}
            errors={errors}
            direction="ltr"
            pull={field.pull}
          />
        ))}

        <button
          type="submit"
          className="btn btn-smart md:col-span-2 mx-auto mt-4 w-40"
          disabled={transferIsPending}
        >
          {transferIsPending ? <Spinner sm /> : "ارسال"}
        </button>
      </form>
    </ClientActionModal>
  );
}
