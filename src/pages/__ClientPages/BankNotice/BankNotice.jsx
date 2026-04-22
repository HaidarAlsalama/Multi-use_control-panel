import { zodResolver } from "@hookform/resolvers/zod";
import { UseAddBalance, useAvailableBanks } from "api/Client/balance";
import { createAlert } from "components/Alert/Alert";
import ClientInputFieldZod from "components/ClientLayoutPages/ClientInputField/ClientInputFieldZod";
import Container from "components/ClientLayoutPages/Container/Container";
import NavigationCard from "components/ClientLayoutPages/NavigationCard/NavigationCard";
import NavigationCardContainer from "components/ClientLayoutPages/NavigationCard/NavigationCardContainer";
import InputField from "components/ClientLayoutPages/ClientInputField/InputField";
import SkeletonList from "components/SkeletonList/SkeletonList";
import useParam from "Hooks/useParam";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "components";
import { useExchangeRate } from "api/admin/exchangeRate";
import { useSelector } from "react-redux";

const registrationSchema = z.object({
  notify_number: z.string().min(1, "رقم الأشعار مطلوب"),
  amount: z.coerce.number().refine((val) => val > 0, {
    message: "المبلغ مطلوب",
  }),
});

const fieldsZod = [
  {
    label: "رقم الإشعار",
    id: "notify_number",
    autoComplete: "off",
    required: true,
    type: "text",
  },
  {
    label: "المبلغ",
    id: "amount",
    autoComplete: "off",
    required: true,
    type: "number",
  },
  // {
  //   label: "العمولة",
  //   id: "commission_percentage",
  //   type: "number",
  //   disabled: true,
  // },
  {
    label: "المبلغ المضاف لحسابك",
    id: "total",
    type: "number",
    disabled: true,
    // pull: true,
  },
];
export default function BankNotice() {
  const bankId = useParam("bankId");
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // لحفظ التقدم
  const { currency: userCurrency } = useSelector((state) => state.balance);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const {
    data: banks,
    isLoading: banksIsLoading,
    isSuccess: banksIsSuccess,
    // isError: banksIsError,
  } = useAvailableBanks();

  const {
    data: exchangeRate,
    // isLoading: exchangeRateIsLoading,
    isSuccess: exchangeRateIsSuccess,
  } = useExchangeRate();

  const {
    mutate: addBalance,
    isPending: addBalanceIsPending,
    isSuccess: addBalanceIsSuccess,
  } = UseAddBalance(setUploadProgress);

  const watcher = watch();

  useEffect(() => {
    console.log("مراقب البيانات", watcher);
  }, [watcher]);

  useEffect(() => {
    if (banksIsSuccess && bankId) {
      reset({
        notify_number: null,
        amount: null,
        commission_percentage: banks.data.find((x) => x.id == bankId)
          ?.commission_percentage,
        commission_percentage: banks.data.find((x) => x.id == bankId)
          ?.commission_percentage,
        total: null,
      });
    }
  }, [banks, bankId]);

  useEffect(() => {
    let total;
    if (
      banks?.data.find((x) => x.id == bankId)?.currency == "USD" &&
      exchangeRateIsSuccess
    ) {
      if (userCurrency == "USD") {
        total = watcher.amount - watcher.amount * watcher.commission_percentage;
      } else if (userCurrency == "S.P") {
        total =
          (watcher.amount - watcher.amount * watcher.commission_percentage) *
          exchangeRate?.data?.purchase_price;
      }
    } else if (banks?.data.find((x) => x.id == bankId)?.currency == "S.P") {
      total = watcher.amount - watcher.amount * watcher.commission_percentage;
    }

    reset((prev) => {
      return {
        ...prev,
        total: total,
      };
    });
  }, [watcher.amount]);

  useEffect(() => {
    if (addBalanceIsSuccess && bankId) {
      reset({
        notify_number: null,
        amount: null,
        commission_percentage: banks.data.find((x) => x.id == bankId)
          ?.commission_percentage,
        total: null,
      });
      setImage(null);
    }
  }, [addBalanceIsSuccess]);

  const onSubmit = (data) => {
    if (!image) {
      createAlert("Warning", "يرجى ادخال صورة الاشعار");
      return;
    }
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    formData.append("bank_id", bankId);
    formData.append("notify_image", image);

    addBalance(formData);
  };

  return (
    <Container title={`إضافة رصيد`}>
      {banksIsLoading ? (
        <SkeletonList number={8} top />
      ) : banksIsSuccess && !bankId ? (
        <>
          <h1 className="text-white mb-4 text-center text-xl bg-yellow-500 py-2 px-4 rounded-md shadow-md">
            اختر طريقة الدفع
          </h1>
          <NavigationCardContainer>
            {banks.data.map((bank) => (
              <NavigationCard
                key={bank.id}
                {...{ ...bank, link: `?bankId=${bank.id}` }}
              />
            ))}
          </NavigationCardContainer>
        </>
      ) : banksIsSuccess && bankId ? (
        <>
          <h1 className="text-white mb-4  text-center bg-yellow-500 py-2 px-4 rounded-md shadow-md">
            الدفع عن طريق:{" "}
            <span>
              {banksIsSuccess && banks.data.find((x) => x.id == bankId)?.name}
            </span>
          </h1>
          {banks.data.find((x) => x.id == bankId)?.description &&
            banks.data.find((x) => x.id == bankId)?.description !=
              `<p><br></p>` && (
              <div
                className="bg-zinc-800 p-4 text-white rounded-md mb-4"
                dangerouslySetInnerHTML={{
                  __html: banks.data.find((x) => x.id == bankId)?.description,
                }}
              />
            )}
          <form
            className="bg-zinc-800 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 rounded-md"
            onSubmit={handleSubmit(onSubmit)}
          >
            {fieldsZod.map((field) => (
              <ClientInputFieldZod
                key={field.id}
                name={field.id}
                label={field.label}
                register={register}
                type={field.type}
                required={field.required}
                autoComplete={field.autoComplete}
                errors={errors}
                direction="ltr"
                pull={field.pull}
                options={field.options}
                disabled={field.disabled}
              />
            ))}
            <div className="flex flex-col gap-4 md:col-span-3">
              <InputField
                title={"صورة الاشعار"}
                type="file"
                onChange={setImage}
                pull
              />
              {addBalanceIsPending && (
                <div className="w-full md:col-span-2 mt-2 bg-zinc-700 rounded-full h-2.5 ">
                  <div
                    className="bg-yellow-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-smart md:col-span-2 mx-auto mt-4 w-40"
                disabled={addBalanceIsPending}
              >
                {addBalanceIsPending ? <Spinner sm /> : "ارسال"}
              </button>
            </div>
          </form>
        </>
      ) : null}
    </Container>
  );
}
