import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FitnessClass, FitnessClassFilters } from "../../types/fitnessClass";
import { fitnessClassService } from "../../services/fitnessClass.service";
import { FitnessClassCard } from "../../components/FitnessClassCard";
import { FitnessClassFilter } from "../../components/FitnessClassFilter";
import { EmptyState } from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { toast } from "../../components/ui/toast";
import "../../styles/fitnessClasses.css";

export default function FitnessClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<FitnessClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [bookedClassIds, setBookedClassIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FitnessClassFilters>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Animation variants for staggered list animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Fetch fitness classes with filtering
  useEffect(() => {
    async function fetchClasses() {
      setLoading(true);
      try {
        const response = await fitnessClassService.getClasses(page, 9, filters);
        setClasses(response.classes);
        setTotalPages(Math.ceil(response.total / response.limit));

        // Check which classes are already booked
        await checkBookedClasses(response.classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast({
          title: "Error",
          description: "Failed to load fitness classes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, [page, filters]);

  // Check which classes the user has already booked
  async function checkBookedClasses(fitnessClasses: FitnessClass[]) {
    try {
      const bookedIds = new Set<string>();

      // In a real implementation, we'd make a single API call to get all bookings
      // For demonstration, we'll check each class individually
      for (const cls of fitnessClasses) {
        const isBooked = await fitnessClassService.isClassBooked(cls.id);
        if (isBooked) {
          bookedIds.add(cls.id);
        }
      }

      setBookedClassIds(bookedIds);
    } catch (error) {
      console.error("Error checking booked classes:", error);
    }
  }

  // Handle booking a class
  const handleBookClass = async (classId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a class",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      await fitnessClassService.bookClass({ fitnessClassId: classId });
      setBookedClassIds((prev) => new Set([...prev, classId]));
      toast({
        title: "Success",
        description: "Class booked successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error booking class:", error);
      toast({
        title: "Booking Failed",
        description: "Failed to book the class. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FitnessClassFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  // Render loading state
  if (loading && classes.length === 0) {
    return (
      <div className="fitness-classes-container">
        <h1 className="fitness-classes-title">Fitness Classes</h1>
        <div className="fitness-classes-loading">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="loading-spinner"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fitness-classes-container">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fitness-classes-title"
      >
        Fitness Classes
      </motion.h1>

      {/* Filter component */}
      <FitnessClassFilter onFilterChange={handleFilterChange} />

      {/* Display empty state if no classes found */}
      {classes.length === 0 ? (
        <EmptyState
          title="No classes found"
          description="We couldn't find any fitness classes matching your criteria. Try adjusting your filters or check back later!"
          illustration="search"
          action={{
            label: "Clear Filters",
            onClick: () => handleFilterChange({}),
          }}
        />
      ) : (
        <>
          {/* Classes grid with staggered animation */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="classes-grid"
          >
            {classes.map((fitnessClass) => (
              <motion.div key={fitnessClass.id} variants={item}>
                <FitnessClassCard
                  fitnessClass={fitnessClass}
                  onBook={() => handleBookClass(fitnessClass.id)}
                  isBooked={bookedClassIds.has(fitnessClass.id)}
                  userRole="USER"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-controls">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`pagination-button ${
                    page === 1
                      ? "pagination-button-disabled"
                      : "pagination-button-primary"
                  }`}
                >
                  Previous
                </button>
                <div className="pagination-indicator">
                  Page {page} of {totalPages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`pagination-button ${
                    page === totalPages
                      ? "pagination-button-disabled"
                      : "pagination-button-primary"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
