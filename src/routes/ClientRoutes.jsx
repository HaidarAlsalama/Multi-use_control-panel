import { Spinner } from "components";
import ClientLayoutPages from "components/ClientLayoutPages/ClientLayoutPages";
import Banks from "pages/__ClientPages/Banks/Banks";
import FinancialStatement from "pages/__ClientPages/FinancialStatement/FinancialStatement";
import Games from "pages/__ClientPages/Games/Games";
import Home from "pages/__ClientPages/Home/Home";
import Internet from "pages/__ClientPages/Internet/Internet";
import MyOrders from "pages/__ClientPages/MyOrders/MyOrders";
import MyPayments from "pages/__ClientPages/MyPayments/MyPayments";
import Product from "pages/__ClientPages/Product/Product";
import Raseed from "pages/__ClientPages/Raseed/Raseed";
import RaseedJomla from "pages/__ClientPages/RaseedJomla/RaseedJomla";
import UnderMaintenance from "pages/__ClientPages/UnderMaintenance/UnderMaintenance";
import VerifyPin from "pages/__ClientPages/VerifyPin/VerifyPin";
import { Error401, Error404 } from "pages/errors";
import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

const ChangePIN = React.lazy(
  () => import("pages/__ClientPages/ChangePassword/ChangePIN"),
);

const MyProfile = React.lazy(
  () => import("pages/__ClientPages/MyProfile/MyProfile"),
);

const routes = [
  { url: "/", component: <Home /> },

  // { url: "/bank-notice", component: <BankNotice /> },

  // { url: "/categories", component: <Categories /> },
  { url: "/product", component: <Product /> },
  //{ url: "/search", component: <Search /> },

  { url: "/financial-statement", component: <FinancialStatement /> },
  { url: "/my-payments", component: <MyPayments /> },
  { url: "/my-orders", component: <MyOrders /> },

  { url: "/change-pin", component: <ChangePIN /> },
  { url: "/verify-pin", component: <VerifyPin /> },

  { url: "/under-maintenance", component: <UnderMaintenance /> },
  { url: "/my-profile", component: <MyProfile /> },

  { url: "/abili", component: <Raseed /> },
  { url: "/abili-jomla", component: <RaseedJomla /> },

  { url: "/internet", component: <Internet /> },

  { url: "/games", component: <Games /> },

  { url: "/banks", component: <Banks /> },
];

const ClientRoutes = () => {
  const { role, permissions } = useSelector((state) => state.auth);

  // التحقق من دور المستخدم
  if (role !== "customer") {
    return <Navigate to="/login" replace />;
  }

  // دالة لتحقق من الصلاحية وإرجاع المسار
  const makeRoute = ({ url, component, permission }) => {
    if (permission) {
      // تحقق من الصلاحية
      if (permissions.includes(permission)) {
        return (
          <Route
            key={url}
            path={url}
            element={
              <Suspense fallback={<Spinner page />}>{component}</Suspense>
            }
          />
        );
      }
      // في حال عدم وجود الصلاحية، إعادة توجيه المستخدم إلى صفحة غير مفوض
      else
        return (
          <Route
            key={url}
            path={url}
            element={<Navigate to="/my-account/not-authorized" replace />}
          />
        );
    } else
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
      <Route element={<ClientLayoutPages />}>
        {routes.map(makeRoute)}
        <Route
          path="/not-authorized"
          element={<Error401 navigateTo={"/"} timer={10000} />}
        />
        <Route path="*" element={<Error404 navigateTo={"/"} timer={10000} />} />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
