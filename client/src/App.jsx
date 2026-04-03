// client/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { Toast } from "./components/Toast.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

// Pages
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Hotels } from "./pages/Hotels.jsx";
import { HotelDetails } from "./pages/HotelDetails.jsx";
import HotelMap from "./pages/HotelMap.jsx";
import { Routes as RoutesPage } from "./pages/Routes.jsx";
import { RouteSearch } from "./pages/RouteSearch.jsx";
import { AdminRoutes } from "./pages/AdminRoutes.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Favorites } from "./pages/Favorites.jsx";
import { Admin } from "./pages/Admin.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { EmployeePanel } from "./pages/EmployeePanel.jsx";

import "./styles/App.css";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <div className="app">
          <Header />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              <Route path="/hotel-map" element={<HotelMap />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/search-route" element={<RouteSearch />} />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/routes"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminRoutes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employee"
                element={
                  <ProtectedRoute employeeOnly>
                    <EmployeePanel />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toast />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
