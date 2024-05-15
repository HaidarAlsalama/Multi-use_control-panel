import React, { Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import { LayoutPage, Spinner } from "../../components";

const Settings = lazy(() => import("./Settings/Settings"));
const Dashboard = lazy(() => import("./Dashboard/Dashboard"));
const Error404 = lazy(() => import("../errors/Error404/Error404"));

/** @todo convert lazyLoading to external function to use */

export default function DashboardRouter() {
  const location = useLocation();

  return (
    <LayoutPage>
      <Suspense fallback={<Spinner page />}>
        {(() => {
          switch (location.pathname) {
            case "/dashboard":
              return <Dashboard />;
            case "/dashboard/settings":
              return <Settings />;
            default:
              return <Error404 navigateTo={"/dashboard"} timer={10000} />;
          }
        })()}
      </Suspense>
    </LayoutPage>
  );
}
