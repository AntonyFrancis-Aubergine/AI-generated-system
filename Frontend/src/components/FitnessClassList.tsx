import { useState, useEffect } from "react";
import { FitnessClass, FitnessClassFilters } from "../types/fitnessClass";
import { fitnessClassService } from "../services/fitnessClass.service";
import { FitnessClassCard } from "./FitnessClassCard";
import { FitnessClassFilter } from "./FitnessClassFilter";
import { Pagination } from "./ui/pagination";
import { toast } from "./ui/toast";

interface FitnessClassListProps {
  userRole: "USER" | "INSTRUCTOR" | "ADMIN";
  onClassSelect?: (fitnessClass: FitnessClass) => void;
}

export function FitnessClassList({
  userRole,
  onClassSelect,
}: FitnessClassListProps) {
  const [classes, setClasses] = useState<FitnessClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FitnessClassFilters>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookedClassIds, setBookedClassIds] = useState<Set<string>>(new Set());

  // Fetch classes based on filters and page
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const response = await fitnessClassService.getClasses(page, 9, filters);
        setClasses(response.classes);
        setTotalPages(Math.ceil(response.total / response.limit));

        // If user role is USER, check which classes are booked
        if (userRole === "USER") {
          await checkBookedClasses(response.classes);
        }
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
    };

    fetchClasses();
  }, [page, filters, userRole]);

  // Check which classes are already booked by the user
  const checkBookedClasses = async (fitnessClasses: FitnessClass[]) => {
    try {
      const bookedIds = new Set<string>();

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
  };

  // Handle booking or cancelling a class
  const handleBookClass = async (classId: string) => {
    try {
      // If already booked, cancel the booking
      if (bookedClassIds.has(classId)) {
        // We would need the booking ID to cancel, but for simplicity we'll just use class ID
        // In a real app, you'd need to store booking IDs or fetch them first
        await fitnessClassService.cancelBooking(classId);
        setBookedClassIds((prev) => {
          const updated = new Set(prev);
          updated.delete(classId);
          return updated;
        });
        toast({
          title: "Success",
          description: "Booking cancelled successfully",
          variant: "default",
        });
      } else {
        // Book the class
        await fitnessClassService.bookClass({ fitnessClassId: classId });
        setBookedClassIds((prev) => new Set([...prev, classId]));
        toast({
          title: "Success",
          description: "Class booked successfully!",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error booking/cancelling class:", error);
      toast({
        title: "Error",
        description: "Failed to book/cancel the class",
        variant: "destructive",
      });
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FitnessClassFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  // If loading and no classes, show loading indicator
  if (loading && classes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <FitnessClassFilter onFilterChange={handleFilterChange} />

      {/* No results message */}
      {classes.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No classes found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your filters or check back later for new classes.
          </p>
          <button
            onClick={() => handleFilterChange({})}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Class grid */}
      {classes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((fitnessClass) => (
            <FitnessClassCard
              key={fitnessClass.id}
              fitnessClass={fitnessClass}
              userRole={userRole}
              isBooked={bookedClassIds.has(fitnessClass.id)}
              onBook={() => handleBookClass(fitnessClass.id)}
              onSelect={() => onClassSelect && onClassSelect(fitnessClass)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
