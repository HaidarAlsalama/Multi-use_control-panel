import { __APP_NAME__ } from "config/static";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-0 border-t-2 dark:border-gray-700 border-gray-200  bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-black dark:text-gray-300 text-gray-800 ">
      {/* Top Border */}
      {/* <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500" /> */}

      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-center md:text-right ">
        {/* Column 1 — App Info */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-bold">{__APP_NAME__}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            منصة متكاملة لإدارة تحويل الرصيد بسهولة وأمان.
          </p>
        </div>

        {/* Column 2 — Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold ">روابط مهمة</h4>

          <Link
            to="/privacy-policy"
            className="hover:text-green-400 transition text-sm"
          >
            سياسة الاستخدام والخصوصية
          </Link>

          {/* <Link to="/about" className="hover:text-green-400 transition text-sm">
            من نحن
          </Link>

          <Link
            to="/contact"
            className="hover:text-green-400 transition text-sm"
          >
            تواصل معنا
          </Link> */}
        </div>

        {/* Column 3 — Version & Copyright */}
        <div className="flex flex-col gap-3 md:items-end">
          <span className="text-sm">
            الإصدار <span className="text-green-400 font-semibold">1.0.1</span>
          </span>

          <span className="text-xs text-gray-500">
            © {new Date().getFullYear()} {__APP_NAME__} — جميع الحقوق محفوظة
          </span>
        </div>
      </div>
    </footer>
  );
}
