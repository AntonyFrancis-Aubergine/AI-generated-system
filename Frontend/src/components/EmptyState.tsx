import React from "react";
import { motion } from "framer-motion";
import "../styles/emptyState.css";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: "empty" | "search" | "calendar" | "classes";
}

export function EmptyState({
  title,
  description,
  action,
  illustration = "empty",
}: EmptyStateProps) {
  // Illustrations from undraw.co (open source)
  const illustrations = {
    empty:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Open%20Mouth.png",
    search:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Magnifying%20Glass%20Tilted%20Right.png",
    calendar:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Spiral%20Calendar.png",
    classes:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Person%20in%20Lotus%20Position.png",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="empty-state"
    >
      {/* Illustration with animation */}
      <motion.img
        src={illustrations[illustration]}
        alt="Illustration"
        width={150}
        height={150}
        className="empty-illustration"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2,
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3 className="empty-title">{title}</h3>
        <p className="empty-description">{description}</p>

        {action && (
          <button className="empty-button" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
