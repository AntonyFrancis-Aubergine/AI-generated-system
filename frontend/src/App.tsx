import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import ProtectedRoute from './components/ProtectedRoute'
import theme from './utils/theme'
import Loading from './components/Loading'
import ClassDetails from './pages/user/ClassDetails'

// Auth pages
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))

// User pages
const ClassList = lazy(() => import('./pages/user/ClassList'))
const BookingList = lazy(() => import('./pages/user/BookingList'))
const UserProfile = lazy(() => import('./pages/user/UserProfile'))

// Admin pages
const AdminClassManagement = lazy(() => import('./pages/admin/ClassManagement'))

// Common pages
const Home = lazy(() => import('./pages/Home'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  {/* Common routes */}
                  <Route path="/" element={<Home />} />

                  {/* User routes */}
                  <Route path="/classes" element={<ClassList />} />
                  <Route path="/classes/:classId" element={<ClassDetails />} />
                  <Route path="/my-bookings" element={<BookingList />} />
                  <Route path="/profile" element={<UserProfile />} />

                  {/* Admin routes */}
                  <Route
                    path="/admin/classes"
                    element={<AdminClassManagement />}
                  />

                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>

              {/* Redirect */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
