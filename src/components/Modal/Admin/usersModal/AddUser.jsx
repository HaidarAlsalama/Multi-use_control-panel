import { zodResolver } from "@hookform/resolvers/zod";
import { useRole } from "api/admin/roleAndPerm";
import { useAddUser } from "api/admin/user";
import { Spinner } from "components";
import DataList from "components/InputField/DataList";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import Guard from "components/PrivateLayoutPages/Guard/Guard";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";

const schema = z
  .object({
    name: z.string().nonempty("الاسم مطلوب."),
    email: z
      .string()
      .email("يرجى إدخال بريد إلكتروني صالح.")
      .nonempty("البريد الإلكتروني مطلوب."),
    phone: z
      .string()
      .regex(/^(\+?\d{1,3})?\s?\d{9,15}$/, "يرجى إدخال رقم هاتف صالح.")
      .optional(),
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل.")
      .nonempty("كلمة المرور مطلوبة."),
    password_confirmation: z.string().nonempty("تأكيد كلمة المرور مطلوب."),
    role: z
      .preprocess((val) => (val !== "" ? Number(val) : undefined), z.number())
      .refine((val) => !isNaN(val) && val > 0, {
        message: "يجب تحديد دور صالح.", // رسالة إذا لم يكن رقماً صالحاً أو أقل من 1
      })
      .or(
        z.literal(undefined).refine(() => false, { message: "الدور مطلوب." })
      ),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        path: ["password_confirmation"],
        message: "كلمة المرور وتأكيد كلمة المرور غير متطابقتين.",
      });
    }
  });

const fields = [
  { title: "الاسم", id: "name", required: true, type: "text", pull: true },
  {
    title: "البريد الالكتروني",
    id: "email",
    direction: "ltr",
    required: true,
    type: "email",
  },
  {
    title: "الهاتف",
    id: "phone",
    required: false,
    direction: "ltr",
    type: "text",
  },
  {
    title: "كلمة المرور",
    id: "password",
    direction: "ltr",
    required: true,
    type: "password",
  },
  {
    title: "تأكيد كلمة المرور",
    id: "password_confirmation",
    direction: "ltr",
    required: true,
    type: "password",
  },
];

export default function AddUser({ isOpen, toggle }) {
  const [image, setImage] = useState(null);
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
    reset({ name: "", role: undefined });
  }, []);

  const {
    mutate: addUser,
    isPending: addUserIsPending,
    isSuccess: addUserIsSuccess,
  } = useAddUser();

  const { data: roles, isSuccess: rolesIsSuccess } = useRole();

  useEffect(() => {
    if (addUserIsSuccess) {
      toggle(false);
    }
  }, [addUserIsSuccess, toggle]);

  const onSubmit = (data) => {
    addUser(data);
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="small"
      title={"اضافة مستخدم"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete="off"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(({ title, id, required, type, direction, pull }) => (
            <InputFieldZod
              key={id}
              title={title}
              name={id}
              required={required}
              type={type}
              register={register}
              errors={errors}
              direction={direction || "rtl"}
              pull={pull}
            />
          ))}
        </div>
        <Guard permission={"view_roles"}>
          <DataList
            title={"الدور"}
            data={roles?.data}
            successFetch={rolesIsSuccess}
            // currentValue={0}
            name={"role"}
            rest={reset}
            errors={errors}
          />
        </Guard>
        <button
          type="submit"
          className="btn btn-primary mx-auto !py-1 w-20"
          disabled={addUserIsPending}
        >
          {addUserIsPending ? <Spinner sm /> : "إضافة"}
        </button>
      </form>
    </ActionModal>
  );
}
