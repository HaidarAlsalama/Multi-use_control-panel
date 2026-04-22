import { useLogin } from "api/Auth/auth";
import { Spinner } from "components";
import { createAlert } from "components/Alert/Alert";
import InputField from "components/InputField/InputField";
import { useEffect, useState } from "react";
import fingerprint from "./../../../assets/images/4.png";

export default function ForgotMyPassword() {
  const { mutate: login, data, isPending, isSuccess, isError } = useLogin();
  const [onSendRequest, setOnSendRequest] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (isError) setOnSendRequest(false);
  }, [isError]);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (onSendRequest) return;
    setOnSendRequest(true);

    if (!phone.length === 12) {
      createAlert("Warning", "يرجى ادخال رقم الموبايل متضمن نداء االبلد.");
      setOnSendRequest(false);
      return;
    }

    login({ phone });
  };

  return (
    <div
      className="flex justify-center items-center w-full md:p-2 overflow-hidden"
      id="login-page"
    >
      <div
        className="absolute z-0 w-full max-w-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg transform 
      -skew-y-6 md:skew-y-0 md:-rotate-3 md:rounded-md"
      ></div>

      <section className="grid md:grid-cols-2 w-full relative max-w-3xl p-6 mx-auto bg-white md:rounded-md shadow-md dark:bg-gray-800 my-auto md:my-6 h-80">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-700 dark:text-white">
            نسيت كلمة المرور
          </h2>
          <form onSubmit={handleSubmitLogin} className="flex flex-col gap-4">
            <InputField
              title={"رقم الموبايل"}
              id="emailAddress"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.value)}
              direction="ltr"
            />
            <InputField
              title={"الرمز"}
              id="otp"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.value)}
              direction="ltr"
            />
            {!isPending ? (
              <button className="px-6 py-2 leading-5 mx-auto text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                {" "}
                تأكيد
              </button>
            ) : (
              <Spinner />
            )}{" "}
          </form>
        </div>

        <div className="hidden md:block m-auto">
          <img src={fingerprint} alt="" className="m-auto max-w-72" />
        </div>
      </section>
    </div>
  );
}
