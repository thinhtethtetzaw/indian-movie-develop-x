import TrashIcon from "@/assets/svgs/icon-trash.svg?react";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { motion } from "motion/react";

interface RecentSearchProps {
  recentlySearched: string[];
  onItemClick: (item: string) => void;
  onClearRecent: () => void;
}

export function RecentSearch({
  recentlySearched,
  onItemClick,
  onClearRecent,
}: RecentSearchProps) {
  if (recentlySearched.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.3, delay: 0.5 },
      }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div>
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between px-4">
            <p className="text-base font-semibold text-white">
              {t("pages.search.recent")}
            </p>

            <Button variant="ghost" size="icon" onClick={onClearRecent}>
              <TrashIcon />
            </Button>
          </div>

          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 pl-4 last:pr-4">
            {recentlySearched.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, rotateX: -5 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: Number(index) * 0.07,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  rotateX: -5,
                  transition: {
                    duration: 0.3,
                    delay: (recentlySearched.length - 1 - index) * 0.07,
                  },
                }}
                layout
                key={item}
                className="flex-shrink-0 cursor-pointer rounded-md bg-white/10 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-gray-300 transition-colors hover:bg-white/20"
                onClick={() => onItemClick(item)}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
