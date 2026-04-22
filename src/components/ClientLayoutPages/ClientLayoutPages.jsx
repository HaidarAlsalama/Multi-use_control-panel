import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer/Footer";
import MainContent from "./MainContent/MainContent";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";

import "./ClientLayoutPages.scss";
import { useHelloMyServer } from "api/Auth/auth";

export default function ClientLayoutPages() {
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {} = useHelloMyServer();

  useEffect(() => {
    if (isSidebarOpen) setIsSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsSidebarOpen(false);
    });
  }, []);

  return (
    <MainContent>
      <div>
        <Navbar isOpen={isSidebarOpen} toggle={setIsSidebarOpen} />
        <Sidebar isOpen={isSidebarOpen} toggle={setIsSidebarOpen} />
        <Outlet />
      </div>
      <Footer />
    </MainContent>
  );
}
