import { useLogin, useLoginCustomer } from "api/Auth/auth";
import { Spinner } from "components";
import { createAlert } from "components/Alert/Alert";
import InputField from "components/InputField/InputField";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { role } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLoginCustomer();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (role === "customer") navigate("/my-account");
  }, [role, navigate]);

  const handleSubmitLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      createAlert("Warning", "جميع الحقول مطلوبة.");
      return;
    }

    login({ email, password });
  };

  return (
    <div className="min-h-screen_ grid md:grid-cols-2">
      {/* LEFT SIDE */}
      <div
        className="hidden md:flex flex-col justify-center items-center 
        bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600
        text-white p-10"
      >
        <img src="/assets/images/logo.png" alt="Logo" className="w-40 mb-6" />

        <h1 className="text-4xl font-bold mb-4 text-center">
          أهلاً بك مجدداً 👋
        </h1>

        <p className="text-lg opacity-90 text-center max-w-md">
          سجل دخولك لإدارة حسابك والوصول إلى جميع الخدمات بسهولة وأمان.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6">
        <div
          className="w-full max-w-md bg-white dark:bg-gray-800 
          rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            تسجيل الدخول
          </h2>

          <form onSubmit={handleSubmitLogin} className="flex flex-col gap-4">
            <InputField
              title="البريد الالكتروني"
              id="emailAddress"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.value)}
              direction="ltr"
            />

            <InputField
              title="كلمة المرور"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.value)}
              direction="ltr"
            />

            <button
              type="submit"
              className="mt-4 w-full py-3 rounded-xl
                bg-green-600 hover:bg-green-700
                text-white font-semibold
                transition duration-300"
            >
              {!isPending ? "دخول" : <Spinner sm />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
