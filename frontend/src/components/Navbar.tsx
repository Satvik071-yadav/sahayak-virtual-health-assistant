import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, HeartPulse, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const navItems: { key: string; to: string; labelKey: any }[] = [
  { key: "home", to: "/", labelKey: "nav_home" },
  { key: "chat", to: "/chat", labelKey: "nav_chat" },
  { key: "telemedicine", to: "/telemedicine", labelKey: "nav_telemedicine" },
  { key: "hospitals", to: "/hospitals", labelKey: "nav_hospitals" },
  { key: "tips", to: "/health-tips", labelKey: "nav_tips" },
  { key: "about", to: "/about", labelKey: "nav_about" },
  { key: "contact", to: "/contact", labelKey: "nav_contact" },
];

export default function Navbar({
  dark,
  toggleDark,
}: {
  dark: boolean;
  toggleDark: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-brand-700">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand-500 to-care-500 text-white shadow-md">
              <HeartPulse size={20} strokeWidth={2.5} />
            </span>
            Sahayak
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-700 hover:bg-slate-100"
                  }`
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-ink-700 hover:bg-slate-100"
              aria-label="Toggle language"
            >
              {lang === "en" ? "हिंदी" : "EN"}
            </button>
            <button
              onClick={toggleDark}
              className="rounded-full border border-slate-200 p-2 text-ink-700 hover:bg-slate-100"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-700 hover:bg-slate-100"
                  >
                    {t("nav_dashboard")}
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {t("nav_logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-700 hover:bg-slate-100"
                >
                  {t("nav_login")}
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/25 hover:bg-brand-600"
                >
                  {t("nav_register")}
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden rounded-lg p-2 text-ink-700 hover:bg-slate-100"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-slate-200 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-slate-100"
                  }`
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
            <div className="flex items-center gap-2 px-3 pt-2">
              <button
                onClick={() => setLang(lang === "en" ? "hi" : "en")}
                className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold"
              >
                {lang === "en" ? "हिंदी में बदलें" : "Switch to English"}
              </button>
              <button
                onClick={toggleDark}
                className="rounded-full border border-slate-200 p-2"
                aria-label="Toggle dark mode"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate("/");
                }}
                className="mx-3 mt-2 block rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                {t("nav_logout")}
              </button>
            ) : (
              <div className="flex gap-2 px-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold"
                >
                  {t("nav_login")}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-brand-500 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  {t("nav_register")}
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
