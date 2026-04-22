import { zodResolver } from "@hookform/resolvers/zod";
import { useAddAds } from "api/admin/ads";
import { Spinner } from "components";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import TextEditor from "components/TextEditor/TextEditor";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";

const schema = z.object({
  title: z.string().nonempty("يرجى ادخال عنوان الاعلان."),
});

const fields = [
  {
    title: "العنوان",
    id: "title",
    required: true,
    type: "text",
  },
];

export default function AddAds({ isOpen, toggle }) {
  const [content, setContent] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    mutate: addAds,
    isPending: addAdsIsPending,
    isSuccess: addAdsIsSuccess,
  } = useAddAds();

  useEffect(() => {
    if (addAdsIsSuccess) {
      toggle(false);
    }
  }, [addAdsIsSuccess, toggle]);

  const onSubmit = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (content) formData.append("description", content);

    addAds(formData);
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="medium"
      title={"اضافة اعلان"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
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
        <TextEditor content={content} setContent={setContent} />
        <button
          type="submit"
          className="btn btn-primary mx-auto !py-1 w-20"
          disabled={addAdsIsPending}
        >
          {addAdsIsPending ? <Spinner sm /> : "إضافة"}
        </button>
      </form>
    </ActionModal>
  );
}
