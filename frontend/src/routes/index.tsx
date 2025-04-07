import React from "react";
import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import InstructorLayout from "../layouts/InstructorLayout";
import PublicLayout from "../layouts/PublicLayout";

// Authentication & Public Pages
const Login = lazy(() => import("../pages/public/Login"));
const Register = lazy(() => import("../pages/public/Register"));
const RegisterInstructor = lazy(
  () => import("../pages/public/RegisterInstructor")
);
const HomePage = lazy(() => import("../pages/public/HomePage"));
const AboutPage = lazy(() => import("../pages/public/AboutPage"));
const AuthRedirect = lazy(() => import("../pages/public/AuthRedirect"));

// User Pages
const Dashboard = lazy(() => import("../pages/user/Dashboard"));
const FitClasses = lazy(() => import("../pages/user/FitClasses"));
const FitClassDetail = lazy(() => import("../pages/user/FitClassDetail"));
const UserProfile = lazy(() => import("../pages/user/Profile"));
const UserBookings = lazy(() => import("../pages/user/Bookings"));
const FriendsPage = lazy(() => import("../pages/user/FriendsPage"));

const userRoutes: RouteObject[] = [
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
      {
        path: "classes",
        element: <FitClasses />,
      },
      {
        path: "classes/:classId",
        element: <FitClassDetail />,
      },
      {
        path: "bookings",
        element: <UserBookings />,
      },
      {
        path: "friends",
        element: <FriendsPage />,
      },
    ],
  },
];
