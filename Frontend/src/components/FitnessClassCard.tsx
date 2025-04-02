import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, User } from "lucide-react";
import { formatDate, formatTime } from "../utils/dateUtils";
import { FitnessClass } from "../types/fitnessClass";
import { Button } from "./ui/button";
import "../styles/fitnessClassCard.css";

interface FitnessClassCardProps {
  fitnessClass: FitnessClass;
  onBook?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isBooked?: boolean;
  userRole: "USER" | "INSTRUCTOR" | "ADMIN";
}

export function FitnessClassCard({
  fitnessClass,
  onBook,
  onEdit,
  onDelete,
  isBooked = false,
  userRole,
}: FitnessClassCardProps) {
  // Get category CSS class based on name
  const getCategoryClass = (categoryName: string) => {
    const categoryMap: Record<string, string> = {
      Yoga: "category-yoga",
      Pilates: "category-pilates",
      Cardio: "category-cardio",
      Strength: "category-strength",
      HIIT: "category-hiit",
      Zumba: "category-zumba",
    };

    return categoryMap[categoryName] || "category-default";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="class-card"
    >
      <div className="card-content">
        {/* Class category badge */}
        <div className="card-header">
          <span
            className={`category-badge ${getCategoryClass(
              fitnessClass.category.name
            )}`}
          >
            {fitnessClass.category.name}
          </span>

          {/* Status badge for booked classes */}
          {isBooked && <span className="booked-badge">Booked</span>}
        </div>

        {/* Class name */}
        <h3 className="class-title">{fitnessClass.name}</h3>

        {/* Date and time */}
        <div className="class-detail">
          <Calendar className="detail-icon" />
          <span>{formatDate(fitnessClass.startsAt)}</span>
        </div>

        <div className="class-detail">
          <Clock className="detail-icon" />
          <span>
            {formatTime(fitnessClass.startsAt)} -{" "}
            {formatTime(fitnessClass.endsAt)}
          </span>
        </div>

        {/* Instructor */}
        <div className="class-detail">
          <User className="detail-icon" />
          <span>{fitnessClass.instructor.name}</span>
        </div>

        {/* Action buttons based on user role */}
        <div className="card-actions">
          {userRole === "USER" && (
            <Button
              onClick={onBook}
              disabled={isBooked}
              variant={isBooked ? "outline" : "default"}
              className="action-button"
            >
              {isBooked ? "Already Booked" : "Book Class"}
            </Button>
          )}

          {(userRole === "ADMIN" ||
            (userRole === "INSTRUCTOR" &&
              fitnessClass.instructor.id ===
                localStorage.getItem("userId"))) && (
            <>
              <Button
                onClick={onEdit}
                variant="outline"
                size="sm"
                className="action-button-half"
              >
                Edit
              </Button>
              <Button
                onClick={onDelete}
                variant="destructive"
                size="sm"
                className="action-button-half"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
