import { ThemeToggle } from "components";
import useViewTransitionNavigate from "Hooks/useViewTransitionNavigate";
import { RiApps2Line } from "react-icons/ri";
import Account from "../Account/Account";

export default function Navbar({ isOpen, toggle }) {
  const navigate = useViewTransitionNavigate();

  return (
    <header className="sticky top-0 z-10">
      <nav
        className="
          h-16 border-b
          bg-white/80 backdrop-blur-xl border-gray-200
          dark:bg-slate-900/80 dark:border-white/10
          transition-colors
        "
      >
        <div className="max-w-6xl mx-auto h-full px-4 flex flex-row-reverse items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate("/my-account")}
            className="
              flex items-center gap-3 cursor-pointer
              hover:opacity-80 transition-opacity
            "
          >
            <img
              src="/assets/images/logo.png"
              alt="Logo"
              className="w-12 drop-shadow-md"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Menu Button */}
            <button
              onClick={() => toggle((prev) => !prev)}
              aria-expanded={isOpen}
              className="
                lg:hidden
        
                 w-10 h-10 rounded-xl
                flex items-center justify-center
                border shadow-sm
                bg-gray-100 text-slate-700
                hover:bg-gray-200
                dark:bg-white/5 dark:text-green-600
                dark:border-white/10 dark:hover:bg-white/10
                transition-all
              "
            >
              <RiApps2Line
                className={`text-2xl transition-transform duration-300 ${
                  isOpen ? "-scale-x-100" : ""
                }`}
              />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Account */}
            <Account />
          </div>
        </div>
      </nav>
    </header>
  );
}
