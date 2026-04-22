import { useLogin } from "api/Auth/auth";
import { Spinner } from "components";
import { createAlert } from "components/Alert/Alert";
import InputField from "components/InputField/InputField";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { role } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (role === "admin") navigate("/dashboard");
    if (role === "customer") navigate("/my-account");
  }, [role, navigate]);

  const handleSubmitLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      createAlert("Warning", "جميع الحقول مطلوبة.");
      return;
    }

    // if (password.length < 8) {
    //   createAlert("Warning", "كلمة المرور يجب ان تكون اكثر من 8 محارف.");
    //   return;
    // }

    login({ email, password });
  };

  return (
    <div className="relative  flex items-center justify-center overflow-hidden ">
      {/* Blobs */}

      {/* Card */}
      <section
        className="relative z-10 grid grid-cols-1 md:grid-cols-2_ w-full max-w-3xl p-8 md:mx-4
        bg-white/20 dark:bg-white/5
        backdrop-blur-xl
        border border-white/30 dark:border-white/10
        md:rounded-2xl shadow-2xl gap-4"
      >
        {/* Logo */}
        <div className="hidden_ _md: flex items-center justify-center">
          <img
            src="/assets/images/logo.png"
            alt="Logo"
            className="max-w-64 drop-shadow-xl"
          />
        </div>
        {/* Form */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
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

            {/* <div className="text-sm text-gray-700 dark:text-gray-200 flex flex-col gap-1">
              <span>
                هل نسيت كلمة المرور؟{" "}
                <Link
                  to="/forgot-my-password"
                  className="text-green-400 font-bold hover:underline"
                >
                  اضغط هنا
                </Link>
              </span>

              <span>
                ليس لديك حساب؟{" "}
                <Link
                  to="/register"
                  className="text-green-400 font-bold hover:underline"
                >
                  سجل من هنا
                </Link>
              </span>
            </div> */}

            <button
              className="mt-2 mx-auto px-8 py-2 rounded-xl
                bg-green-400/90 hover:bg-green-500
                text-gray-900 font-bold
                shadow-lg transition-all h-10 w-32"
            >
              {!isPending ? "دخول" : <Spinner sm />}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
