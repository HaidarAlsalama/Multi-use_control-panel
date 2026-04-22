import { __APP_NAME__ } from "config/static";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div
      className={`
        self-end flex justify-center w-full items-center
        bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border-t border-gray-200
         dark:border-white/10
        mt-16 transition-colors h-16
      `}
    >
      <footer
        className="
          w-full max-w-6xl mx-auto p-4 flex flex-col md:flex-row 
          items-center md:justify-between
          text-slate-800 dark:text-white transition-colors
        "
      >
        <span className="text-sm font-bold text-center sm:text-center">
          <Link
            to={"/my-account"}
            className="
              hover:underline text-green-600/80 dark:text-green-400/80
              transition-colors px-1
            "
          >
            {__APP_NAME__}
          </Link>
          1.0.1
        </span>
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 text-center">
          <Link
            to="/privacy-policy"
            rel="noopener noreferrer"
            className="
                text-green-500/90
                hover:text-green-400
                hover:underline
                transition
              "
          >
            سياسة الاستخدام والخصوصية
          </Link>{" "}
        </span>
      </footer>
    </div>
  );
}
