import { ThemeToggle } from "components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.scss";

export default function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
  }, [location]);

  return (
    <div
      className="md:px-2 text-sm sticky top-0 z-50  bg-white/70 dark:bg-gray-900/50
          backdrop-blur-xl
          border-b-2 dark:border-white/10 border-black/10
          shadow-lg"
    >
      <nav
        className="
          w-full max-w-6xl mx-auto h-16 px-4
          md:rounded-b-2xl_
        "
      >
        <div className="h-full flex flex-row-reverse items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/assets/images/logo.png"
              alt="logo"
              className="w-14 drop-shadow-md "
            />
          </Link>

          {/* Links */}
          <div className="flex flex-row-reverse items-center gap-2">
            <ThemeToggle />
            {/* {location.pathname !== "/" && location.pathname !== "/login" && (
              <Link
                to="/login"
                className="
                    px-3 py-1.5 rounded-lg font-bold
                    text-green-500
                    hover:bg-green-400/10
                    transition-all
                  "
              >
                تسجيل دخول
              </Link>
            )} */}
          </div>
        </div>
      </nav>
    </div>
  );
}
