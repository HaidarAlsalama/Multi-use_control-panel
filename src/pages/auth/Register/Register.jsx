import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "api/Auth/auth";
import { Spinner } from "components";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(1, "الاسم الكامل مطلوب"),
    center_name: z.string().min(1, "اسم المركز مطلوب"),
    email: z.string().email("يجب إدخال بريد إلكتروني صحيح"),
    phone: z.string().min(1, "رقم الموبايل مطلوب"),
    address: z.string().min(1, "العنوان مطلوب"),
    city: z.string().min(1, "المدينة مطلوبة"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون على الأقل 8 أحرف"),
    password_confirmation: z.string(),
    currency: z.enum(["S.P", "USD", ""]).refine((val) => val !== "", {
      message: "يرجى اختيار العملة من القائمة المحددة.",
    }),
    // lang: z.enum(["AR", "EN", ""]).refine((val) => val !== "", {
    //   message: "يرجى اختيار اللغة من القائمة المحددة.",
    // }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمة المرور وتأكيدها غير متطابقتين",
    path: ["password_confirmation"],
  });

export default function Register() {
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleSubmitRegister = async (data) => {
    registerUser({ ...data, lang: "AR" });
  };

  const inputFields = [
    {
      id: "name",
      title: "الاسم الثلاثي",
      type: "text",
      // className: "md:col-span-2",
      required: true,
    },
    { id: "center_name", title: "اسم المركز", type: "text" },
    {
      id: "email",
      title: "البريد الالكتروني",
      type: "email",
      direction: "ltr",
      required: true,
    },
    {
      id: "phone",
      title: "رقم الموبايل ",
      type: "text",
      direction: "ltr",
      required: true,
      placeholder: "9639xxxxxxxx",
    },
    { id: "city", title: "المدينة", type: "text", required: true },
    { id: "address", title: "العنوان بالتفصيل", type: "text", required: true },
    {
      id: "password",
      title: "كلمة المرور",
      type: "password",
      direction: "ltr",
      required: true,
    },
    {
      id: "password_confirmation",
      title: "تأكيد كلمة المرور",
      type: "password",
      direction: "ltr",
      required: true,
    },
    {
      title: "العملة",
      id: "currency",
      required: true,
      type: "select",
      options: [
        {
          id: "S.P",
          name: "ليرة",
        },
        {
          id: "USD",
          name: "دولار",
        },
      ],
      direction: "ltr",
    },
    // {
    //   title: "اللغة",
    //   id: "lang",
    //   required: true,
    //   type: "select",
    //   options: [
    //     {
    //       id: "AR",
    //       name: "العربية",
    //     },
    //     {
    //       id: "EN",
    //       name: "الانكليزية",
    //     },
    //   ],
    //   direction: "ltr",
    // },
  ];

  return (
    <div
      className="flex justify-center items-center w-full md:p-2 overflow-hidden"
      id="login-page"
    >
      <div
        className="absolute z-0 w-full max-w-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[740px] md:h-[555px]_ md:h-[550px] bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg transform 
      -skew-y-6 md:skew-y-0 md:-rotate-3 md:rounded-md"
      ></div>

      <section className=" w-full relative max-w-3xl p-6 mx-auto bg-white md:rounded-md shadow-md dark:bg-gray-800 my-auto md:my-6 md:h-[555px]_ md:h-[550px]">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-700 dark:text-white">
            تسجيل حساب جديد
          </h2>
          <form
            onSubmit={handleSubmit(handleSubmitRegister)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {inputFields.map((input, index) => (
              <InputFieldZod
                key={index}
                title={input.title}
                name={input.id}
                type={input.type}
                direction={input.direction || "rtl"}
                className={input.className || ""}
                required={input.required || false}
                errors={errors}
                register={register}
                options={input.options}
                placeholder={input.placeholder}
              />
            ))}

            <div className="flex justify-center mt-5 md:col-span-2">
              {!isPending ? (
                <button className="span px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                  تسجيل
                </button>
              ) : (
                <Spinner />
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
