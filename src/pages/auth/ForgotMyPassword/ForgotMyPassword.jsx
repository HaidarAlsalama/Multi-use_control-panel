import { useCheckOtp, useForgotMyPassword, useNewPass } from "api/Auth/auth";
import { Spinner } from "components";
import { createAlert } from "components/Alert/Alert";
import InputField from "components/InputField/InputField";
import { useState } from "react";

export default function ForgotMyPassword() {
  const {
    mutate: forgotMyPass,
    isPending: isPendingSendOTP,
    isSuccess: isSuccessSendOTP,
  } = useForgotMyPassword();

  const {
    mutate: chackOtp,
    isPending: isPendingChackOtp,
    isSuccess: isSuccessChackOtp,
  } = useCheckOtp();

  const {
    mutate: newPass,
    isPending: isPendingNewPass,
    isSuccess: isSuccessNewPass,
  } = useNewPass();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleSubmitForgotPass = async () => {
    if (!phone.length > 4) {
      createAlert("Warning", "يرجى ادخال رقم الموبايل متضمن نداء االبلد.");
      return;
    }

    forgotMyPass({ phone });
  };

  const handleCheckOtp = async () => {
    if (!phone.length > 4) {
      createAlert("Warning", "يرجى ادخال رقم الموبايل متضمن نداء االبلد.");
      return;
    }
    if (!otp.length === 6) {
      createAlert("Warning", "يجب ادخال رمز التحقق.");
      return;
    }

    chackOtp({ phone, otp_code: otp });
  };

  const handleNewPass = async () => {
    if (!phone.length > 4) {
      createAlert("Warning", "يرجى ادخال رقم الموبايل متضمن نداء االبلد.");
      return;
    }
    if (!otp.length === 6) {
      createAlert("Warning", "يجب ادخال رمز التحقق.");
      return;
    }
    if (pass.length < 8) {
      createAlert("Warning", "يجب ادخال كلمة مرور لا تقل عن 8 محارف.");
      return;
    }
    if (pass !== confirmPass) {
      createAlert("Warning", "لا يوجد تطابق بين كلمتي المرور.");
      return;
    }

    newPass({
      phone,
      otp_code: otp,
      new_password: pass,
      new_password_confirmation: confirmPass,
    });
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
          {!isSuccessChackOtp ? (
            <div className="flex flex-col gap-4">
              <InputField
                title={"رقم الموبايل"}
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.value)}
                direction="ltr"
                placeholder="9639xxxxxxxx"
              />
              {isSuccessSendOTP && (
                <InputField
                  title={"رمز التحقق"}
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.value)}
                  direction="ltr"
                />
              )}
              {!isSuccessSendOTP && (
                <button
                  onClick={handleSubmitForgotPass}
                  className="px-6 py-2 leading-5 mx-auto text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                >
                  {!isPendingSendOTP ? "ارسال رمز التحقق" : <Spinner sm />}
                </button>
              )}
              {isSuccessSendOTP && (
                <button
                  onClick={handleCheckOtp}
                  className="px-6 py-2 leading-5 mx-auto text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                >
                  {!isPendingChackOtp ? "تحقق من الرمز" : <Spinner sm />}
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <InputField
                title={"كلمة المرور الجديدة"}
                id="pass"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.value)}
                direction="ltr"
              />

              <InputField
                title={"تأكيد كلمة المرور"}
                id="confirmPass"
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.value)}
                direction="ltr"
              />

              <button
                onClick={handleNewPass}
                className="px-6 py-2 leading-5 mx-auto text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              >
                {!isPendingNewPass ? "تغيير كلمة المرور" : <Spinner sm />}
              </button>
            </div>
          )}
        </div>

        <div className="hidden md:block m-auto">
          <img
            src="/assets/images/logo.png"
            alt="logo"
            className="m-auto max-w-72"
          />
        </div>
      </section>
    </div>
  );
}
