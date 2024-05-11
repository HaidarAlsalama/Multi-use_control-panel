import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

export default function Error404({ navigateTo, timer = null }) {
  const {t} = useTranslation()
  const navigate = useNavigate();
  useEffect(() => {
    if (timer != null) {
      setTimeout(() => {
        setTimeout(() => {
          navigate(navigateTo);
        }, 10000);
      });
    }
  }, []);
  return (
    <div className="flex self-start justify-center items-center w-full md:p-2 mt-5 ">
      <section className="w-full max-w-5xl p-6 flex flex-col items-center gap-5">
        <h1 className="text-9xl text-red-500 dark:text-red-600">404</h1>
        <div>
          <h5
            className="text-xl font-medium text-gray-600 sm:text-2xl dark:text-white"
            style={{ direction: "ltr" }}
          >
            {t('Oops! Page not found.')}
          </h5>

          <h5
            className="text-lg font-semibold text-gray-600 dark:text-white text-center"
            style={{ direction: "ltr" }}
          >
            {t('return to')}{" "}
            <Link to={navigateTo} className="text-blue-500 hover:underline">
              {t('home')} {t('page')}
            </Link>
          </h5>
        </div>
      </section>
    </div>
  );
}
