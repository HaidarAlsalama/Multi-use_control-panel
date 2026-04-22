import React from "react";

const Alert = () => {
  return (
    <div
      // تم إضافة gap-4 و w-full مع max-w للتحكم بالعرض
      className="notifications fixed right-4 top-4 z-[9999] flex flex-col gap-4 w-[calc(100%-2rem)] md:w-auto pointer-events-none"
      id="notificationsAria"
    ></div>
  );
};

export const createAlert = (
  messageStatus,
  messageInfo,
  navigate = null,
  dispatch
) => {
  const alertAria = document.querySelector("#notificationsAria");
  if (!alertAria) return;

  const alertBody =
    navigate == null
      ? document.createElement("div")
      : document.createElement("a");
  if (navigate != null) alertBody.setAttribute("href", navigate);

  const icons = {
    error: "✕",
    success: "✓",
    warning: "!",
    info: "i",
  };

  const statusKey = messageStatus.toLowerCase();

  // تصميم داخلي مع Padding أكبر ومساحة أوسع للنص
  alertBody.innerHTML = `
    <div class="flex items-center gap-4 w-full">
      <div class="alert-icon flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border-2 border-current shadow-inner font-bold text-lg">
        ${icons[statusKey] || "•"}
      </div>
      <div class="flex flex-col flex-1">
        <h5 class="font-bold !text-[14px] m-0 tracking-tight leading-none mb-1">
          ${
            statusKey === "error"
              ? document.documentElement.lang === "ar"
                ? "خطأ في النظام"
                : "System Error"
              : statusKey === "success"
              ? document.documentElement.lang === "ar"
                ? "تمت العملية"
                : "Success Action"
              : statusKey === "warning"
              ? document.documentElement.lang === "ar"
                ? "تنبيه"
                : "Warning"
              : "إشعار"
          }
        </h5>
        <p class="!text-[13px] opacity-90 m-0 leading-tight font-medium">${messageInfo}</p>
      </div>
    </div>
  `;

  // إضافة classes العرض الجديد
  alertBody.setAttribute(
    "class",
    `alert translate-x-full pointer-events-auto alert-${
      statusKey === "error" ? "danger" : statusKey
    } w-full md:w-[400px]`
  );

  alertAria.insertBefore(alertBody, alertAria.firstChild);

  setTimeout(() => {
    alertBody.classList.remove("translate-x-full");
  }, 10);

  const closeAlert = () => {
    alertBody.classList.add("translate-x-full");
    setTimeout(() => alertBody.remove(), 700);
  };

  alertBody.addEventListener("click", closeAlert);

  let timer;
  const startTimer = () => {
    timer = setTimeout(closeAlert, 5000);
  };
  alertBody.addEventListener("mouseenter", () => clearTimeout(timer));
  alertBody.addEventListener("mouseleave", startTimer);

  startTimer();
};

export default Alert;
