import React, { useContext, Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppContext } from "./context/AppContext";
import Menubar from "./components/Menubar/Menubar";
import StockPredictionPage from "./pages/StockPrediction/StockPredictionPage";

// 🧠 Lazy load all major pages
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const ManageCategory = lazy(() => import("./pages/ManageCategory/ManageCategory"));
const ManageUsers = lazy(() => import("./pages/ManageUsers/ManageUsers"));
const ManageItems = lazy(() => import("./pages/ManageItems/ManageItems"));
const Explore = lazy(() => import("./pages/Explore/Explore"));
const Login = lazy(() => import("./pages/Login/Login"));
const OrderHistory = lazy(() => import("./pages/OrderHistory/OrderHistory"));
const Notfound = lazy(() => import("./pages/Notfound/Notfound"));
const UpdateStockPage = lazy(() => import("./components/UpdateStock/UpdateStockPage"));

const App = () => {
  const location = useLocation();
  const { auth } = useContext(AppContext);

  // 🔐 Login Route Guard
  const LoginRoute = ({ element }) => {
    if (auth.token) return <Navigate to="/dashboard" replace />;
    return element;
  };

  // 🔐 Protected Route Guard
  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (!auth.token) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(auth.role))
      return <Navigate to="/dashboard" replace />;
    return element;
  };

  return (
    <div>
      {location.pathname !== "/login" && <Menubar />}
      <Toaster />

      {/* 🌀 Suspense fallback while loading dynamically imported components */}
      <Suspense
        fallback={
          <div
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffc107",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/login" element={<LoginRoute element={<Login />} />} />

          {/* Admin Only Routes */}
          <Route
            path="/category"
            element={
              <ProtectedRoute
                element={<ManageCategory />}
                allowedRoles={["ROLE_ADMIN"]}
              />
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute
                element={<ManageUsers />}
                allowedRoles={["ROLE_ADMIN"]}
              />
            }
          />
          <Route
            path="/items"
            element={
              <ProtectedRoute
                element={<ManageItems />}
                allowedRoles={["ROLE_ADMIN"]}
              />
            }
          />
          <Route
            path="/update-stock"
            element={
              <ProtectedRoute
                element={<UpdateStockPage />}
                allowedRoles={["ROLE_ADMIN"]}
              />
            }
          />

          <Route
  path="/stock-predictions"
  element={<ProtectedRoute element={<StockPredictionPage />} allowedRoles={['ROLE_ADMIN']} />}
/>


          <Route path="/orders" element={<OrderHistory />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
