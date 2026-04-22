import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Logout.scss";
import { logout } from "store/reducers/authReducer";
import LogoSpinner from "components/Spinner/LogoSpinner";
import { useLogout } from "api/Auth/auth";
export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {} = useLogout();

  useEffect(() => {
    const time = setTimeout(() => {
      dispatch(logout());
      navigate("/", { replace: true });
    }, 2000);
    return () => {
      clearTimeout(time);
    };
  }, []);

  return <LogoSpinner page />;
}
