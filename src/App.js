import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { LayoutPage, ThemeToggle } from "./components";
import Dashboard from "./pages/Dashboard/Dashboard";
import { changeLanguage, i18nConfig } from "./lang";
import Settings from "./pages/Settings/Settings";
import { useEffect } from "react";
import Testing_1 from "./pages/Testing/Testing_1";

function App() {
  useEffect(() => {
    if (localStorage.getItem("lang") == "ar") {
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";
      changeLanguage("ar");
    } else {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
      changeLanguage("en");
    }
  }, []);

  return (
    <LayoutPage>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/test-1" element={<Testing_1 />} />
      </Routes>
      <ThemeToggle />
    </LayoutPage>
  );
}

export default App;
