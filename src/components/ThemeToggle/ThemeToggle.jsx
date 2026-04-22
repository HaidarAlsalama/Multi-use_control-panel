import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mode, setMode] = useState(
    localStorage.getItem("themeMode") ? localStorage.getItem("themeMode") : ""
  );

  useEffect(() => {
    if (mode === "" && document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    }
    if (
      mode === "dark" &&
      !document.documentElement.classList.contains("dark")
    ) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const changeTheme = () => {
    document.documentElement.classList.toggle("dark");
    if (document.documentElement.classList.contains("dark")) {
      localStorage.setItem("themeMode", "dark");
      setMode("dark");
    } else {
      localStorage.setItem("themeMode", "");
      setMode("");
    }
  };

  return (
    <button
      className={`w-10 h-10 rounded-xl
                flex items-center justify-center
                border shadow-sm
                bg-gray-100 text-slate-700
                hover:bg-gray-200
                dark:bg-white/5 dark:text-yellow-400
                dark:border-white/10 dark:hover:bg-white/10
                transition-all
              `}
      onClick={changeTheme}
    >
      <Sun className="hidden dark:block" size={18} />
      <Moon className="block dark:hidden" size={18} />
    </button>
  );
}
