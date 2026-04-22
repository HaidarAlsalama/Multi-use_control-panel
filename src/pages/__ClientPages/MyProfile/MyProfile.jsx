import { zodResolver } from "@hookform/resolvers/zod";
import ClientInputFieldZod from "components/ClientLayoutPages/ClientInputField/ClientInputFieldZod";
import Container from "components/ClientLayoutPages/Container/Container";
import { InputFieldZod } from "components/InputField/InputFieldZod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

const tempSchema = z.object({});

export default function MyProfile() {
  const { roles, name, email, phone } = useSelector((state) => state.auth);
  const { currency, balance, centerName, address, city } = useSelector(
    (state) => state.balance,
  );
  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tempSchema),
  });

  return (
    <Container title="حسابي">
      <div className="bg-mainLight/20 border border-mainLight shadow-md p-4 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-md">
        <ClientInputFieldZod
          disabled={true}
          label={"الاسم الثلاثي"}
          name={"full_name"}
          type={"text"}
          register={register}
          errors={errors}
          direction={"rtl"}
          value={name}
        />
        <ClientInputFieldZod
          disabled={true}
          label={"التصنيف"}
          name={"role"}
          type={"text"}
          register={register}
          errors={errors}
          direction={"rtl"}
          // value={roles[0]?.name}
        />
        <ClientInputFieldZod
          disabled={true}
          label={"اسم المركز"}
          name={"center_name"}
          type={"text"}
          register={register}
          errors={errors}
          direction={"rtl"}
          value={centerName}
        />
        <ClientInputFieldZod
          disabled={true}
          label={"رقم الموبايل"}
          name={"mobile"}
          type={"text"}
          register={register}
          errors={errors}
          direction={"ltr"}
          value={phone}
        />
        <ClientInputFieldZod
          disabled={true}
          label={"الايميل"}
          name={"email"}
          type={"email"}
          register={register}
          errors={errors}
          direction={"ltr"}
          value={email}
        />
        <ClientInputFieldZod
          disabled={true}
          label={"المدينة"}
          name={"city"}
          type={"text"}
          register={register}
          errors={errors}
          direction={"rtl"}
          value={city}
        />
        <ClientInputFieldZod
          disabled={true}
          label={"الموقع"}
          name={"location"}
          type={"text"}
          register={register}
          errors={errors}
          direction={"rtl"}
          value={address}
        />
        <ClientInputFieldZod
          disabled={true}
          label={"العملة"}
          name={"currency"}
          type={"text"}
          register={register}
          errors={errors}
          direction={"ltr"}
          value={currency}
        />
        <ClientInputFieldZod
          disabled={true}
          label={"الرصيد الحالي"}
          name={"balance"}
          type={"text"}
          register={register}
          errors={errors}
          direction={"ltr"}
          value={balance}
        />
        <ClientInputFieldZod
          disabled={true}
          label={"اللغة"}
          name={"lang"}
          type={"text"}
          register={register}
          errors={errors}
          direction={"ltr"}
          value={"ar"}
        />
      </div>
    </Container>
  );
}
