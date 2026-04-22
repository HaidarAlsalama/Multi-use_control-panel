import { zodResolver } from "@hookform/resolvers/zod";
import { useAgentById, useEditAgent } from "api/admin/agent";
import { Spinner } from "components";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TiWarning } from "react-icons/ti";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";

const schema = z.object({
  name: z.string().nonempty("يرجى إدخال اسم."),
  center_name: z.string().nonempty("يرجى إدخال اسم المركز."),
  email: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        /^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(val),
      {
        message: "يرجى إدخال بريد إلكتروني صالح.",
      }
    ),
  phone: z.string().regex(/^\d{12}$/, "رقم الهاتف يجب أن يتكون من 12 أرقام."),
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

export default function EditAgent({ isOpen, toggle, agentId }) {
  const {
    data: currentAgent,
    isSuccess: currentAgentIsSuccess,
    isFetching: currentAgentIsLoading,
    isError: currentAgentIsError,
  } = useAgentById(agentId);

  const {
    mutate: editAgent,
    isPending: editAgentIsPending,
    isSuccess: editAgentIsSuccess,
  } = useEditAgent(agentId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (currentAgentIsSuccess) {
      reset({
        name: currentAgent?.data.agent.name,
        center_name: currentAgent?.data.agent.center_name,
        phone: currentAgent?.data.agent.phone,
        address: currentAgent?.data.agent.address,
      });
    }
  }, [currentAgent, currentAgentIsLoading]);

  useEffect(() => {
    if (editAgentIsSuccess) {
      reset();
      toggle(false);
    }
  }, [editAgentIsSuccess, reset, toggle]);

  const onSubmit = (data) => {
    editAgent(data);
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="small" title={"تعديل وكيل"}>
      {currentAgentIsLoading ? (
        <Spinner />
      ) : !currentAgentIsError ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(
              ({ title, id, required, type, direction, className }) => (
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
              )
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary mx-auto !py-1 w-20"
            disabled={editAgentIsPending}
          >
            {editAgentIsPending ? <Spinner sm /> : "تعديل"}
          </button>
        </form>
      ) : (
        <div className="w-full text-7xl text-yellow-500 flex justify-center">
          <TiWarning />
        </div>
      )}
    </ActionModal>
  );
}
