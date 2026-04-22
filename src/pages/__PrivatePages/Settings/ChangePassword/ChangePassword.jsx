import { zodResolver } from "@hookform/resolvers/zod";
import { useEditPass } from "api/Auth/auth";
import { Spinner } from "components";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registrationSchema = z
  .object({
    old_password: z.string().min(6, {
      message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    }),
    new_password: z.string().min(6, {
      message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    }),
    new_password_confirmation: z.string().min(6, {
      message: "تأكيد كلمة المرور يجب أن يكون 6 أحرف على الأقل",
    }),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "كلمة المرور وتأكيد كلمة المرور غير متطابقين",
    path: ["new_password_confirmation"], // يحدد الحقل الذي يحتوي على الخطأ
  });

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const {
    mutate: editPass,
    isPending: editPassIsPending,
    isSuccess: editPassIsSuccess,
  } = useEditPass();

  const fieldsZod = [
    {
      label: "كلمة المرور القديمة",
      id: "old_password",
      autoComplete: "new-password",
      required: true,
      type: "password",
    },
    {
      label: "كلمة المرور",
      id: "new_password",
      autoComplete: "new-password",
      required: true,
      type: "password",
    },
    {
      label: "تأكيد كلمة المرور",
      id: "new_password_confirmation",
      autoComplete: "new-password",
      required: true,
      type: "password",
    },
  ];

  useEffect(() => {
    if (editPassIsSuccess) reset();
  }, [editPassIsSuccess]);

  const onSubmit = (data) => {
    editPass(data);
  };
  return (
    <div className="flex flex-col gap-6 p-4 justify-between bg-gray-50 dark:bg-gray-800 h-full rounded-lg">
      <form
        className="grid grid-cols-1 max-w-2xl w-full mx-auto gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {fieldsZod.map((field, index) => (
          <InputFieldZod
            key={index}
            name={field.id}
            title={field.label}
            register={register}
            type={field.type || "text"}
            autoComplete={field.autoComplete}
            errors={errors}
            direction="ltr"
            pull={field.pull}
            required
          />
        ))}
        <button
          type="submit"
          disabled={editPassIsPending}
          className="btn btn-primary  mx-auto mt-4 w-40 h-8"
        >
          {editPassIsPending ? <Spinner sm /> : "تعديل"}
        </button>
      </form>
    </div>
  );
}
