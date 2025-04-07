import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import theme from "./utils/theme";
import Loading from "./components/Loading";
import ClassDetails from "./pages/user/ClassDetails";
import { UserRole } from "./types";
import { useAuth } from "./context/AuthContext";

// Auth pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

// User pages
const ClassList = lazy(() => import("./pages/user/ClassList"));
const BookingList = lazy(() => import("./pages/user/BookingList"));
const UserProfile = lazy(() => import("./pages/user/UserProfile"));
const UserDashboard = lazy(() => import("./pages/user/Dashboard"));
const FriendsPage = lazy(() => import("./pages/user/FriendsPage"));

// Instructor pages
const InstructorDashboard = lazy(() => import("./pages/instructor/Dashboard"));

// Admin pages
const AdminClassManagement = lazy(
  () => import("./pages/admin/ClassManagement")
);
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));

// Common pages
const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case UserRole.ADMIN:
      return <Navigate to="/admin/dashboard" replace />;
    case UserRole.INSTRUCTOR:
      return <Navigate to="/instructor/dashboard" replace />;
    case UserRole.USER:
      return <Navigate to="/user/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public home route that's visible when logged out */}
              <Route path="/" element={<Home />} />

              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Role-based redirect */}
              <Route path="/dashboard" element={<RoleBasedRedirect />} />

              {/* Protected routes - only accessible when logged in */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  {/* User routes */}
                  <Route path="/user/dashboard" element={<UserDashboard />} />
                  <Route path="/classes" element={<ClassList />} />
                  <Route path="/classes/:classId" element={<ClassDetails />} />
                  <Route path="/my-bookings" element={<BookingList />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/friends" element={<FriendsPage />} />
                  <Route path="/user/friends" element={<FriendsPage />} />

                  {/* Instructor routes */}
                  <Route
                    path="/instructor/dashboard"
                    element={<InstructorDashboard />}
                  />

                  {/* Admin routes */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route
                    path="/admin/classes"
                    element={<AdminClassManagement />}
                  />

                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
