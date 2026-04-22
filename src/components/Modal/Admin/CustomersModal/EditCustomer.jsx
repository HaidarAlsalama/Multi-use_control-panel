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

const schema = z
  .object({
    name: z.string().nonempty("الاسم مطلوب."),
    city: z.string().nonempty("المدينة مطلوبة."),
    address: z.string().nonempty("العنوان مطلوب."),
    center_name: z.string().nonempty("اسم المركز مطلوب."),
    email: z.string().email("صيغة البريد الإلكتروني غير صحيحة."),
    phone: z.string().min(1, "رقم الموبايل مطلوب"),
    is_broker: z.boolean().optional(), // تم التعديل ليصبح checkbox
    is_api: z.boolean().optional(), // تم التعديل ليصبح checkbox
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

    pin: z.string().optional(),

    total_device: z.coerce.number().optional(),

    syriatel_code: z.string().optional(),
    mtn_code: z.string().optional(),

    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, {
        message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
      }),
    password_confirmation: z.string().optional(),
    sub_customers: z.array(z.union([z.string(), z.number()])).optional(),
    role: z
      .preprocess((val) => (val !== "" ? Number(val) : undefined), z.number())
      .refine((val) => !isNaN(val) && val > 0, {
        message: "يجب تحديد دور صالح.", // رسالة إذا لم يكن رقماً صالحاً أو أقل من 1
      })
      .or(
        z.literal(undefined).refine(() => false, { message: "الدور مطلوب." }),
      ),
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
  { title: "الاسم", id: "name", required: true, type: "text", pull: false },
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
    pull: false,
  },
  {
    title: "العنوان",
    id: "address",
    type: "text",
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
    type: "number",
    direction: "ltr",
  },
  {
    title: "PIN",
    id: "pin",
    required: false,
    type: "text",
    direction: "ltr",
  },
  {
    title: "اقل رصيد",
    id: "min_balance",
    type: "number",
    direction: "ltr",
  },
];

export default function EditCustomer({ isOpen, toggle, customerId }) {
  const {
    data: currentCustomer,
    isFetching: currentCustomerIsFetching,
    isSuccess: currentCustomerIsSuccess,
  } = useCustomerById(customerId);
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
    if (currentCustomerIsSuccess)
      reset({
        name: currentCustomer.data.user.name,
        email: currentCustomer.data.user.email,
        phone: currentCustomer.data.user.phone,
        password: "",
        password_confirmation: "",
        is_broker: !!currentCustomer.data.user.is_broker,
        is_api: !!currentCustomer.data.user.is_api,
        min_balance: currentCustomer.data.user.min_balance,
        city: currentCustomer.data.user.city,

        mtn_code: currentCustomer.data.user.mtn_code,
        syriatel_code: currentCustomer.data.user.syriatel_code,
        total_device: currentCustomer.data.user.total_device,

        address: currentCustomer.data.user.address,
        center_name: currentCustomer.data.user.center_name,
        sub_customers: currentCustomer.data.user.sub_customers,
        role: currentCustomer.data.user.roles[0],
      });
  }, [currentCustomer, currentCustomerIsFetching]);

  const watcher = watch();
  useEffect(() => {
    console.log("مراقب البيانات", watcher);
  }, [watcher]);

  const {
    mutate: editCustomer,
    isPending: editCustomerIsPending,
    isSuccess: editCustomerIsSuccess,
  } = useEditCustomer(customerId);

  // const { data: categories, isSuccess: categoriesIsSuccess } =
  //   useCategoriesWithFullPath();

  useEffect(() => {
    if (editCustomerIsSuccess) {
      toggle(false);
    }
  }, [editCustomerIsSuccess, toggle]);

  const onSubmit = (data) => {
    editCustomer(data);
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="small" title={"تعديل زبون"}>
      {!currentCustomerIsSuccess ||
      currentCustomerIsFetching ||
      customersHaventHolderIsFetching ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* <input type="password" name="password" id="" /> */}
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

            <Guard permission={"view_customer_groups"}>
              {rolesIsSuccess && (
                <DataList
                  title={"حدد مجموعة الزبون"}
                  data={roles?.data}
                  currentValue={watcher.role}
                  successFetch={rolesIsSuccess}
                  name={"role"}
                  rest={reset}
                  errors={errors}
                />
              )}
            </Guard>
          </div>

          {/* <CheckboxZod
            title={"تعين كمندوب"}
            name={"is_broker"}
            register={register}
            value={watcher.is_broker}
            errors={errors}
          />
          <CheckboxZod
            title={"السماح باستخدام الـ API"}
            name={"is_api"}
            register={register}
            value={watcher.is_api}
            errors={errors}
          /> */}

          {watcher.is_broker == true && (
            <MultiSelect
              apiResponse={
                customersHaventHolderIsSuccess && customersHaventHolder.data
              }
              title={"الزبائن المراد اضافتهم لهذا المندوب"}
              name={"sub_customers"}
              reset={reset}
              errors={errors}
              currentValue={watcher.sub_customers}
              successFetch={customersHaventHolderIsSuccess}
              loadingFetch={customersHaventHolderIsFetching}
            />
          )}

          <button
            type="submit"
            className="btn btn-primary mx-auto !py-1 w-20"
            disabled={editCustomerIsPending}
          >
            {editCustomerIsPending ? <Spinner sm /> : "تعديل"}
          </button>
        </form>
      )}
    </ActionModal>
  );
}
