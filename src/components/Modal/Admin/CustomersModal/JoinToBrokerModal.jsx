import { zodResolver } from "@hookform/resolvers/zod";
import { useCustomerById } from "api/admin/customer";
import { useAddOrJointoBroker, useBrokers } from "api/admin/mandob";
import { Spinner } from "components";
import DataList from "components/InputField/DataList";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionModal from "../../ActionModal/ActionModal";

const schema = z.object({
  parent_id: z.coerce
    .number()
    .refine((val) => val !== null && Number(val) > 0, {
      message: "يرجى تحديد الوكيل", // الرسالة نفسها إذا كانت null أو <= 0
    })
    .optional(),
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
];

export default function JoinToBrokerModal({ isOpen, toggle, customerId }) {
  const {
    data: currentCustomer,
    isFetching: currentCustomerIsFetching,
    isSuccess: currentCustomerIsSuccess,
  } = useCustomerById(customerId);

  const {
    data: brokers,
    isSuccess: brokersIsSuccess,
    isFetching: brokersIsIsFetching,
  } = useBrokers();

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
        parent_id: currentCustomer.data.user.parent_id,
        center_name: currentCustomer.data.user.center_name,
      });
  }, [currentCustomer]);

  const watcher = watch();
  useEffect(() => {
    console.log("مراقب البيانات", watcher);
  }, [watcher]);

  const {
    mutate: addOrMoveCustomer,
    isPending: addOrMoveCustomerIsPending,
    isSuccess: addOrMoveCustomerIsSuccess,
  } = useAddOrJointoBroker(currentCustomer?.data?.user?.id);

  useEffect(() => {
    if (addOrMoveCustomerIsSuccess) toggle(false);
  }, [addOrMoveCustomerIsSuccess, toggle]);

  const onSubmit = (data) => {
    addOrMoveCustomer(data);
  };

  return (
    <ActionModal
      open={isOpen}
      close={toggle}
      size="small"
      title={"ضم زبون لوكيل"}
    >
      {!currentCustomerIsSuccess ||
      currentCustomerIsFetching ||
      brokersIsIsFetching ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* <input type="password" name="password" id="" /> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(({ title, id, type }) => (
              <InputFieldZod
                key={id}
                title={title}
                name={id}
                type={type}
                register={register}
                errors={errors}
                disabled
              />
            ))}

            {brokersIsSuccess && (
              <DataList
                title={"الوكيل"}
                data={brokers?.data}
                currentValue={watcher.parent_id}
                successFetch={brokersIsSuccess}
                name={"parent_id"}
                rest={reset}
                errors={errors}
                className="md:col-span-2"
              />
            )}
          </div>

          {watcher.parent_id && (
            <button
              className="btn btn-danger"
              onClick={() =>
                reset((prev) => {
                  return { ...prev, parent_id: undefined };
                })
              }
            >
              الغاء انضمامه لأي وكيل
            </button>
          )}

          <button
            type="submit"
            className="btn btn-primary mx-auto !py-1 w-20"
            disabled={addOrMoveCustomerIsPending}
          >
            {addOrMoveCustomerIsPending ? <Spinner sm /> : "تعديل"}
          </button>
        </form>
      )}
    </ActionModal>
  );
}
