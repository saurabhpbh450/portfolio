import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";

import Home from "./pages/Home.jsx";
import ProjectsPage from "./pages/Projects.jsx";
import ProjectDetailPage from "./pages/ProjectDetail.jsx";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminSignupPage from "./pages/admin/AdminSignupPage.jsx";

import { apiGetPortfolio } from "./lib/api.js";

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const id = location.hash.replace("#", "");

    requestAnimationFrame(() => {
      const el = document.getElementById(id);

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }, [location]);

  return null;
}

export default function App() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    apiGetPortfolio()
      .then((data) => setContent(data))
      .catch(() => setContent(null));
  }, []);

  return (
    <>
      <ScrollToHash />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/projects"
          element={content ? <ProjectsPage content={content} /> : <Navigate to="/" replace />}
        />

        <Route
          path="/projects/:slug"
          element={content ? <ProjectDetailPage content={content} /> : <Navigate to="/" replace />}
        />

        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/signup" element={<AdminSignupPage />} />

        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}