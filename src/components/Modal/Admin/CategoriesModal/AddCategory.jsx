import { zodResolver } from "@hookform/resolvers/zod";
import { useAddCategory, useCategoriesWithFullPath } from "api/admin/category";
import { Spinner } from "components";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";
import DataList from "components/InputField/DataList";
import InputField from "components/InputField/InputField";

const schema = z.object({
  name: z.string().nonempty("يرجى ادخال اسم التصنيف."),
  name_en: z.string().nonempty("يرجى ادخال اسم التصنيف."),
  description: z.string().optional(),
  description_en: z.string().optional(),
  parentId: z.coerce
    .number()
    .refine((val) => val !== null && Number(val) > 0, {
      message: "Please select Category", // الرسالة نفسها إذا كانت null أو <= 0
    })
    .optional(),
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
    title: "الوصف",
    id: "description",
    required: false,
    type: "textarea",
  },
  {
    title: "الوصف بالانكليزية",
    id: "description_en",
    required: false,
    type: "textarea",
    direction: "ltr",
  },
];

export default function AddCategory({ isOpen, toggle, parentId }) {
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // لحفظ التقدم
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
      name_en: "",
      description_en: "",
      description: "",
      parentId: parentId || undefined,
    });
  }, [parentId]);

  const {
    mutate: addCategory,
    isPending: addCategoryIsPending,
    isSuccess: addCategoryIsSuccess,
  } = useAddCategory(setUploadProgress);

  const { data: categories, isSuccess: categoriesIsSuccess } =
    useCategoriesWithFullPath();

  useEffect(() => {
    if (addCategoryIsSuccess) {
      toggle(false);
    }
  }, [addCategoryIsSuccess, toggle]);

  const onSubmit = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (image) formData.append("image", image);

    addCategory(formData);
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="small"
      title={"اضافة تصنيف"}
    >
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
        <DataList
          title={"التصنيف"}
          data={categories?.data}
          successFetch={categoriesIsSuccess}
          currentValue={parentId}
          name={"parentId"}
          rest={reset}
          errors={errors}
          placeHolder="اتركه فارغا اذا كان تصنيف رئيسي"
        />
        <InputField title={"الصورة"} type="file" onChange={setImage} />

        {addCategoryIsPending && (
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
          disabled={addCategoryIsPending}
        >
          {addCategoryIsPending ? <Spinner sm /> : "إضافة"}
        </button>
      </form>
    </ActionModal>
  );
}
