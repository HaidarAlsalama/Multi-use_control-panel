import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateLayoutPages from "components/PrivateLayoutPages/PrivateLayoutPages";
import { Spinner } from "components";
import { useSelector } from "react-redux";
import { Error401, Error404 } from "pages/errors";

const Dashboard = React.lazy(
  () => import("pages/__PrivatePages/Dashboard/Dashboard"),
);

const AdminBox = React.lazy(
  () => import("pages/__PrivatePages/AdminBox/AdminBox"),
);
const Settings = React.lazy(
  () => import("pages/__PrivatePages/Settings/Settings"),
);
const ExchangeRate = React.lazy(
  () => import("pages/__PrivatePages/Settings/ExchangeRate/ExchangeRate"),
);
const ContactUs = React.lazy(
  () => import("pages/__PrivatePages/Settings/ContactUs/ContactUs"),
);
const EnhanceSecurity = React.lazy(
  () => import("pages/__PrivatePages/Settings/EnhanceSecurity/EnhanceSecurity"),
);
const ChangePassword = React.lazy(
  () => import("pages/__PrivatePages/Settings/ChangePassword/ChangePassword"),
);

const Categories = React.lazy(
  () => import("pages/__PrivatePages/Categories/Categories"),
);

const Products = React.lazy(
  () => import("pages/__PrivatePages/Products/Products"),
);

const Users = React.lazy(() => import("pages/__PrivatePages/Users/Users"));
const RoleAndPermission = React.lazy(
  () => import("pages/__PrivatePages/RoleAndPermission/RoleAndPermission"),
);

const Customers = React.lazy(
  () => import("pages/__PrivatePages/Customers/Customers"),
);
const CustomerGroup = React.lazy(
  () => import("pages/__PrivatePages/CustomerGroup/CustomerGroup"),
);

const FinancialStatement = React.lazy(
  () =>
    import("pages/__PrivatePages/Customers/FinancialStatement/FinancialStatement"),
);
const RechargeBalance = React.lazy(
  () => import("pages/__PrivatePages/RechargeBalance/RechargeBalance"),
);
const BankNotice = React.lazy(
  () => import("pages/__PrivatePages/BankNotice/BankNotice"),
);
const Orders = React.lazy(() => import("pages/__PrivatePages/Orders/Orders"));

const Banks = React.lazy(() => import("pages/__PrivatePages/Banks/Banks"));
const Suppliers = React.lazy(
  () => import("pages/__PrivatePages/Suppliers/Suppliers"),
);
const SupplierById = React.lazy(
  () => import("pages/__PrivatePages/Suppliers/ById/SupplierById"),
);
const Balances = React.lazy(
  () => import("pages/__PrivatePages/Balances/Balances"),
);
const Agents = React.lazy(() => import("pages/__PrivatePages/Agents/Agents"));
const Ads = React.lazy(() => import("pages/__PrivatePages/Ads/Ads"));

const routes = [
  { url: "/", component: <Dashboard />, permission: "" },
  { url: "/admin-box", component: <AdminBox />, permission: "" },
  { url: "/balances", component: <Balances />, permission: "" },
  { url: "/settings", component: <Settings /> },
  { url: "/settings/exchange-rate", component: <ExchangeRate /> },
  { url: "/settings/contact-us", component: <ContactUs /> },
  { url: "/settings/enhance-security", component: <EnhanceSecurity /> },
  { url: "/settings/change-password", component: <ChangePassword /> },
  { url: "/users", component: <Users />, permission: "view_users" },
  {
    url: "/role-and-permission",
    component: <RoleAndPermission />,
    permission: "view_roles",
  },
  {
    url: "/categories",
    component: <Categories />,
    permission: "view_category",
  },
  {
    url: "/products",
    component: <Products />,
    permission: "view_products",
  },
  {
    url: "/customers-groups",
    component: <CustomerGroup />,
    permission: "view_customer_groups",
  },
  {
    url: "/customers",
    component: <Customers />,
    permission: "view_customer",
  },
  {
    url: "/customers/financial-statement",
    component: <FinancialStatement />,
    permission: "view_customer",
  },
  {
    url: "/charge-balance",
    component: <RechargeBalance />,
    permission: "view_customer",
  },
  {
    url: "/bank-notice",
    component: <BankNotice />,
    permission: "view_customer",
  },
  {
    url: "/services-orders",
    component: <Orders />,
  },

  {
    url: "/banks",
    component: <Banks />,
    permission: "view_banks",
  },

  {
    url: "/agents",
    component: <Agents />,
    permission: "view_agents",
  },

  {
    url: "/suppliers",
    component: <Suppliers />,
    permission: "",
  },

  {
    url: "/suppliers/:supplierId",
    component: <SupplierById />,
    permission: "",
  },

  {
    url: "/ads",
    component: <Ads />,
    permission: "view_advertisements",
  },
];

const PrivateRoutes = () => {
  const { role, permissions } = useSelector((state) => state.auth);

  // التحقق من دور المستخدم
  if (role !== "admin") {
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
            element={<Navigate to="/dashboard/not-authorized" replace />}
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
      <Route element={<PrivateLayoutPages />}>
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

export default PrivateRoutes;
