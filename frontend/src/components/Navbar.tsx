import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, HeartPulse, Moon, Sun, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 glass ${
        scrolled ? "shadow-lg shadow-black/5" : "shadow-none"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg text-ink-900 dark:text-white group">
            <motion.span
              whileHover={{ rotate: -8, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand-500 via-accent-500 to-care-500 text-white shadow-md shadow-brand-500/30"
            >
              <HeartPulse size={19} strokeWidth={2.5} />
            </motion.span>
            Sahayak
          </Link>

          <div className="hidden lg:flex items-center gap-0.5 relative">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                className={({ isActive }) =>
                  `relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-brand-700 dark:text-brand-300"
                      : "text-ink-700 dark:text-ink-100 hover:text-brand-600 dark:hover:text-brand-300"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-brand-50 dark:bg-brand-500/10 -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {t(item.labelKey)}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="rounded-full border border-slate-200 dark:border-white/10 px-3 py-1.5 text-sm font-semibold text-ink-700 dark:text-ink-100 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle language"
            >
              {lang === "en" ? "हिंदी" : "EN"}
            </button>
            <button
              onClick={toggleDark}
              className="rounded-full border border-slate-200 dark:border-white/10 p-2 text-ink-700 dark:text-ink-100 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={dark ? "sun" : "moon"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  {dark ? <Sun size={18} /> : <Moon size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 pl-1.5 pr-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-linear-to-br from-brand-500 to-care-500 text-white text-xs font-bold">
                    {user.full_name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-ink-700 dark:text-ink-100 max-w-[100px] truncate">
                    {user.full_name.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className={`text-ink-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-ink-800 shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10">
                        <p className="text-sm font-semibold text-ink-900 dark:text-white truncate">{user.full_name}</p>
                        <p className="text-xs text-ink-500 truncate">{user.email}</p>
                      </div>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-100 hover:bg-slate-50 dark:hover:bg-white/5"
                        >
                          <LayoutDashboard size={15} /> {t("nav_dashboard")}
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                          navigate("/");
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-alert-600 hover:bg-alert-50 dark:hover:bg-alert-500/10"
                      >
                        <LogOut size={15} /> {t("nav_logout")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-700 dark:text-ink-100 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  {t("nav_login")}
                </Link>
                <Link to="/register">
                  <motion.span
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-block rounded-full bg-linear-to-r from-brand-600 to-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/25 hover:shadow-lg transition-shadow"
                  >
                    {t("nav_register")}
                  </motion.span>
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden rounded-lg p-2 text-ink-700 dark:text-ink-100 hover:bg-slate-100 dark:hover:bg-white/5"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-slate-200 dark:border-white/10 py-3 space-y-1 overflow-hidden"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300" : "text-ink-700 dark:text-ink-100 hover:bg-slate-100 dark:hover:bg-white/5"
                    }`
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              ))}
              <div className="flex items-center gap-2 px-3 pt-2">
                <button
                  onClick={() => setLang(lang === "en" ? "hi" : "en")}
                  className="flex-1 rounded-full border border-slate-200 dark:border-white/10 px-3 py-2 text-sm font-semibold text-ink-700 dark:text-ink-100"
                >
                  {lang === "en" ? "हिंदी में बदलें" : "Switch to English"}
                </button>
                <button
                  onClick={toggleDark}
                  className="rounded-full border border-slate-200 dark:border-white/10 p-2 text-ink-700 dark:text-ink-100"
                  aria-label="Toggle dark mode"
                >
                  {dark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="mx-3 mt-2 block rounded-full border border-slate-200 dark:border-white/10 px-4 py-2.5 text-center text-sm font-semibold text-ink-700 dark:text-ink-100"
                    >
                      {t("nav_dashboard")}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                      navigate("/");
                    }}
                    className="mx-3 mt-2 block w-[calc(100%-1.5rem)] rounded-full bg-ink-900 dark:bg-white/10 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    {t("nav_logout")}
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-3 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-full border border-slate-200 dark:border-white/10 px-4 py-2.5 text-center text-sm font-semibold text-ink-700 dark:text-ink-100"
                  >
                    {t("nav_login")}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-full bg-linear-to-r from-brand-600 to-accent-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    {t("nav_register")}
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
