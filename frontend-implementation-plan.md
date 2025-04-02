# Frontend Implementation Plan for Fitness Class Booking System

## Overview

This document outlines the implementation plan for building the frontend of a fitness class booking system that integrates with the API endpoints defined in the Postman collection. The frontend will be built using React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: React with TypeScript
- **State Management**: Context API with hooks
- **Styling**: Tailwind CSS with custom components
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router
- **Animations**: Framer Motion

## Project Structure

```
frontend/
├── src/
│   ├── assets/             # Static assets
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Base UI components (Button, Input, etc.)
│   │   └── domain/         # Domain-specific components
│   ├── context/            # Context providers
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── user/           # User role pages
│   │   ├── instructor/     # Instructor role pages
│   │   └── admin/          # Admin role pages
│   ├── services/           # API service layer
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Entry point
└── ...
```

## Core Features Based on API Endpoints

### 1. Authentication System

#### Components to Create:

- Login form
- Registration form
- Protected route wrapper

#### Integration with APIs:

- `POST /api/v1/auth/register` - Registration endpoint
- `POST /api/v1/auth/login` - Login endpoint

#### Implementation Details:

```tsx
// AuthContext.tsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login function that calls the login API
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      setIsAuthenticated(true);
      localStorage.setItem("token", response.data.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Similar functions for register and logout

  // ...
};

// ProtectedRoute.tsx
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
```

### 2. Fitness Class Management

#### Components to Create:

- Fitness class list with filters
- Fitness class card
- Class detail view
- Book class button
- Pagination component

#### Integration with APIs:

- `GET /api/v1/fitness-classes` - Get all classes with filtering
- `GET /api/v1/fitness-classes/:id` - Get class details
- `GET /api/v1/fitness-class-categories` - Get all categories

#### Implementation Details:

```tsx
// FitnessClassList.tsx
export const FitnessClassList = () => {
  const [classes, setClasses] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fitnessClassService.getClasses(
          page,
          10,
          filters
        );
        setClasses(response.classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [page, filters]);

  // Filter handling, pagination, etc.

  return (
    <div>
      <FitnessClassFilter onFilterChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((fitnessClass) => (
          <FitnessClassCard key={fitnessClass.id} fitnessClass={fitnessClass} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(classes.length / 10)}
        onPageChange={setPage}
      />
    </div>
  );
};
```

### 3. User-Specific Features

#### Components to Create:

- User dashboard
- Booking history
- Booking card

#### Integration with APIs:

- `GET /api/v1/user/bookings` - Get user bookings
- `POST /api/v1/fitness-class-bookings` - Book a class
- `DELETE /api/v1/fitness-class-bookings/:id` - Cancel booking
- `GET /api/v1/fitness-class-bookings/check/:classId` - Check booking status

#### Implementation Details:

```tsx
// UserDashboard.tsx
export const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getUserBookings();
        setBookings(response.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId);
      // Update bookings list
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <div>
      <h1>My Bookings</h1>

      {/* Upcoming bookings */}
      <div className="mb-8">
        <h2>Upcoming Classes</h2>
        {upcomingBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onCancel={() => handleCancelBooking(booking.id)}
          />
        ))}
      </div>

      {/* Past bookings */}
      <div>
        <h2>Past Classes</h2>
        {pastBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} isPast />
        ))}
      </div>
    </div>
  );
};
```

### 4. Instructor-Specific Features

#### Components to Create:

- Instructor dashboard
- Class management interface
- Class creation/edit form

#### Integration with APIs:

- `GET /api/v1/instructor/classes` - Get instructor classes
- `POST /api/v1/fitness-classes` - Create class
- `PUT /api/v1/fitness-classes/:id` - Update class
- `DELETE /api/v1/fitness-classes/:id` - Delete class

#### Implementation Details:

```tsx
// ClassForm.tsx
export const ClassForm = ({ initialData, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(classFormSchema),
    defaultValues: initialData || {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label>Class Name</label>
        <input {...register("name")} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      {/* Other form fields */}

      <button type="submit">Save</button>
    </form>
  );
};

// InstructorDashboard.tsx
export const InstructorDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await instructorService.getClasses();
        setClasses(response.classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleCreateClass = async (data) => {
    try {
      const newClass = await instructorService.createClass(data);
      setClasses([newClass, ...classes]);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  // Similar functions for update and delete

  return (
    <div>
      <h1>Instructor Dashboard</h1>

      <button onClick={() => setIsFormOpen(true)}>Create New Class</button>

      {isFormOpen && (
        <ClassForm
          initialData={selectedClass}
          onSubmit={selectedClass ? handleUpdateClass : handleCreateClass}
        />
      )}

      <div className="mt-8">
        <h2>My Classes</h2>
        {/* List of classes with edit/delete options */}
      </div>
    </div>
  );
};
```

### 5. Admin-Specific Features

#### Components to Create:

- Admin dashboard
- Admin class management
- User management interface

#### Integration with APIs:

- `GET /api/admin/fitness-classes` - Get all classes (admin)
- `POST /api/admin/fitness-classes` - Create class (admin)
- `PUT /api/admin/fitness-classes/:id` - Update class (admin)
- `DELETE /api/admin/fitness-classes/:id` - Delete class (admin)

#### Implementation Details:

```tsx
// AdminDashboard.tsx
export const AdminDashboard = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await adminService.getAllClasses();
        setClasses(response.classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  // Functions for create, update, delete

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats cards */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3>Total Classes</h3>
          <p className="text-3xl font-bold">{classes.length}</p>
        </div>
        {/* More stats cards */}
      </div>

      {/* Class management interface */}
      <div className="mt-8">
        <h2>Manage Classes</h2>
        {/* Table of classes with actions */}
      </div>
    </div>
  );
};
```

## API Services

Create service files for each domain to handle API calls:

```tsx
// src/services/auth.service.ts
import api from "./api";

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post("/api/v1/auth/login", credentials);
    return response.data.data;
  },

  async register(userData: RegisterRequest): Promise<void> {
    await api.post("/api/v1/auth/register", userData);
  },
};

// src/services/fitnessClass.service.ts
export const fitnessClassService = {
  async getClasses(
    page = 1,
    limit = 10,
    filters = {}
  ): Promise<FitnessClassesResponse> {
    const params = { page, limit, ...filters };
    const response = await api.get("/api/v1/fitness-classes", { params });
    return response.data.data;
  },

  // Other methods for class operations
};

// Additional service files for other domains
```

## Routing Setup

```tsx
// App.tsx
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes - User */}
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

          {/* Instructor routes */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Home - redirects based on role */}
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

## Implementation Phases

### Phase 1: Setup and Authentication

1. Set up project with React, TypeScript, and Tailwind CSS
2. Create UI component library (Button, Input, etc.)
3. Implement authentication context and services
4. Build login and registration pages
5. Create protected route component

### Phase 2: User-Facing Features

1. Implement fitness class listing with filters
2. Create class detail view
3. Build booking functionality
4. Develop user dashboard with booking history

### Phase 3: Instructor Features

1. Create instructor dashboard
2. Implement class management interface
3. Build forms for creating and editing classes

### Phase 4: Admin Features

1. Develop admin dashboard with statistics
2. Create admin class management interface
3. Implement user management features

### Phase 5: Refinement and Polish

1. Add animations and transitions
2. Improve error handling and feedback
3. Ensure responsive design
4. Add loading states
5. Implement comprehensive testing

## Conclusion

This implementation plan outlines the components, services, and pages needed to build a frontend for the fitness class booking system that integrates with the API endpoints defined in the Postman collection. Following this plan will result in a complete, functional application with role-based features for users, instructors, and administrators.
