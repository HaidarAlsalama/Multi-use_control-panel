import { zodResolver } from "@hookform/resolvers/zod";
import { useAddCustomer } from "api/admin/customer";
import { useCustomerGroup } from "api/admin/customerGroup";
import { useCustomersHaventHolder } from "api/admin/mandob";
import { Spinner } from "components";
import { CheckboxZod } from "components/InputField/CheckboxZod";
import DataList from "components/InputField/DataList";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import MultiSelect from "components/InputField/MultiSelect";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";
import Guard from "components/PrivateLayoutPages/Guard/Guard";

const schema = z
  .object({
    name: z.string().nonempty("الاسم مطلوب."),
    city: z.string().nonempty("المدينة مطلوبة."),
    address: z.string().nonempty("العنوان مطلوب."),
    center_name: z.string().nonempty("اسم المركز مطلوب."),
    email: z.string().email("صيغة البريد الإلكتروني غير صحيحة."),
    phone: z.string().min(1, "رقم الموبايل مطلوب"),

    pin: z.string().nonempty("الPIN مطلوب."),

    total_device: z.string().optional(),

    syriatel_code: z.string().optional(),
    mtn_code: z.string().optional(),

    // currency: z.enum(["S.P", "USD", ""]).refine((val) => val !== "", {
    //   message: "يرجى اختيار العملة من القائمة المحددة.",
    // }),
    // is_broker: z.boolean().optional(), // تم التعديل ليصبح checkbox
    min_balance: z
      .string()
      .optional() // اجعل الحقل اختيارياً
      .refine(
        (val) =>
          val === undefined ||
          val === "" ||
          (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
        {
          message: "يجب أن يكون الرصيد الأدنى صفراً أو رقماً موجباً",
        },
      ),
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون مكونة من 8 محارف على الأقل."),
    password_confirmation: z
      .string()
      .min(8, "تأكيد كلمة المرور يجب أن يكون مكوناً من 8 محارف على الأقل."),
    // sub_customers: z.array(z.union([z.string(), z.number()])).optional(),
    // role: z
    //   .preprocess((val) => (val !== "" ? Number(val) : undefined), z.number())
    //   .refine((val) => !isNaN(val) && val > 0, {
    //     message: "يجب تحديد دور صالح.", // رسالة إذا لم يكن رقماً صالحاً أو أقل من 1
    //   })
    //   .or(
    //     z.literal(undefined).refine(() => false, { message: "الدور مطلوب." }),
    //   ),
  })
  .superRefine((data, ctx) => {
    if (data.password && data.password_confirmation !== data.password) {
      ctx.addIssue({
        path: ["password_confirmation"],
        message: "كلمتا المرور يجب أن تتطابقا.",
      });
    }
  });

const fields = [
  { title: "الاسم", id: "name", required: true, type: "text" },
  {
    title: "اسم المركز",
    id: "center_name",
    required: true,
    type: "text",
    pull: false,
  },
  {
    title: "المدينة",
    id: "city",
    type: "text",
    required: true,
    pull: false,
  },
  {
    title: "العنوان",
    id: "address",
    type: "text",
    required: true,
    pull: false,
  },
  {
    title: "البريد الإلكتروني",
    id: "email",
    required: true,
    type: "email",
    direction: "ltr",
  },
  {
    title: "الهاتف",
    id: "phone",
    required: true,
    type: "text",
    direction: "ltr",
  },
  {
    title: "كلمة المرور",
    id: "password",
    required: true,
    type: "password",
    direction: "ltr",
  },
  {
    title: "تأكيد كلمة المرور",
    id: "password_confirmation",
    required: true,
    type: "password",
    direction: "ltr",
  },
  {
    title: "كود MTN",
    id: "mtn_code",
    required: false,
    type: "text",
    direction: "ltr",
  },
  {
    title: "كود Syriatel",
    id: "syriatel_code",
    required: false,
    type: "text",
    direction: "ltr",
  },
  {
    title: "الاجهزر المتاحة",
    id: "total_device",
    required: true,
    type: "text",
    direction: "ltr",
  },
  {
    title: "PIN",
    id: "pin",
    required: true,
    type: "text",
    direction: "ltr",
  },
  // {
  //   title: "العملة",
  //   id: "currency",
  //   required: true,
  //   type: "select",
  //   options: [
  //     {
  //       id: "S.P",
  //       name: "ليرة",
  //     },
  //     {
  //       id: "USD",
  //       name: "دولار",
  //     },
  //   ],
  //   direction: "ltr",
  // },
  {
    title: "اقل رصيد",
    id: "min_balance",
    type: "number",
    direction: "ltr",
  },
];

export default function AddCustomer({ isOpen, toggle }) {
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
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      is_broker: false,
      sub_customers: [],
    });
  }, []);

  const watcher = watch();
  // useEffect(() => {
  //   console.log("مراقب البيانات", watcher);
  // }, [watcher]);

  const {
    mutate: addCustomer,
    isPending: addCustomerIsPending,
    isSuccess: addCustomerIsSuccess,
  } = useAddCustomer();

  const {
    data: customersHaventHolder,
    isSuccess: customersHaventHolderIsSuccess,
    isFetching: customersHaventHolderIsFetching,
  } = useCustomersHaventHolder();

  const {
    data: roles,
    isSuccess: rolesIsSuccess,
    isLoading: rolesIsIsLoading,
  } = useCustomerGroup();

  useEffect(() => {
    if (addCustomerIsSuccess) {
      toggle(false);
    }
  }, [addCustomerIsSuccess, toggle]);

  const onSubmit = (data) => {
    addCustomer({ ...data, currency: "S.P", role: 3 });
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="small" title={"اضافة زبون"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(
            ({ title, id, required, type, options, direction, pull }) => (
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
                options={options}
              />
            ),
          )}

          {/* <Guard permission={"view_customer_groups"}>
            {rolesIsSuccess && (
              <DataList
                title={"حدد مجموعة الزبون"}
                data={roles?.data}
                successFetch={rolesIsSuccess}
                name={"role"}
                rest={reset}
                errors={errors}
                required
              />
            )}
          </Guard> */}
        </div>

        {/* <CheckboxZod
          title={"تعين كمندوب"}
          name={"is_broker"}
          register={register}
          errors={errors}
        /> */}

        {/* {watcher.is_broker == true && (
          <MultiSelect
            apiResponse={
              customersHaventHolderIsSuccess && customersHaventHolder.data
            }
            title={"الزبائن المراد اضافتهم لهذا المندوب"}
            name={"sub_customers"}
            reset={reset}
            errors={errors}
            successFetch={customersHaventHolderIsSuccess}
            loadingFetch={customersHaventHolderIsFetching}
          />
        )} */}

        <button
          type="submit"
          className="btn btn-primary mx-auto !py-1 w-20"
          disabled={addCustomerIsPending}
        >
          {addCustomerIsPending ? <Spinner sm /> : "إضافة"}
        </button>
      </form>
    </ActionModal>
  );
}
