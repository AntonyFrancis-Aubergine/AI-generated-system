import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import InstructorDashboard from "./pages/dashboards/InstructorDashboard";
import UserDashboard from "./pages/dashboards/UserDashboard";

// Fitness Class Pages
import FitnessClasses from "./pages/user/FitnessClasses";
import ManageClasses from "./pages/instructor/ManageClasses";

// Home component that redirects based on auth status and role
function Home() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Redirect to appropriate dashboard based on user role
  switch (user?.role) {
    case "ADMIN":
      return <Navigate to="/admin/dashboard" replace />;
    case "INSTRUCTOR":
      return <Navigate to="/instructor/dashboard" replace />;
    case "USER":
      return <Navigate to="/user/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with role-based access */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/classes"
          element={
            <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
              <ManageClasses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/classes"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <FitnessClasses />
            </ProtectedRoute>
          }
        />

        {/* Home route - shows landing page or redirects based on auth status and role */}
        <Route path="/" element={<Home />} />

        {/* Catch-all route - redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
