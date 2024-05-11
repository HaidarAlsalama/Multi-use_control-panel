import { Link, Route, Routes } from "react-router-dom";
import "./App.scss";
import { LayoutPage, Spinner, ThemeToggle } from "./components";
// import Dashboard from "./pages/Dashboard/Dashboard";
import { changeLanguage, i18nConfig } from "./lang";
// import Settings from "./pages/Settings/Settings";
import { Suspense, lazy, useEffect } from "react";
// import Testing_1 from "./pages/Testing/Testing_1";
import Alert from "./components/Alert/Alert";
import { Error404 } from "./pages/errors";

const DashboardRouter = lazy(() =>
  import("./pages/DashboardRouter/DashboardRouter")
);

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
    <>
      <Routes>
        <Route
          path="/"
          element={<Link to={"/dashboard"}>go to dashboard</Link>}
        />
        <Route
          path="/dashboard/*"
          element={
            <Suspense fallback={<Spinner page />}>
              <DashboardRouter />
            </Suspense>
          }
        />
        <Route path="*" element={<Error404 navigateTo={'/'} timer={10000}/>} />
      </Routes>
      <ThemeToggle />
      <Alert />
    </>
  );
}

export default App;
