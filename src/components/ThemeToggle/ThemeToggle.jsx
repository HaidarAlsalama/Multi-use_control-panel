import React, { useEffect, useState } from "react";
import { MdSunny } from "react-icons/md";
import { BsFillMoonStarsFill } from "react-icons/bs";

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
    <button className={`fixed bottom-4 ltr:right-4 rtl:left-4 z-50 btn ${mode === 'dark' ? 'btn-light' : 'btn-dark'}`} onClick={changeTheme}>
      {mode === "dark" ? <BsFillMoonStarsFill className="text-gray-800" /> : <MdSunny className="text-white"/>}
      <span className="sr-only">change theme</span>
    </button>
  );
}
