import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { FitnessClass } from "../../types/fitnessClass";
import { fitnessClassService } from "../../services/fitnessClass.service";
import { FitnessClassCard } from "../../components/FitnessClassCard";
import { EmptyState } from "../../components/EmptyState";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  CalendarCheck,
  CalendarX,
  Activity,
  ArrowRight,
  Search,
  Bell,
  Dumbbell,
  ChevronDown,
  User as UserIcon,
} from "lucide-react";
import { toast } from "../../components/ui/toast";
import { Button } from "../../components/ui/button";
import "../../styles/userDashboard.css";

export default function UserDashboard() {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState<FitnessClass[]>([]);
  const [pastBookings, setPastBookings] = useState<FitnessClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const bookingsData = await fitnessClassService.getUserBookings();

        // Separate upcoming and past bookings based on end time
        const now = new Date();
        const upcomingClasses = bookingsData.filter(
          (booking) => new Date(booking.endsAt) > now
        );
        const pastClasses = bookingsData.filter(
          (booking) => new Date(booking.endsAt) <= now
        );

        setUpcomingBookings(upcomingClasses);
        setPastBookings(pastClasses);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load your bookings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Function to handle cancelling a booking
  const handleCancelBooking = async (classId: string) => {
    try {
      // We would need the booking ID to cancel, but for now we just use class ID
      await fitnessClassService.cancelBooking(classId);

      // Remove cancelled class from the list
      setUpcomingBookings((prev) =>
        prev.filter((booking) => booking.id !== classId)
      );

      toast({
        title: "Success",
        description: "Booking cancelled successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  // Format date for better display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time for easier reading
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
              borderWidth: "4px",
              borderStyle: "solid",
              borderColor: "#3b82f6 transparent #3b82f6 #3b82f6",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Top navigation */}
      <nav className="dashboard-nav">
        <div className="nav-container">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="logo">FitBook</div>
            <div className="nav-items">
              <Link to="/user/dashboard" className="nav-item active">
                Dashboard
              </Link>
              <Link to="/user/classes" className="nav-item">
                Classes
              </Link>
              <Link to="/user/profile" className="nav-item">
                Profile
              </Link>
            </div>
          </div>

          <div className="nav-right">
            <button className="nav-button">
              <Bell size={20} />
            </button>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-avatar">
                <UserIcon size={16} />
              </div>
            </div>
          </div>

          <button
            className="mobile-menu-button"
            onClick={() => setShowMobileNav(!showMobileNav)}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile navigation menu */}
        <div className={`mobile-menu ${showMobileNav ? "open" : ""}`}>
          <div>
            <Link to="/user/dashboard" className="mobile-nav-item active">
              Dashboard
            </Link>
            <Link to="/user/classes" className="mobile-nav-item">
              Classes
            </Link>
            <Link to="/user/profile" className="mobile-nav-item">
              Profile
            </Link>
          </div>
          <div className="mobile-divider"></div>
          <div className="mobile-user-info">
            <div className="user-avatar">
              <UserIcon size={16} />
            </div>
            <div className="mobile-user-details">
              <div className="mobile-user-name">{user?.name}</div>
              <div className="mobile-user-email">{user?.email}</div>
            </div>
            <button className="nav-button" style={{ marginLeft: "auto" }}>
              <Bell size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        {/* Welcome section */}
        <div className="welcome-section">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="dashboard-title">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="dashboard-subtitle">
              Here's an overview of your fitness journey
            </p>
          </motion.div>
        </div>

        {/* Stats overview */}
        <div className="stats-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="stat-card"
          >
            <div className="stat-content">
              <div className="stat-icon blue">
                <CalendarCheck size={24} />
              </div>
              <div>
                <p className="stat-label">Upcoming Classes</p>
                <div className="stat-value">
                  {upcomingBookings.length}
                  <span className="stat-unit">classes</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="stat-card"
          >
            <div className="stat-content">
              <div className="stat-icon purple">
                <Activity size={24} />
              </div>
              <div>
                <p className="stat-label">Total Workouts</p>
                <div className="stat-value">
                  {pastBookings.length}
                  <span className="stat-unit">completed</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="stat-card"
          >
            <div className="stat-content">
              <div className="stat-icon green">
                <Dumbbell size={24} />
              </div>
              <div>
                <p className="stat-label">Next Class</p>
                <div>
                  {upcomingBookings.length > 0 ? (
                    <>
                      <p className="stat-class-name">
                        {upcomingBookings[0].name}
                      </p>
                      <p className="stat-class-date">
                        {new Date(
                          upcomingBookings[0].startsAt
                        ).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <p className="stat-label">No upcoming classes</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="cta-box"
        >
          <div className="cta-content">
            <div className="cta-text">
              <h2 className="cta-title">Ready for your next workout?</h2>
              <p className="cta-subtitle">
                Discover new classes that match your fitness goals
              </p>
            </div>
            <div>
              <Link to="/user/classes">
                <button className="cta-button">
                  <Search size={16} className="cta-button-icon" />
                  Find Classes
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Tab navigation for mobile */}
        <div className="mobile-tabs">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`mobile-tab ${activeTab === "upcoming" ? "active" : ""}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`mobile-tab ${activeTab === "past" ? "active" : ""}`}
          >
            Past Classes
          </button>
        </div>

        {/* Bookings section */}
        <div className="bookings-section">
          {/* Upcoming bookings */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={`upcoming-bookings ${
              activeTab !== "upcoming" && activeTab !== ""
                ? "hidden-on-mobile"
                : ""
            }`}
            style={{
              display:
                activeTab !== "upcoming" && activeTab !== "" ? "none" : "block",
            }}
          >
            <div className="section-header">
              <h2 className="section-title">Upcoming Bookings</h2>
              {upcomingBookings.length > 0 && (
                <Link to="/user/classes" className="section-link">
                  Browse More
                  <ArrowRight size={16} className="section-link-icon" />
                </Link>
              )}
            </div>

            {upcomingBookings.length === 0 ? (
              <EmptyState
                title="No upcoming bookings"
                description="You don't have any upcoming fitness classes booked. Browse classes to find ones that interest you!"
                illustration="calendar"
                action={{
                  label: "Find Classes",
                  onClick: () => (window.location.href = "/user/classes"),
                }}
              />
            ) : (
              <div className="bookings-grid">
                {upcomingBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FitnessClassCard
                      fitnessClass={booking}
                      userRole="USER"
                      isBooked={true}
                      onBook={() => handleCancelBooking(booking.id)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Past bookings */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className={`past-bookings ${
              activeTab !== "past" && activeTab !== "" ? "hidden-on-mobile" : ""
            }`}
            style={{
              display:
                activeTab !== "past" && activeTab !== "" ? "none" : "block",
            }}
          >
            <div className="section-header">
              <h2 className="section-title">Past Classes</h2>
              {pastBookings.length > 5 && (
                <Link to="/user/history" className="section-link">
                  View All
                  <ArrowRight size={16} className="section-link-icon" />
                </Link>
              )}
            </div>

            {pastBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <CalendarX size={32} />
                </div>
                <h3 className="empty-title">No past classes</h3>
                <p className="empty-desc">
                  You haven't completed any classes yet.
                </p>
              </div>
            ) : (
              <div className="table-container">
                <div style={{ overflowX: "auto" }}>
                  <table className="classes-table">
                    <thead className="table-header">
                      <tr>
                        <th>Class</th>
                        <th>Date</th>
                        <th
                          className="category-col"
                          style={{ display: "none" }}
                        >
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastBookings.slice(0, 5).map((booking) => (
                        <tr key={booking.id} className="table-row">
                          <td className="table-cell">
                            <div className="cell-main">{booking.name}</div>
                            <div className="cell-mobile-date">
                              {formatDate(booking.startsAt)}
                            </div>
                          </td>
                          <td className="table-cell">
                            <div className="cell-secondary">
                              {formatDate(booking.startsAt)}
                            </div>
                          </td>
                          <td
                            className="table-cell category-col"
                            style={{ display: "none" }}
                          >
                            <span className="category-badge">
                              {booking.category.name}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {pastBookings.length > 5 && (
                  <div className="table-footer">
                    <Link to="/user/history" className="view-all-link">
                      View all past classes
                    </Link>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
