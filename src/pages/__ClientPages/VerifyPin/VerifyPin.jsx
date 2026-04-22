import React, { useState, useRef, useEffect } from "react";
import { Lock, ShieldCheck, ChevronRight, Fingerprint } from "lucide-react";
import { useCheckPIN } from "api/Auth/auth";

const VerifyPin = () => {
  const { mutate: sendOTP, isError, isPending, isSuccess } = useCheckPIN();

  const [pin, setPin] = useState(["", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState("idle"); // 'idle', 'success', 'error'
  const inputRefs = useRef([]);

  // التركيز تلقائياً على المربع الأول عند تحميل الصفحة
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    console.log(isError, isSuccess);
    if (isError) {
      setStatus("error");
      setPin(["", "", "", ""]);
      inputRefs.current[0].focus();
      setTimeout(() => setStatus("idle"), 2000);
    }
    if (isSuccess) {
      setStatus("success");
      //    setTimeout(() => setStatus("idle"), 2000);
    }
  }, [isError, isSuccess]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const newPin = [...pin];
    // نأخذ فقط الرقم الأخير المدخل
    newPin[index] = value.substring(value.length - 1);
    setPin(newPin);

    // الانتقال التلقائي للمربع التالي
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // العودة للمربع السابق عند المسح
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullPin = pin.join("");
    if (fullPin.length < 4) return;

    sendOTP({ pin: fullPin });

    setIsVerifying(true);
  };

  return (
    <div
      className="h-full w-full flex items-center justify-center overflow-hidden relative font-sans text-right"
      dir="rtl"
    >
      {/* خلفية جمالية لتعزيز تأثير الشفافية */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-400/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/20 rounded-full blur-[120px] animate-pulse"></div>

      {/* البطاقة الزجاجية */}
      <div className="relative z-10_ w-full max-w-md mx-4_">
        <div
          className={`backdrop-blur-xl  border border-white/40 shadow-2xl md:rounded-[2.5rem] p-8 md:p-12 transition-all duration-500 ${status === "error" ? "animate-shake border-red-400/50" : ""} bg-white/70 dark:bg-gray-800/40 backdrop-blur-xl md:rounded-[2.5rem] border-y-2 md:border  border-blak/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 md:p-10 transition-all duration-300`}
        >
          {/* الأيقونة والعناوين */}
          <div className="flex flex-col items-center mb-10">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 shadow-xl
              ${
                status === "success"
                  ? "bg-green-500/20 text-green-600 scale-110"
                  : status === "error"
                    ? "bg-red-500/20 text-red-600"
                    : "bg-white/40 text-gray-700"
              }`}
            >
              {status === "success" ? (
                <ShieldCheck size={40} />
              ) : (
                <Lock size={36} />
              )}
            </div>

            {!isSuccess && (
              <>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  أدخل الرمز
                </h1>
                <p className="text-gray-500 text-center font-medium">
                  الرجاء إدخال رمز الـ PIN المكون من 4 أرقام
                </p>
              </>
            )}
          </div>
          {isSuccess && (
            <h1 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">
              مرحباً بك من جديد!
            </h1>
          )}
          {/* مربعات الإدخال المنفصلة */}
          {!isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-center gap-4 flex-row-reverse">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    name={`pin_${index}`} // اسم فريد → يمنع password manager
                    autoComplete="one-time-code" // خاص بالـ OTP / PIN
                    value={digit ? "●" : ""} // عرض نقطة بدل الرقم الحقيقي
                    dir="ltr"
                    onChange={(e) =>
                      handleChange(e.target.value.replace("●", ""), index)
                    }
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`w-16 h-16 text-center text-3xl font-bold rounded-2xl
    border transition-all duration-300 outline-none
    bg-gray-100 dark:bg-gray-700 dark:text-white/70 text-gray-800
    caret-transparent select-none
    ${
      status === "error"
        ? "border-red-400 bg-red-50/30"
        : "border-white/50 focus:border-green-400/50 focus:ring-4 focus:ring-green-400/10"
    }
    shadow-inner`}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isPending || pin.some((d) => d === "")}
                  className="w-full py-4 bg-gray-900 dark:bg-gray-00 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-gray-900/20"
                >
                  {isPending ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>متابعة</span>
                      <ChevronRight size={20} className="rotate-180" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(10px); }
          75% { transform: translateX(-10px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        
        /* جعل شكل النقاط (password) متناسق داخل المربعات */
        input[type="password"] {
          -webkit-text-security: disc;
        }
      `,
        }}
      />
    </div>
  );
};

export default VerifyPin;
