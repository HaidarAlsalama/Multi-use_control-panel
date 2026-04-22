import { zodResolver } from "@hookform/resolvers/zod";
import { useAddGroup } from "api/admin/customerGroup";
import { Spinner } from "components";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";

const schema = z.object({
  name: z.string().nonempty("يرجى ادخال اسم التصنيف."),
});

const fields = [{ title: "الاسم", id: "name", required: true, type: "text" }];

export default function AddGroup({ isOpen, toggle }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    mutate: addGroup,
    isPending: addGroupIsPending,
    isSuccess: addGroupIsSuccess,
  } = useAddGroup();

  useEffect(() => {
    if (addGroupIsSuccess) {
      toggle(false);
    }
  }, [addGroupIsSuccess, toggle]);

  const onSubmit = (data) => {
    addGroup(data);
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="small"
      title={"اضافة تصنيف زبائن"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

        <button
          type="submit"
          className="btn btn-primary mx-auto !py-1 w-20 h-7"
          disabled={addGroupIsPending}
        >
          {addGroupIsPending ? <Spinner sm /> : "إضافة"}
        </button>
      </form>
    </ActionModal>
  );
}
