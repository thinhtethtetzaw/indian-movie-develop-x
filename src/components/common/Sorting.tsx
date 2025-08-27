import { useGetAllCategories } from "@/apis/app/queryGetAllCategories";
import SlidersIcon from "@/assets/svgs/icon-sliders.svg?react";
import { Button } from "@/components/ui/button";
import { COMMON_ANIMATION_CONFIG } from "@/config/animation";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function Sorting() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useQueryState(
    "class",
    parseAsString.withDefault(""),
  );
  const { t } = useTranslation();

  const { allCategories } = useGetAllCategories({});

  const handleSortClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedClass(categoryId);
    setTimeout(() => {
      handleClose();
    }, 300);
  };

  return (
    <>
      <div>
        <Button
          variant="ghost"
          onClick={handleSortClick}
          className="bg-glass flex h-10 w-14 items-center justify-center rounded-full"
        >
          <SlidersIcon className="size-6" />
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[var(--z-dialog)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Content */}
            <div className="relative mx-auto h-full w-full max-w-md">
              <div className="bg-background/70 relative mx-auto flex h-full w-full max-w-md flex-col items-center justify-center backdrop-blur-xl">
                <motion.div
                  whileTap={COMMON_ANIMATION_CONFIG.tag.tap}
                  className="absolute bottom-10"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="size-12 rounded-full bg-gradient-to-b from-white/24 to-white/16"
                  >
                    <X className="size-6" />
                  </Button>
                </motion.div>

                <div className="flex w-full items-center justify-between px-6">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full text-left text-lg font-bold"
                  >
                    {t("pages.home.categories")}
                  </motion.h2>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-white/50"
                    onClick={() => {
                      setSelectedClass("");
                      handleClose();
                    }}
                  >
                    {t("common.clearFilter")}
                  </Button>
                </div>
                <motion.div
                  className="scrollbar-hide mt-8 grid max-h-[60vh] w-full grid-cols-2 gap-4 overflow-y-scroll px-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.02,
                        delayChildren: 0.05,
                      },
                    },
                  }}
                >
                  {allCategories?.map((category) => (
                    <motion.div
                      key={category.category_id}
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 10,
                          scale: 0.9,
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                          },
                        },
                      }}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.15 },
                      }}
                      whileTap={{
                        scale: 0.95,
                        transition: { duration: 0.1 },
                      }}
                      exit={{
                        opacity: 0,
                        y: 10,
                        scale: 0.9,
                      }}
                      className={cn(
                        "w-full cursor-pointer rounded-full bg-white/10 p-4 backdrop-blur-sm transition-colors hover:bg-white/20",
                        {
                          "bg-brand-red hover:bg-brand-red/90 text-white":
                            selectedClass === category.category_id,
                        },
                      )}
                      onTap={() =>
                        handleSelectCategory(category.category_id ?? "")
                      }
                      onClick={() =>
                        handleSelectCategory(category.category_id ?? "")
                      }
                    >
                      <p className="text-center font-medium">
                        {category.category_name}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sorting;
