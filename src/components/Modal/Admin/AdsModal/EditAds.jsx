import { zodResolver } from "@hookform/resolvers/zod";
import { useAdsById, useEditAds } from "api/admin/ads";
import { Spinner } from "components";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import TextEditor from "components/TextEditor/TextEditor";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TiWarning } from "react-icons/ti";
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

export default function EditAds({ isOpen, toggle, adsId }) {
  const [content, setContent] = useState("");

  const {
    data: currentAds,
    isSuccess: currentAdsIsSuccess,
    isFetching: currentAdsIsLoading,
    isError: currentAdsIsError,
  } = useAdsById(adsId);

  const {
    mutate: editAds,
    isPending: editAdsIsPending,
    isSuccess: editAdsIsSuccess,
  } = useEditAds(adsId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (currentAdsIsSuccess) {
      reset({
        title: currentAds?.data.ads.title,
      });
      setContent(currentAds?.data.ads.description);
    }
  }, [currentAdsIsSuccess, currentAds]);

  useEffect(() => {
    if (editAdsIsSuccess) {
      reset();
      toggle(false);
    }
  }, [editAdsIsSuccess, reset, toggle]);

  const onSubmit = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (content) formData.append("description", content);
    editAds(formData);
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="medium"
      title={"تعديل إعلان"}
    >
      {currentAdsIsLoading ? (
        <Spinner />
      ) : !currentAdsIsError ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
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
          <TextEditor content={content} setContent={setContent} />

          <button
            type="submit"
            className="btn btn-primary mx-auto !py-1 w-20"
            disabled={editAdsIsPending}
          >
            {editAdsIsPending ? <Spinner sm /> : "تعديل"}
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
