"use client";

import { Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import { BaseModal } from "../BaseModal/BaseModal";

interface SkeletonGridLoaderProps {
  items?: number;
  cols?: number;
  title: string;
  onClose: () => void;
  titleColor?: string;
  className?: string;
}

export function SkeletonGridLoader({
  items = 6,
  cols = 3,
  title,
  onClose,
  titleColor = "text-white",
  className = "",
}: SkeletonGridLoaderProps) {
  return (
    <BaseModal onClose={onClose} title={title} titleColor={titleColor} maxWidth="62.5rem">
      <div
        className={`grid gap-2.5 shadow-bgdarkblue border-primary rounded-md p-8 border-[5px] bg-bgdarkblue ${className}`}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {[...Array(items)].map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center rounded-md shadow-bgdarkblue border-bgdarkblue font-bold p-4 bg-gradient-to-b from-bluecustom to-bgtextdark"
          >
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton
              variant="rectangular"
              width={256}
              height={256}
              className="rounded-lg my-4"
            />
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={20} />
          </motion.div>
        ))}
      </div>
    </BaseModal>
  );
}
