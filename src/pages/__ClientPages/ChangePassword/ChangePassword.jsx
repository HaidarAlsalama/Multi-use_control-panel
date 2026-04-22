import { zodResolver } from "@hookform/resolvers/zod";
import { useEditPass } from "api/Auth/auth";
import { Spinner } from "components";
import ClientInputFieldZod from "components/ClientLayoutPages/ClientInputField/ClientInputFieldZod";
import Container from "components/ClientLayoutPages/Container/Container";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HiOutlineLockClosed } from "react-icons/hi"; // أيقونة إضافية للجمالية

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
    path: ["new_password_confirmation"],
  });

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
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
      autoComplete: "current-password",
      required: true,
      type: "password",
      fullWidth: true, // الحقل الأول يأخذ عرض كامل للتميز
    },
    {
      label: "كلمة المرور الجديدة",
      id: "new_password",
      autoComplete: "new-password",
      required: true,
      type: "password",
    },
    {
      label: "تأكيد كلمة المرور الجديدة",
      id: "new_password_confirmation",
      autoComplete: "new-password",
      required: true,
      type: "password",
    },
  ];

  useEffect(() => {
    if (editPassIsSuccess) reset();
  }, [editPassIsSuccess, reset]);

  const onSubmit = (data) => {
    editPass(data);
  };

  return (
    <div className="h-full flex justify-center items-center">
      <div className="max-w-2xl w-full mx-auto mt-6" dir="rtl">
        {/* الحاوية الزجاجية للفورم */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-xl md:rounded-[2.5rem] border-y-2 md:border  border-blak/10 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 md:p-10 transition-all duration-300"
        >
          {/* رأس الفورم مع أيقونة */}
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-white/5 pb-6">
            <div className="p-3 bg-mainLight/10 rounded-2xl text-mainLight">
              <HiOutlineLockClosed size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                تحديث أمان الحساب
              </h3>
              <p className="text-gray-400 text-xs font-medium mt-1">
                تأكد من اختيار كلمة مرور قوية وفريدة
              </p>
            </div>
          </div>

          {/* شبكة الحقول */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {fieldsZod.map((field, index) => (
              <div
                key={index}
                className={field.fullWidth ? "md:col-span-2 mb-2" : ""}
              >
                <ClientInputFieldZod
                  name={field.id}
                  label={field.label}
                  register={register}
                  type={field.type || "text"}
                  autoComplete={field.autoComplete}
                  errors={errors}
                  direction="ltr"
                  required
                  // تخصيص إضافي للـ Input ليناسب الشكل الجديد
                  className="rounded-[1.2rem] border-gray-100  transition-all focus:ring-4 focus:ring-mainLight/10"
                />
              </div>
            ))}
          </div>

          {/* زر التعديل */}
          <div className="flex justify-center md:justify-end mt-10">
            <button
              type="submit"
              disabled={editPassIsPending}
              className="group relative flex items-center justify-center gap-2 bg-mainLight text-white px-10 py-4 rounded-[1.5rem] font-bold shadow-lg shadow-mainLight/30 hover:shadow-mainLight/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 overflow-hidden w-full md:w-auto min-w-[180px]"
            >
              <span className="relative z-10">
                {editPassIsPending ? <Spinner sm /> : "تحديث كلمة المرور"}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
