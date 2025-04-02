import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { FitnessClass } from "../../types/fitnessClass";
import { fitnessClassService } from "../../services/fitnessClass.service";
import { FitnessClassCard } from "../../components/FitnessClassCard";
import { EmptyState } from "../../components/EmptyState";
import { Calendar, Users, CalendarPlus, Dumbbell } from "lucide-react";
import { toast } from "../../components/ui/toast";
import { Link } from "react-router-dom";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<FitnessClass[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<FitnessClass[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstructorData() {
      setLoading(true);
      try {
        const instructorClasses =
          await fitnessClassService.getInstructorClasses();

        // Calculate statistics
        let studentCount = 0;
        const now = new Date();
        const upcoming: FitnessClass[] = [];

        instructorClasses.forEach((cls) => {
          // Count students (bookings)
          if (cls.bookings) {
            studentCount += cls.bookings.length;
          }

          // Check if class is upcoming
          const startDate = new Date(cls.startsAt);
          if (startDate > now) {
            upcoming.push(cls);
          }
        });

        // Sort upcoming classes by date
        upcoming.sort(
          (a, b) =>
            new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        );

        setClasses(instructorClasses);
        setUpcomingClasses(upcoming.slice(0, 3)); // Show only 3 upcoming classes
        setTotalStudents(studentCount);
      } catch (error) {
        console.error("Error fetching instructor data:", error);
        toast({
          title: "Error",
          description: "Failed to load your classes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchInstructorData();
  }, []);

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

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">
            Manage your fitness classes and view your statistics
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-4 md:mt-0"
        >
          <Link
            to="/instructor/classes"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <CalendarPlus className="mr-2 h-5 w-5" />
            Manage Classes
          </Link>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
        >
          <div className="flex items-center">
            <Calendar className="h-10 w-10 text-blue-500 mr-4" />
            <div>
              <p className="text-gray-500 text-sm">Total Classes</p>
              <h3 className="text-3xl font-bold">{classes.length}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
        >
          <div className="flex items-center">
            <Users className="h-10 w-10 text-green-500 mr-4" />
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <h3 className="text-3xl font-bold">{totalStudents}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
        >
          <div className="flex items-center">
            <Dumbbell className="h-10 w-10 text-purple-500 mr-4" />
            <div>
              <p className="text-gray-500 text-sm">Upcoming Classes</p>
              <h3 className="text-3xl font-bold">{upcomingClasses.length}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Classes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-12"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upcoming Classes</h2>
          <Link
            to="/instructor/classes"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </Link>
        </div>

        {upcomingClasses.length === 0 ? (
          <EmptyState
            title="No upcoming classes"
            description="You don't have any upcoming classes scheduled. Create a new class to get started!"
            illustration="calendar"
            action={{
              label: "Create Class",
              onClick: () => (window.location.href = "/instructor/classes"),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingClasses.map((fitnessClass) => (
              <motion.div
                key={fitnessClass.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FitnessClassCard
                  fitnessClass={fitnessClass}
                  userRole="INSTRUCTOR"
                  onEdit={() =>
                    (window.location.href = `/instructor/classes?edit=${fitnessClass.id}`)
                  }
                  onDelete={() =>
                    (window.location.href = `/instructor/classes?delete=${fitnessClass.id}`)
                  }
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Class Analytics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Class Attendance Overview</h2>
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <motion.div
              className="w-full md:w-1/2 p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4">
                Popular Class Categories
              </h3>

              {/* Simple bar chart for class categories */}
              <div className="space-y-4">
                {["Yoga", "Pilates", "HIIT", "Cardio"].map(
                  (category, index) => {
                    // Random width percentage for demo purposes
                    // In a real app, calculate this from actual data
                    const percent = Math.floor(Math.random() * 80) + 20;
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{category}</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <motion.div
                            className={`h-2.5 rounded-full ${
                              [
                                "bg-blue-600",
                                "bg-green-500",
                                "bg-purple-500",
                                "bg-red-500",
                              ][index % 4]
                            }`}
                            style={{ width: `${percent}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{
                              delay: 0.7 + index * 0.1,
                              duration: 0.5,
                            }}
                          ></motion.div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </motion.div>

            <motion.div
              className="w-full md:w-1/2 p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4">Monthly Classes</h3>

              {/* Monthly trend chart */}
              <div className="h-40 flex items-end justify-between">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(
                  (month, index) => {
                    // Random height for demo purposes
                    // In a real app, calculate this from actual data
                    const height = Math.floor(Math.random() * 80) + 20;
                    return (
                      <div key={month} className="flex flex-col items-center">
                        <motion.div
                          className="w-8 bg-blue-500 rounded-t-md mx-1"
                          style={{ height: `${height}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{
                            delay: 0.8 + index * 0.1,
                            duration: 0.5,
                          }}
                        ></motion.div>
                        <span className="text-xs mt-2">{month}</span>
                      </div>
                    );
                  }
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
