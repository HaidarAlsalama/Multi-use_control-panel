import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

export default function Error401({ navigateTo = "/", timer = null }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    let timeOut;

    // إذا كان يوجد timer مفعّل، نقوم بالتوجيه بعد الوقت المحدد
    if (timer !== null) {
      timeOut = setTimeout(() => {
        navigate(navigateTo);
      }, timer); // نستخدم القيمة المرسلة في timer
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [timer, navigateTo, navigate]);

  return (
    <div className="flex self-start justify-center items-center w-full md:p-2 mt-5">
      <section className="w-full max-w-5xl p-6 flex flex-col items-center gap-5">
        <h1 className="text-9xl text-red-500 dark:text-red-600">401</h1>
        <div>
          <h5 className="text-xl font-medium text-gray-600 sm:text-2xl dark:text-white mb-5">
            {t("عذراً! الوصول غير مصرح به.")}
          </h5>

          <h5 className="text-lg font-semibold text-gray-600 dark:text-white text-center">
            {"ليس لديك صلاحيات للوصول إلى هذه الصفحة."}
          </h5>
          <h5 className="text-lg font-semibold text-gray-600 dark:text-white ">
            {" الرجاء العودة إلى "}
            <Link to={navigateTo} className="text-blue-500 hover:underline">
              {"الصفحة الرئيسية"}
            </Link>
            .
          </h5>
        </div>
      </section>
    </div>
  );
}
