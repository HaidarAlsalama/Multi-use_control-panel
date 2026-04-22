import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCategoriesWithFullPath,
  useCategoryById,
  useEditCategory,
} from "api/admin/category";
import { Spinner } from "components";
import DataList from "components/InputField/DataList";
import InputField from "components/InputField/InputField";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TiWarning } from "react-icons/ti";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";
import ImageViewer from "components/ImageViewer/ImageViewer";
import { CheckboxZod } from "components/InputField/CheckboxZod";

const schema = z.object({
  name: z.string().nonempty("يرجى ادخال اسم التصنيف."),
  name_en: z.string().nonempty("يرجى ادخال اسم التصنيف."),
  description: z.string().optional(),
  description_en: z.string().optional(),
  parent_id: z
    .number()
    .refine((val) => val !== null && Number(val) > 0, {
      message: "Please select Category", // الرسالة نفسها إذا كانت null أو <= 0
    })
    .optional(),
  is_api: z.boolean().optional(),
});

const fields = [
  { title: "الاسم", id: "name", required: true, type: "text" },
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

export default function EditCategory({ isOpen, toggle, idCategory }) {
  const [image, setImage] = useState(null);
  const {
    data: currentCategory,
    isSuccess: currentCategoryIsSuccess,
    isFetching: currentCategoryIsLoading,
    isError: currentCategoryIsError,
  } = useCategoryById(idCategory);

  const { data: categories, isSuccess: categoriesIsSuccess } =
    useCategoriesWithFullPath();

  const {
    mutate: editCategory,
    isPending: editCategoryIsPending,
    isSuccess: editCategoryIsSuccess,
  } = useEditCategory(idCategory);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const watcher = watch();

  useEffect(() => {
    if (currentCategoryIsSuccess) {
      reset({
        name: currentCategory?.data.name,
        name_en: currentCategory?.data.name_en,
        description: currentCategory?.data.description || "",
        description_en: currentCategory?.data.description_en || "",
        parent_id: currentCategory?.data.parent_id || undefined,

        is_api: currentCategory?.data.is_api ? true : false,
      });
    }
  }, [currentCategoryIsSuccess, currentCategoryIsLoading]);

  useEffect(() => {
    if (editCategoryIsSuccess) {
      reset();
      toggle(false);
    }
  }, [editCategoryIsSuccess, reset, toggle]);
  // useEffect(() => {
  //   console.log(watcher);
  // }, [watcher]);

  const onSubmit = (data) => {
    const formData = new FormData();
    console.log(data);

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        formData.append(key, value);
      } else {
        formData.append(key, value ?? "");
      }
    });

    if (image) formData.append("image", image);
    editCategory(formData);
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="small"
      title={"تعديل تصنيف"}
    >
      {currentCategoryIsLoading ? (
        <Spinner />
      ) : !currentCategoryIsError ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(({ title, id, required, type, direction }) => (
              <InputFieldZod
                key={id}
                title={title}
                name={id}
                required={required}
                type={type}
                register={register}
                errors={errors}
                direction={direction || "rtl"}
              />
            ))}
          </div>
          <DataList
            title={"التصنيف"}
            data={categories?.data}
            successFetch={categoriesIsSuccess}
            currentValue={watcher.parent_id}
            name={"parent_id"}
            rest={reset}
            errors={errors}
            placeHolder="اتركه فارغا اذا كان تصنيف رئيسي"
          />
          {/* <CheckboxZod
              title={"متاح لـ API"}
              name={"is_api"}
              register={register}
              errors={errors}
              value={watcher.is_api}
            /> */}
          <ImageViewer
            imagePath={currentCategory?.data.image}
            type={"category"}
            id={idCategory}
          />
          <InputField title={"الصورة"} type="file" onChange={setImage} />

          <button
            type="submit"
            className="btn btn-primary mx-auto !py-1 w-20"
            disabled={editCategoryIsPending}
          >
            {editCategoryIsPending ? <Spinner sm /> : "تعديل"}
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
