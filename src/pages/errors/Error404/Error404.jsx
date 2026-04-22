import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Error404({ navigateTo = "/", timer = 5000 }) {
  // افتراضياً 5 ثواني إذا لم يرسل timer
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(timer / 1000); // تحويل الملي ثانية إلى ثواني

  useEffect(() => {
    if (timer == null) return;

    // عداد تنازلي مرئي
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // التوجيه النهائي
    const timeOut = setTimeout(() => {
      navigate(navigateTo);
    }, timer);

    return () => {
      clearInterval(interval);
      clearTimeout(timeOut);
    };
  }, [timer, navigateTo, navigate]);

  return (
    <div className="flex justify-center items-center min-h-[80vh] w-full p-4 overflow-hidden relative">
      <section className="relative w-full max-w-4xl p-10 flex flex-col md:flex-row items-center justify-center gap-12 bg-gray-100 dark:bg-gray-900 rounded-[3rem] border-2 border-white dark:border-gray-800 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] dark:shadow-none">
        {/* البوابة الرقمية المربعة (Digital Portal) */}
        <div className="relative group aspect-square w-full max-w-[280px] sm:max-w-[320px] rounded-[2.5rem] bg-black overflow-hidden flex items-center justify-center shadow-2xl shadow-mainLight/20">
          {/* طبقة الـ Glitch (الوميض الأخضر) */}
          <div className="absolute inset-0 bg-gradient-to-t from-mainLight via-transparent to-mainLight/20 opacity-20 group-hover:opacity-40 animate-pulse transition-opacity duration-1000"></div>

          {/* النص البرمجي المتحرك (The Matrix Rain Effect) */}
          <div
            className="absolute inset-0 font-mono text-[8px] text-mainLight/40 leading-none tracking-widest opacity-80 group-hover:scale-110 transition-transform duration-500"
            style={{ textShadow: "0 0 5px #00C853" }}
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <p
                key={i}
                className="whitespace-nowrap animate-matrix-rain"
                style={{
                  animationDelay: `${i * 150}ms`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              >
                {Array.from({ length: 40 })
                  .map(() => String.fromCharCode(0x30a0 + Math.random() * 96))
                  .join("")}
              </p>
            ))}
          </div>

          {/* العنوان الرئيسي (404) مدمج */}
          <div className="relative z-10 text-center backdrop-blur-[2px] p-4 rounded-xl">
            <h1
              className="text-[120px] font-black leading-none tracking-tighter text-mainLight group-hover:scale-110 transition-transform duration-500"
              style={{ textShadow: "0 0 20px #00C853, 0 0 40px #00C853" }}
            >
              404
            </h1>
            <p className="text-xs font-bold text-mainLight/70 uppercase tracking-widest -mt-2">
              الصفحة مفقودة
            </p>
          </div>
        </div>

        {/* محتوى النصوص والعداد التنازلي */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-6 flex-1">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white leading-tight">
              يبدو أنك ضللت الطريق الرقمي.
            </h2>
            <p className="text-sm md:text-base font-medium text-gray-500 dark:text-gray-400 max-w-md mx-auto md:mx-0">
              الصفحة التي تبحث عنها غير موجودة، أو تم نقلها إلى بعد آخر. لا
              تقلق، سنعيدك إلى الأمان.
            </p>
          </div>

          {/* العداد التنازلي الدائري (Circular Countdown) */}
          {timer != null && (
            <div className="flex items-center gap-4 bg-white dark:bg-black p-4 rounded-full border border-white dark:border-gray-800 shadow-inner">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg
                  className="absolute inset-0 w-full h-full -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-gray-200 dark:text-gray-700"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="text-mainLight"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${(countdown / (timer / 1000)) * 100}, 100`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1s linear" }}
                  />
                </svg>
                <span className="text-2xl font-black text-gray-800 dark:text-mainLight">
                  {countdown}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                ثانية وسيتم <br /> تحويلك تلقائياً
              </p>
            </div>
          )}

          {/* زر العودة اليدوي */}
          <Link
            to={navigateTo}
            className="group flex items-center gap-2 px-8 py-3 rounded-full bg-mainLight hover:bg-mainLight/90 text-white font-black text-sm transition-all duration-300 shadow-lg shadow-mainLight/30 hover:shadow-xl hover:shadow-mainLight/50"
          >
            <span>العودة للرئيسية</span>
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* Tailwind Custom Animation (اضف هذا في ملف الـ CSS الخاص بك أو بداخل الـ Style Tag) */}
      <style>{`
        @keyframes matrix-rain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-matrix-rain {
          animation: matrix-rain linear infinite;
        }
      `}</style>
    </div>
  );
}
