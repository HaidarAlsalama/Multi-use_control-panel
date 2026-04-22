import { zodResolver } from "@hookform/resolvers/zod";
import { useAddAgent } from "api/admin/agent";
import { Spinner } from "components";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";

const schema = z.object({
  name: z.string().nonempty("يرجى إدخال اسم."),
  center_name: z.string().nonempty("يرجى إدخال اسم المركز."),
  email: z.string().optional(),
  phone: z
    .string()
    .regex(
      /^\d{12}$/,
      "رقم الهاتف يجب أن يتكون من 12 أرقام مع رمز النداء الدولي."
    ),
  address: z.string().nonempty("يرجى إدخال العنوان."),
});
const fields = [
  {
    title: "الاسم",
    id: "name",
    required: true,
    type: "text",
  },

  {
    title: "اسم المركز",
    id: "center_name",
    required: true,
    type: "text",
  },
  {
    title: "رقم الموبايل",
    id: "phone",
    required: true,
    type: "tel",
    direction: "ltr",
    className: "md:col-span-2",
  },
  {
    title: "العنوان",
    id: "address",
    required: true,
    type: "textarea",
    className: "md:col-span-2",
  },
];

export default function AddAgent({ isOpen, toggle, parentId }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    mutate: addAgent,
    isPending: addAgentIsPending,
    isSuccess: addAgentIsSuccess,
  } = useAddAgent();

  useEffect(() => {
    if (addAgentIsSuccess) {
      toggle(false);
    }
  }, [addAgentIsSuccess, toggle]);

  const onSubmit = (data) => {
    addAgent(data);
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
          disabled={addAgentIsPending}
        >
          {addAgentIsPending ? <Spinner sm /> : "إضافة"}
        </button>
      </form>
    </ActionModal>
  );
}
