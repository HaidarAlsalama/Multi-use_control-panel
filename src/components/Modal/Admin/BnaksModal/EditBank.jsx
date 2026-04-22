import { zodResolver } from "@hookform/resolvers/zod";
import { useBankById, useEditBank } from "api/admin/bank";
import { Spinner } from "components";
import InputField from "components/InputField/InputField";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TiWarning } from "react-icons/ti";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";
import ImageViewer from "components/ImageViewer/ImageViewer";
import TextEditor from "components/TextEditor/TextEditor";

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

export default function EditBank({ isOpen, toggle, bankId }) {
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0); // لحفظ التقدم

  const {
    data: currentBank,
    isSuccess: currentBankIsSuccess,
    isFetching: currentBankIsLoading,
    isError: currentBankIsError,
  } = useBankById(bankId);

  const {
    mutate: editBank,
    isPending: editBankIsPending,
    isSuccess: editBankIsSuccess,
  } = useEditBank(bankId, setUploadProgress);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (currentBankIsSuccess) {
      reset({
        name: currentBank?.data.banks.name,
        name_en: currentBank?.data.banks.name_en,
        commission_percentage: currentBank?.data.banks.commission_percentage,
        currency: currentBank?.data.banks.currency,
      });
      setContent(currentBank?.data.banks.description);
    }
  }, [currentBankIsSuccess, currentBank]);

  useEffect(() => {
    if (editBankIsSuccess) {
      reset();
      toggle(false);
    }
  }, [editBankIsSuccess, reset, toggle]);

  const onSubmit = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (image) formData.append("image", image);
    if (content) formData.append("description", content);

    editBank(formData);
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="medium" title={"تعديل بنك"}>
      {currentBankIsLoading ? (
        <Spinner />
      ) : !currentBankIsError ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(
              ({
                title,
                id,
                required,
                type,
                direction,
                className,
                options,
              }) => (
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
          <ImageViewer
            imagePath={`/storage/${currentBank?.data.banks.image}`}
            type={"bank"}
            id={bankId}
          />
          <InputField title={"الصورة"} type="file" onChange={setImage} />

          {editBankIsPending && (
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
            disabled={editBankIsPending}
          >
            {editBankIsPending ? <Spinner sm /> : "تعديل"}
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
