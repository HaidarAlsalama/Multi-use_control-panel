import React from "react";
// لم نعد بحاجة لملف SCSS خارجي إذا كنت تستخدم Tailwind، سنضع الأنيميشن هنا
export default function LogoSpinner({ page, message }) {
  return (
    <div
      className={`w-full ${
        page ? "min-h-[70vh]" : ""
      } flex flex-col justify-center items-center bg-transparent transition-colors duration-500`}
    >
      <div className="relative flex justify-center items-center">
        {/* حلقة خلفية مضيئة */}
        <div className="absolute w-40 h-40 bg-mainLight/20 rounded-full blur-3xl animate-pulse" />

        {/* الشعار مع أنيميشن نبض خفيف */}
        <img
          src="/assets/images/logo.png"
          alt="Loading"
          className="w-32 md:w-40 relative z-10 animate-bounce-slow"
          style={{
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
      </div>

      {message && (
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="text-xl font-bold text-gray-700  dark:text-white">
            {message}
          </h2>
          <div className="flex gap-1 justify-center mt-4">
            <span className="w-1.5 h-1.5 bg-mainLight rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 bg-mainLight rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 bg-mainLight rounded-full animate-bounce"></span>
          </div>
        </div>
      )}
    </div>
  );
}

// أضف هذا الأنيميشن في ملف Tailwind config أو Global CSS
// @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
