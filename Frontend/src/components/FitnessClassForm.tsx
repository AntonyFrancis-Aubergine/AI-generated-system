import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { fitnessClassService } from "../services/fitnessClass.service";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FitnessClass } from "../types/fitnessClass";
import { motion } from "framer-motion";

// Validation schema for fitness class form
const fitnessClassSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    categoryId: z.string().min(1, "Please select a category"),
    startsAt: z.string().min(1, "Start date is required"),
    endsAt: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startsAt);
      const end = new Date(data.endsAt);
      return end > start;
    },
    {
      message: "End time must be after start time",
      path: ["endsAt"],
    }
  );

type FitnessClassFormValues = z.infer<typeof fitnessClassSchema>;

interface FitnessClassFormProps {
  initialData?: FitnessClass;
  onSubmit: (data: FitnessClassFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function FitnessClassForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: FitnessClassFormProps) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // Format date for datetime-local input
  const formatDateTimeLocal = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FitnessClassFormValues>({
    resolver: zodResolver(fitnessClassSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          categoryId: initialData.categoryId,
          startsAt: formatDateTimeLocal(initialData.startsAt),
          endsAt: formatDateTimeLocal(initialData.endsAt),
        }
      : {
          name: "",
          categoryId: "",
          startsAt: "",
          endsAt: "",
        },
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await fitnessClassService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleFormSubmit = (data: FitnessClassFormValues) => {
    // Add instructorId if creating new class
    if (!initialData && user) {
      data = {
        ...data,
        instructorId: user.id,
      } as FitnessClassFormValues;
    }

    onSubmit(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? "Edit Fitness Class" : "Create New Fitness Class"}
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Class Name</label>
            <Input
              {...register("name")}
              placeholder="E.g., Yoga for Beginners"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              {...register("categoryId")}
              className={`w-full h-10 rounded-md border ${
                errors.categoryId ? "border-red-500" : "border-input"
              } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Start Date & Time
            </label>
            <Input
              type="datetime-local"
              {...register("startsAt")}
              className={errors.startsAt ? "border-red-500" : ""}
            />
            {errors.startsAt && (
              <p className="mt-1 text-sm text-red-500">
                {errors.startsAt.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              End Date & Time
            </label>
            <Input
              type="datetime-local"
              {...register("endsAt")}
              className={errors.endsAt ? "border-red-500" : ""}
            />
            {errors.endsAt && (
              <p className="mt-1 text-sm text-red-500">
                {errors.endsAt.message}
              </p>
            )}
          </div>

          <div className="flex gap-4 justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : initialData
                ? "Update Class"
                : "Create Class"}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
