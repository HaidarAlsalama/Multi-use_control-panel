import React, { Suspense, lazy, useEffect } from "react";
import { LayoutPage, Spinner } from "../../components";
import { useLocation } from "react-router-dom";
// import Dashboard from "./Dashboard/Dashboard";
import { Error404 } from "./../errors";
const Settings = lazy(() => import("./Settings/Settings"));
const Dashboard = lazy(() => import("./Dashboard/Dashboard"));

export default function DashboardRouter() {
  const location = useLocation();

  return (
    <LayoutPage>
      <Suspense fallback={<Spinner page/>}>
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
