import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { FitnessClass } from "../../types/fitnessClass";
import { fitnessClassService } from "../../services/fitnessClass.service";
import { FitnessClassCard } from "../../components/FitnessClassCard";
import { FitnessClassForm } from "../../components/FitnessClassForm";
import { EmptyState } from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { toast } from "../../components/ui/toast";

export default function ManageClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<FitnessClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState<FitnessClass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);

  // Animation variants
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

  // Fetch instructor's classes
  useEffect(() => {
    async function fetchClasses() {
      setLoading(true);
      try {
        const instructorClasses =
          await fitnessClassService.getInstructorClasses();
        setClasses(instructorClasses);
      } catch (error) {
        console.error("Error fetching instructor classes:", error);
        toast({
          title: "Error",
          description: "Failed to load your classes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, []);

  // Create a new fitness class
  const handleCreateClass = async (data: any) => {
    setIsSubmitting(true);
    try {
      const newClass = await fitnessClassService.createClass(data);
      setClasses((prev) => [newClass, ...prev]);
      setShowForm(false);
      toast({
        title: "Success",
        description: "Fitness class created successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating class:", error);
      toast({
        title: "Error",
        description: "Failed to create fitness class",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update a fitness class
  const handleUpdateClass = async (data: any) => {
    if (!selectedClass) return;

    setIsSubmitting(true);
    try {
      const updatedClass = await fitnessClassService.updateClass(
        selectedClass.id,
        data
      );
      setClasses((prev) =>
        prev.map((c) => (c.id === updatedClass.id ? updatedClass : c))
      );
      setSelectedClass(null);
      toast({
        title: "Success",
        description: "Fitness class updated successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating class:", error);
      toast({
        title: "Error",
        description: "Failed to update fitness class",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a fitness class
  const handleDeleteClass = async (id: string) => {
    try {
      await fitnessClassService.deleteClass(id);
      setClasses((prev) => prev.filter((c) => c.id !== id));
      setClassToDelete(null);
      setIsModalOpen(false);
      toast({
        title: "Success",
        description: "Fitness class deleted successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting class:", error);
      toast({
        title: "Error",
        description: "Failed to delete fitness class",
        variant: "destructive",
      });
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: string) => {
    setClassToDelete(id);
    setIsModalOpen(true);
  };

  // Edit a class
  const handleEditClass = (fitnessClass: FitnessClass) => {
    setSelectedClass(fitnessClass);
  };

  // Handle form submission
  const handleFormSubmit = (data: any) => {
    if (selectedClass) {
      handleUpdateClass(data);
    } else {
      handleCreateClass(data);
    }
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedClass(null);
  };

  // Render loading state
  if (loading && classes.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Your Classes</h1>
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
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold"
        >
          Manage Your Classes
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={() => {
              setShowForm(true);
              setSelectedClass(null);
            }}
            className="flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>Create Class</span>
          </Button>
        </motion.div>
      </div>

      {/* Form for creating/editing */}
      <AnimatePresence>
        {(showForm || selectedClass) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <FitnessClassForm
              initialData={selectedClass || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Display empty state if no classes */}
      {classes.length === 0 && !showForm ? (
        <EmptyState
          title="No classes yet"
          description="You haven't created any fitness classes yet. Start by creating your first class!"
          illustration="classes"
          action={{
            label: "Create Your First Class",
            onClick: () => setShowForm(true),
          }}
        />
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* List of classes */}
          {classes.map((fitnessClass) => (
            <motion.div key={fitnessClass.id} variants={item}>
              <FitnessClassCard
                fitnessClass={fitnessClass}
                onEdit={() => handleEditClass(fitnessClass)}
                onDelete={() => openDeleteModal(fitnessClass.id)}
                userRole="INSTRUCTOR"
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Delete confirmation modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this fitness class? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setClassToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  classToDelete && handleDeleteClass(classToDelete)
                }
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
