import Alert from "components/Alert/Alert";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import ClientRoutes from "routes/ClientRoutes";
import PublicRoutes from "routes/PublicRoutes";
import "./App.css";
import PrivateRoutes from "routes/PrivateRoutes";


function App() {
  const { role } = useSelector((state) => state.auth);
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);

  return (
    <>
      {/* <IdleTimer /> */}
      <Routes>
        <Route path="/dashboard/*" element={<PrivateRoutes />} />
        <Route path="/my-account/*" element={<ClientRoutes />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
      <Alert />
    </>
  );
}

export default App;

