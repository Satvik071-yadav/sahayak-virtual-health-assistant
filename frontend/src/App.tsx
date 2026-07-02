import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EmergencyFAB from "./components/EmergencyFAB";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Chatbot from "./pages/Chatbot";
import Emergency from "./pages/Emergency";
import Hospitals from "./pages/Hospitals";
import Telemedicine from "./pages/Telemedicine";
import HealthTips from "./pages/HealthTips";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar dark={dark} toggleDark={() => setDark((d) => !d)} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/telemedicine" element={<Telemedicine />} />
          <Route path="/health-tips" element={<HealthTips />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <EmergencyFAB />
    </div>
  );
}
