import { Spinner } from "components";
import PublicLayoutPages from "components/PublicLayoutPages/PublicLayoutPages";
// import Login from "pages/auth/Login/Login";
import Login from "pages/auth/Login/LoginV2";
import Logout from "pages/auth/Logout/Logout";
import { Error404 } from "pages/errors";
import PrivacyPolicy from "pages/PrivacyPolicy/PrivacyPolicy";
import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// const Login = React.lazy(() => import("pages/auth/Login/Login"));
// const Logout = React.lazy(() => import("pages/auth/LogoutV2/Logout"));
const Register = React.lazy(() => import("pages/auth/Register/Register"));
const ForgotMyPassword = React.lazy(
  () => import("pages/auth/ForgotMyPassword/ForgotMyPassword"),
);
const ContactUs = React.lazy(() => import("pages/ContactUs/ContactUs"));

const routes = [
  { url: "/", component: <Login /> },
  { url: "/login", component: <Login /> },
  { url: "/register", component: <Register /> },
  { url: "/logout", component: <Logout /> },
  { url: "/forgot-my-password", component: <ForgotMyPassword /> },
  { url: "/contact-us", component: <ContactUs /> },
  { url: "/privacy-policy", component: <PrivacyPolicy /> },
];

const ClientRoutes = () => {
  // دالة لتحقق من الصلاحية وإرجاع المسار
  const makeRoute = ({ url, component }) => {
    return (
      <Route
        key={url}
        path={url}
        element={<Suspense fallback={<Spinner page />}>{component}</Suspense>}
      />
    );
  };

  return (
    <Routes>
      <Route element={<PublicLayoutPages />}>
        {routes.map(makeRoute)}
        {/* <Route
          path="/not-authorized"
          element={<Error401 navigateTo={"/"} timer={10000} />}
        /> */}
        <Route path="*" element={<Error404 navigateTo={"/"} timer={10000} />} />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
