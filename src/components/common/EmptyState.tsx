import { motion } from "motion/react";
import React from "react";

interface EmptyStateProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  imageSrc,
  imageAlt = "empty state illustration",
  title,
  description,
  className = "",
}) => {
  return (
    <motion.div
      className={`flex h-full w-full flex-col items-center justify-center p-8 text-white ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto flex max-w-sm flex-col items-center space-y-2 text-center">
        <img src={imageSrc} alt={imageAlt} className="h-33 w-33" />
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
    </motion.div>
  );
};
