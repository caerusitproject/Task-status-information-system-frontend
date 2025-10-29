// src/components/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import { useAuth } from "../hooks/useAuth";
import CustomLoader from "../components/common/CustomLoader";
// import EmployeeProfile from "../pages/profile/EmployeeProfile";
// import EmployeeProfileEdit from "../pages/profile/EmployeeProfileEdit";
// import EmployeeProfileView from "../pages/profile/EmployeeProfileView";
// import EmployeeList from "../pages/profile/EmployeeList";
// import Teamemployee from "../pages/profile/Teamemployee";
// Lazy load components
const Login = lazy(() => import("../pages/auth/Login"));
const MainLayout = lazy(() => import("./layout/MainLayout"));
const NotFoundPage = lazy(() => import("./common/NotFoundPage"));
const ProtectedRoute = lazy(() => import("./auth/ProtectedRoute"));
const AdminConfig = lazy(() => import("../pages/admin/AdminConfigurationPage"));
// Lazy load pages
const Home = lazy(() => import("../pages/home/Home"));

const TaskManagementApp = lazy(()=> import("../pages/Task/Task"))
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  useTokenRefresh();
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
              isAuthenticated ? <Navigate to="/home" replace /> : <Login />
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
              path="home"
              element={
                <Suspense fallback={<CustomLoader />}>
                  <Home />
                </Suspense>
              }
            />
            
            <Route
              path="task"
              element={
                <Suspense fallback={<CustomLoader />}>
                  <TaskManagementApp />
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
            
            </Route>
           
            
          
           
            
           
            

          {/* Catch-all route for invalid paths */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRoutes;
