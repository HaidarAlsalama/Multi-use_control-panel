import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCategoriesWithFullPath,
  useExternalProducts,
  useExternalResources,
} from "api/admin/category";
import { useCustomerGroup } from "api/admin/customerGroup";
import { useEditProduct, useProductById } from "api/admin/product";
import { Spinner } from "components";
import { CheckboxZod } from "components/InputField/CheckboxZod";
import DataList from "components/InputField/DataList";
import InputField from "components/InputField/InputField";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";
import CustomerPricingForm from "./CustomerPricingForm";
import FieldsGenerator from "./FieldsGenerator";
import ImageViewer from "components/ImageViewer/ImageViewer";
import TextEditor from "components/TextEditor/TextEditor";

const schema = z.object({
  name: z.string().nonempty("يرجى ادخال اسم التصنيف."),
  name_en: z.string().nonempty("يرجى ادخال اسم التصنيف."),
  description: z.string().optional(),
  description_en: z.string().optional(),
  category_id: z
    .any()
    .refine(
      (val) => val !== null && val !== undefined && !isNaN(val) && val > 0,
      {
        message: "يجب تحديد تصنيف",
      },
    ),
  external_resource_id: z.coerce
    .number()
    .refine((val) => val !== null && Number(val) > 0, {
      message: "حدد المصدر الخارجي",
    })
    .optional(),
  external_product_id: z.coerce
    .number()
    .refine((val) => val !== null && Number(val) > 0, {
      message: "حدد المنتج الخارجي",
    })
    .optional(),
  state: z.boolean().optional(),
  is_dynamic: z.boolean().optional(),
  is_quantity: z.boolean().optional(),
  repositry_state: z.boolean().optional(),
  prices: z.string().optional(),
  fields: z.string().optional(),
  price_dollar: z.coerce.number().optional(),
  price_lira: z.coerce.number().optional(),
  is_api: z.boolean().optional(),
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
  // {
  //   title: "الوصف",
  //   id: "description",
  //   required: false,
  //   type: "textarea",
  // },
  // {
  //   title: "الوصف بالانكليزية",
  //   id: "description_en",
  //   required: false,
  //   type: "textarea",
  //   direction: "ltr",
  // },
];

export default function EditProduct({ isOpen, toggle, productId }) {
  const [activeTab, setActiveTab] = useState("التفاصيل");
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // لحفظ التقدم

  const {
    data: customerGroup,
    isSuccess: customerGroupIsSuccess,
    isFetching: customerGroupIsIsLoading,
  } = useCustomerGroup();

  const {
    data: currentProduct,
    isSuccess: currentProductIsSuccess,
    isFetching: currentProductIsLoading,
    isError: currentProductIsError,
  } = useProductById(productId);

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
    if (currentProductIsSuccess)
      reset({
        name: currentProduct.data.products.name,
        name_en: currentProduct.data.products.name_en,
        description_en: currentProduct.data.products.description_en || "",
        description: currentProduct.data.products.description || "",
        category_id: undefined,
        state: currentProduct.data.products.state ? true : false,
        category_id: currentProduct.data.products.category.id,
        is_dynamic: currentProduct.data.products.is_dynamic ? true : false,
        is_quantity: currentProduct.data.products.is_quantity ? true : false,
        price_dollar: currentProduct.data.products.price_dollar,
        price_lira: currentProduct.data.products.price_lira,

        external_resource_id:
          currentProduct.data.products.external_resource_id || undefined,
        external_product_id:
          currentProduct.data.products.external_product_id || undefined,

        repositry_state: currentProduct.data.products.repositry_state
          ? true
          : false,

        is_api: currentProduct.data.products.is_api ? true : false,
      });
  }, [currentProduct]);

  const watcher = watch();

  // useEffect(() => {
  //   console.log("مراقب البيانات", watcher);
  // }, [watcher]);

  const {
    data: ExternalResources,
    isSuccess: ExternalResourcesIsSuccess,
    isLoading: ExternalResourcesIsIsLoading,
  } = useExternalResources();

  const {
    data: ExternalProducts,
    isSuccess: ExternalProductsIsSuccess,
    isLoading: ExternalProductsIsIsLoading,
  } = useExternalProducts(watcher.external_resource_id);

  const {
    mutate: editProduct,
    isPending: editProductIsPending,
    isSuccess: editProductIsSuccess,
  } = useEditProduct(setUploadProgress, productId);

  const { data: categories, isSuccess: categoriesIsSuccess } =
    useCategoriesWithFullPath();

  useEffect(() => {
    if (editProductIsSuccess) {
      toggle(false);
    }
  }, [editProductIsSuccess, toggle]);

  const onSubmit = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    if (image) formData.append("image", image);

    editProduct(formData);
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="medium"
      title={"تعديل منتج"}
    >
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {currentProductIsLoading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className={`${activeTab !== "التفاصيل" && "hidden"} space-y-4`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(
                ({ title, id, required, type, direction, className }) => (
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
                ),
              )}
            </div>
            <TextEditor
              title="الوصف"
              content={watcher.description}
              setContent={(temp) =>
                reset((prev) => {
                  return { ...prev, description: temp };
                })
              }
            />
            {/* <TextEditor
              title="الوصف بالانكليزية"
              content={watcher.description_en}
              setContent={(temp) =>
                reset((prev) => {
                  return { ...prev, description_en: temp };
                })
              }
            /> */}
            <div className="grid md:grid-cols-2 gap-4">
              <DataList
                title={"التصنيف"}
                data={categories?.data}
                successFetch={categoriesIsSuccess}
                currentValue={watcher.category_id}
                name={"category_id"}
                rest={reset}
                errors={errors}
                required
              />
              <DataList
                title={"المصدر الخارجي"}
                data={ExternalResources?.data}
                successFetch={ExternalResourcesIsSuccess}
                currentValue={watcher.external_resource_id}
                name={"external_resource_id"}
                rest={reset}
                errors={errors}
              />
            </div>
            {ExternalProductsIsSuccess && (
              <div className="grid grid-cols-1">
                <DataList
                  title={"المنتج الخارجي"}
                  data={ExternalProducts?.data}
                  successFetch={ExternalProductsIsSuccess}
                  currentValue={watcher.external_product_id}
                  name={"external_product_id"}
                  rest={reset}
                  errors={errors}
                />
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <CheckboxZod
                title={"منشور"}
                name={"state"}
                register={register}
                errors={errors}
                value={watcher.state}
              />
              {/* <CheckboxZod
                title={"كمية محدودة"}
                name={"repositry_state"}
                register={register}
                errors={errors}
                value={watcher.repositry_state}
              /> */}
              {/* <CheckboxZod
                title={"متاح لـ API"}
                name={"is_api"}
                register={register}
                errors={errors}
                value={watcher.is_api}
              /> */}
            </div>
            <ImageViewer
              imagePath={currentProduct.data.products.image}
              type={"product"}
              id={productId}
            />
            <InputField title={"الصورة"} type="file" onChange={setImage} />
          </div>

          <div className={`${activeTab !== "الاسعار" && "hidden"}`}>
            {customerGroupIsIsLoading && <Spinner page />}
            {customerGroupIsSuccess && (
              <CustomerPricingForm
                customers={customerGroup.data}
                register={register}
                errors={errors}
                reset={reset}
                initialData={currentProduct.data.products.prices}
                isDynamic={watcher.is_dynamic}
              />
            )}
          </div>

          <div className={`${activeTab !== "معالج الحقول" && "hidden"}`}>
            <FieldsGenerator
              reset={reset}
              initialFields={JSON.parse(currentProduct.data.products.fields)}
            />
          </div>

          {editProductIsPending && (
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
            disabled={editProductIsPending}
          >
            {editProductIsPending ? <Spinner sm /> : "تعديل"}
          </button>
        </form>
      )}
    </ActionModal>
  );
}

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: "التفاصيل", disabled: false },
    { name: "الاسعار", disabled: false },
    { name: "معالج الحقول", disabled: false },
  ];

  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        {tabs.map((tab) => (
          <li key={tab.name} className="me-2">
            {tab.disabled ? (
              <span className="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">
                {tab.name}
              </span>
            ) : (
              <button
                onClick={() => setActiveTab(tab.name)}
                className={`inline-block p-4 border-b-2 rounded-t-lg transition ${
                  activeTab === tab.name
                    ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
              >
                {tab.name}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
