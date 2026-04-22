import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";
import MainContent from "./MainContent/MainContent";
import Navbar from "./Navbar/Navbar";

export default function PublicLayoutPages() {
  return (
    <MainContent>
      <Navbar />
      <Outlet />
      <Footer />
    </MainContent>
  );
}
