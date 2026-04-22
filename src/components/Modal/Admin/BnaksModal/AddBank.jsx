import { zodResolver } from "@hookform/resolvers/zod";
import { useAddBank } from "api/admin/bank";
import { Spinner } from "components";
import InputField from "components/InputField/InputField";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import TextEditor from "components/TextEditor/TextEditor";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";

const schema = z.object({
  name: z.string().nonempty("يرجى ادخال اسم البنك."),
  name_en: z.string().nonempty("يرجى ادخال اسم البنك بالانكليزية."),
  commission_percentage: z
    .number()
    .or(
      z
        .string()
        .regex(
          /^-?\d+(\.\d{1,5})?$/,
          "يجب أن تكون العمولة رقمًا بصيغة صحيحة (مثل 10 أو -10.50001)."
        )
    ),

  currency: z.enum(["S.P", "USD", ""]).refine((val) => val !== "", {
    message: "يرجى اختيار العملة من القائمة المحددة.",
  }),
});
const fields = [
  {
    title: "الاسم",
    id: "name",
    required: true,
    type: "text",
  },
  {
    title: "الاسم بالانكليزية",
    id: "name_en",
    required: true,
    type: "text",
    direction: "ltr",
  },
  {
    title: "العمولة",
    id: "commission_percentage",
    required: true,
    type: "number",
    direction: "ltr",
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
];

export default function AddBank({ isOpen, toggle }) {
  const [image, setImage] = useState(null);
  const [content, setContent] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // لحفظ التقدم
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // useEffect(() => {
  //   reset({
  //     name: "",
  //     name_en: "",
  //     description_en: "",
  //     description: "",
  //     parentId: parentId || undefined,
  //   });
  // }, [reset]);

  const {
    mutate: addBank,
    isPending: addBankIsPending,
    isSuccess: addBankIsSuccess,
  } = useAddBank(setUploadProgress);

  useEffect(() => {
    if (addBankIsSuccess) {
      toggle(false);
    }
  }, [addBankIsSuccess, toggle]);

  const onSubmit = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (image) formData.append("image", image);
    if (content) formData.append("description", content);

    addBank(formData);
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="medium" title={"اضافة بنك"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(
            ({ title, id, required, type, direction, className, options }) => (
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
                options={options}
              />
            )
          )}
        </div>

        <TextEditor
          title={"التفاصيل"}
          content={content}
          setContent={setContent}
        />

        <InputField title={"الصورة"} type="file" onChange={setImage} />

        {addBankIsPending && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary mx-auto !py-1 w-20"
          disabled={addBankIsPending}
        >
          {addBankIsPending ? <Spinner sm /> : "إضافة"}
        </button>
      </form>
    </ActionModal>
  );
}
