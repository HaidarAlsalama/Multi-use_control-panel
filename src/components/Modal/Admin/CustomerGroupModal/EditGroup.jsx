import { zodResolver } from "@hookform/resolvers/zod";
import { useCustomerGroup, useEdditGroup } from "api/admin/customerGroup";
import { Spinner } from "components";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TiWarning } from "react-icons/ti";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";

const schema = z.object({
  name: z.string().nonempty("يرجى ادخال اسم التصنيف."),
});

const fields = [{ title: "الاسم", id: "name", required: true, type: "text" }];

export default function EditGroup({ isOpen, toggle, groupId }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    data: currentGroup,
    isSuccess: currentGroupIsSuccess,
    isLoading: currentGroupIsLoading,
    isError: currentGroupIsError,
  } = useCustomerGroup(groupId);

  useEffect(() => {
    if (currentGroupIsSuccess) {
      reset({ name: currentGroup.data.name });
    }
  }, [currentGroup]);

  const {
    mutate: editGroup,
    isPending: editGroupIsPending,
    isSuccess: editGroupIsSuccess,
  } = useEdditGroup(groupId);

  useEffect(() => {
    if (editGroupIsSuccess) {
      toggle(false);
    }
  }, [editGroupIsSuccess, toggle]);

  const onSubmit = (data) => {
    editGroup(data);
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="small"
      title={"تعديل تصنيف"}
    >
      {currentGroupIsLoading ? (
        <Spinner />
      ) : !currentGroupIsError ? (
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
            disabled={editGroupIsPending}
          >
            {editGroupIsPending ? <Spinner sm /> : "تعديل"}
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
