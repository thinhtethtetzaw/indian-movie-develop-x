import TrashIcon from "@/assets/svgs/icon-trash.svg?react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { t } from "i18next";
import { motion } from "motion/react";
import { useState } from "react";

interface RecentSearchProps {
  onItemClick: (item: string) => void;
}

export function RecentSearch({ onItemClick }: RecentSearchProps) {
  // Data fetching
  const recentlySearched =
    useLiveQuery(() =>
      db.recentSearch
        .orderBy("updated_at")
        .reverse()
        .toArray()
        .catch((err) => {
          console.error("Dexie query error:", err);
          return [];
        }),
    ) ?? [];

  // Add state to control animation
  const [isClearing, setIsClearing] = useState(false);

  if (recentlySearched?.length === 0) return null;

  async function handleClearRecent() {
    setIsClearing(true);

    // Wait for exit animation to complete before clearing data
    setTimeout(async () => {
      await db.recentSearch.clear();
      setIsClearing(false);
    }, 300); // Match the animation duration
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: isClearing ? 0 : 1,
        y: isClearing ? 20 : 0,
      }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div>
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between px-4">
            <p className="text-base font-semibold text-white">
              {t("pages.search.recent")}
            </p>

            <Button variant="ghost" size="icon" onClick={handleClearRecent}>
              <TrashIcon />
            </Button>
          </div>

          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 pl-4 last:pr-4">
            {recentlySearched.map((item, index) => (
              <motion.div
                // initial={{ opacity: 0, rotateX: -5 }}
                // animate={{ opacity: 1 }}
                // transition={{
                //   duration: 0.3,
                //   delay: Number(index) * 0.07,
                // }}
                // layout
                key={item.search || index}
                className="flex-shrink-0 cursor-pointer rounded-md bg-white/10 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-gray-300 transition-colors hover:bg-white/20"
                onClick={() => onItemClick(item.search)}
              >
                {item.search}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
