// src/components/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CustomLoader from "../components/common/CustomLoader";
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const MainLayout = lazy(() => import("./layout/MainLayout"));
const NotFoundPage = lazy(() => import("./common/NotFoundPage"));
const ProtectedRoute = lazy(() => import("./auth/ProtectedRoute"));
const AdminConfig = lazy(() => import("../pages/admin/AdminConfigurationPage"));
const Report = lazy(() => import("../pages/report/GenerateReport"));
// Lazy load pages
const Home = lazy(() => import("../pages/home/Home"));
const Timesheet = lazy(() => import("../pages/timesheet/Timesheet"));
//const TaskManagementApp = lazy(() => import("../pages/Task/Task"));
const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="app">
      <Suspense fallback={<CustomLoader />}>
        <Routes>
          {/* Root redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Login route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                user?.role === "ADMIN" || user?.roles?.includes("ADMIN") ? (
                  <Navigate to="/report" replace />
                ) : (
                  <Navigate to="/timesheet" replace />
                )
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/register"
            element={
              isAuthenticated ? (
                user?.role === "ADMIN" || user?.roles?.includes("ADMIN") ? (
                  <Navigate to="/report" replace />
                ) : (
                  <Navigate to="/timesheet" replace />
                )
              ) : (
                <Register />
              )
            }
          />

          {/* Protected routes with nested layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="timesheet"
              element={
                <Suspense fallback={<CustomLoader />}>
                  <Timesheet />
                </Suspense>
              }
            />
            <Route
              path="admin-config"
              element={
                <Suspense fallback={<CustomLoader />}>
                  <AdminConfig />
                </Suspense>
              }
            />
            <Route
              path="report"
              element={
                <Suspense fallback={<CustomLoader />}>
                  <Report />
                </Suspense>
              }
            />
          </Route>

          {/* Catch-all route for invalid paths */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                user?.role === "ADMIN" || user?.roles?.includes("ADMIN") ? (
                  <Navigate to="/report" replace />
                ) : (
                  <Navigate to="/task-management" replace />
                )
              ) : (
                <Login />
              )
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRoutes;
