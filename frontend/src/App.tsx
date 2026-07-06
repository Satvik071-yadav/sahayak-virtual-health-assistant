import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EmergencyFAB from "./components/EmergencyFAB";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "./components/PageTransition";
import { Skeleton } from "./components/ui/primitives";

// Route-level code splitting: each page ships as its own chunk and is only
// downloaded when the user navigates to it (keeps the initial bundle small).
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const Emergency = lazy(() => import("./pages/Emergency"));
const Hospitals = lazy(() => import("./pages/Hospitals"));
const Telemedicine = lazy(() => import("./pages/Telemedicine"));
const HealthTips = lazy(() => import("./pages/HealthTips"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function getInitialDarkMode() {
  const stored = localStorage.getItem("vha_theme");
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function RouteFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(getInitialDarkMode);
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("vha_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9fc] dark:bg-[#05070d] transition-colors duration-300">
      <Toaster
        position="top-center"
        toastOptions={{
          className: "font-medium text-sm",
          style: {
            borderRadius: "9999px",
            background: dark ? "#131c2e" : "#ffffff",
            color: dark ? "#e6ebf5" : "#0b1220",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          },
        }}
      />
      <Navbar dark={dark} toggleDark={() => setDark((d) => !d)} />
      <main className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/chat" element={<PageTransition><Chatbot /></PageTransition>} />
              <Route path="/emergency" element={<PageTransition><Emergency /></PageTransition>} />
              <Route path="/hospitals" element={<PageTransition><Hospitals /></PageTransition>} />
              <Route path="/telemedicine" element={<PageTransition><Telemedicine /></PageTransition>} />
              <Route path="/health-tips" element={<PageTransition><HealthTips /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <PageTransition><AdminDashboard /></PageTransition>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      {!isChatPage && <Footer />}
      {!isChatPage && <EmergencyFAB />}
    </div>
  );
}
