import { image_host } from "config/api_host";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function NavigationCard({
  image,
  name,
  link,
  is_available = true,
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      to={is_available ? link : "#"}
      onClick={(e) => !is_available && e.preventDefault()}
      className={`group relative aspect-square w-full max-w-[280px] mx-auto flex flex-col items-center justify-between p-4 rounded-[2.5rem] 
        transition-all duration-500 overflow-hidden
        ${
          is_available
            ? "bg-gray-100 dark:bg-white/5 border border-black/10 dark:border-white/10 dark:shadow-none hover:-translate-y-2"
            : "bg-gray-200 dark:bg-gray-800 opacity-80 cursor-not-allowed"
        }`}
    >
      {/* ملصق "غير متوفر" بشكل أرقى */}
      {!is_available && (
        <div className="absolute top-4 right-4 z-20 bg-red-500/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg">
          <span className="text-[10px] font-black text-white uppercase tracking-tighter">
            غير متوفر
          </span>
        </div>
      )}

      {/* حاوية الصورة - مربعة ومنسجمة */}
      <div className="relative w-full aspect-video rounded-[1.8rem] overflow-hidden bg-white/50 dark:bg-black/20 flex items-center justify-center">
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center text-gray-400">
            {/* أيقونة مؤقتة بسيطة */}
            <span className="text-xs font-bold uppercase tracking-widest">
              Loading...
            </span>
          </div>
        )}

        <img
          src={`${image_host}${image}`}
          alt={name}
          className={`w-full h-full object-contain p-2 transition-all duration-700
            ${!is_available ? "grayscale opacity-30" : "group-hover:scale-110 group-hover:rotate-2"}
            ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* اسم المنتج/الخدمة */}
      <div className="w-full text-center pb-2">
        <h5 className="text-sm md:text-base font-black text-gray-800 dark:text-white group-hover:text-mainLight transition-colors duration-300">
          {name}
        </h5>
        {is_available && (
          <div className="w-1.5 h-1.5 bg-mainLight rounded-full mx-auto mt-2 scale-0 group-hover:scale-100 transition-transform duration-300" />
        )}
      </div>

      {/* تأثير ضوئي عند التحويم */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-mainLight/5 rounded-full blur-3xl group-hover:bg-mainLight/10 transition-all duration-700" />
    </Link>
  );
}
