import NavHeader from "@/components/common/layouts/NavHeader";
import MovieCard, { type Movie } from "@/components/common/MovieCard";
import { Tag } from "@/components/common/Tag";
import { Button } from "@/components/ui/button";
import { MOCK_MOVIES } from "@/constants/mock";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { CheckIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  parseAsString,
  parseAsStringEnum,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/bookmarks/")({
  component: RouteComponent,
});

const TAGS = {
  all: "All",
  movies: "Movies",
  "tv-series": "TV Series",
  animation: "Animation",
} as const;

// Animation constants for better maintainability
const ANIMATION_CONFIG = {
  tag: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: (index: number) => ({
      duration: 0.3,
      delay: index * 0.05,
    }),
  },
  selectionIndicator: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  },
  checkIcon: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    exit: { scale: 0, rotate: 180 },
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
  bottomDrawer: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  movieCard: {
    initial: { scale: 1, opacity: 1 },
    animate: { scale: 1, opacity: 1 },
    exit: {
      scale: 0.8,
      opacity: 0,
      y: -10,
      rotateX: -5,
    },
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      duration: 0.3,
    },
  },
} as const;

function RouteComponent() {
  const { t } = useTranslation();

  // Query state management
  const [mode, setMode] = useQueryState(
    "mode",
    parseAsStringEnum(["list", "edit"]).withDefault("list"),
  );
  const [searchState] = useQueryStates({
    mode: parseAsStringEnum(["list", "edit"]).withDefault("list"),
    tags: parseAsString.withDefault("all"),
  });

  // Local state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // IndexDB bookmarks
  const allBookmarks = useLiveQuery(() => db.bookmarks.toArray()) ?? [];

  // Memoized computed values
  const bookmarkedMovies = useMemo(
    () =>
      MOCK_MOVIES.filter((movie) =>
        allBookmarks.some((bookmark) => bookmark.id === movie.id),
      ),
    [allBookmarks],
  );

  const isAllSelected = useMemo(
    () => selectedItems.size === bookmarkedMovies.length,
    [selectedItems.size, bookmarkedMovies.length],
  );

  // Helper functions
  const isSelected = useCallback(
    (movieId: string) => selectedItems.has(movieId),
    [selectedItems],
  );

  const handleItemSelect = useCallback(
    (movieId: string) => {
      if (mode !== "edit") return;

      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(movieId)) {
          newSet.delete(movieId);
        } else {
          newSet.add(movieId);
        }
        return newSet;
      });
    },
    [mode],
  );

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(bookmarkedMovies.map((movie) => movie.id)));
    }
  }, [isAllSelected, bookmarkedMovies]);

  const handleRemoveSelected = useCallback(async () => {
    if (selectedItems.size > 0) {
      await db.bookmarks.bulkDelete(Array.from(selectedItems));
    }
    setSelectedItems(new Set());
    setMode("list");
  }, [selectedItems, setMode]);

  const handleCancelEdit = useCallback(() => {
    setMode("list");
    setSelectedItems(new Set());
  }, [setMode]);

  const handleModeToggle = useCallback(
    () => setMode(mode === "list" ? "edit" : "list"),
    [mode, setMode],
  );

  // Render functions
  const renderSelectionIndicator = useCallback(
    (movieId: string) => (
      <AnimatePresence>
        {mode === "edit" && (
          <motion.div
            className={cn(
              "absolute top-2 right-3 z-10 size-6 cursor-pointer rounded-full border-2 p-1",
              isSelected(movieId)
                ? "bg-brand-red border-transparent"
                : "border-white/30 bg-white/50",
            )}
            onClick={() => handleItemSelect(movieId)}
            whileHover={ANIMATION_CONFIG.selectionIndicator.hover}
            whileTap={ANIMATION_CONFIG.selectionIndicator.tap}
            initial={ANIMATION_CONFIG.selectionIndicator.initial}
            animate={ANIMATION_CONFIG.selectionIndicator.animate}
            exit={ANIMATION_CONFIG.selectionIndicator.exit}
            transition={{
              ...ANIMATION_CONFIG.selectionIndicator.transition,
              delay: Number(movieId) * 0.05,
            }}
          >
            <AnimatePresence mode="wait">
              {isSelected(movieId) && (
                <motion.div
                  initial={ANIMATION_CONFIG.checkIcon.initial}
                  animate={ANIMATION_CONFIG.checkIcon.animate}
                  exit={ANIMATION_CONFIG.checkIcon.exit}
                  transition={ANIMATION_CONFIG.checkIcon.transition}
                >
                  <CheckIcon className="text-forground h-full w-full stroke-3" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    ),
    [mode, isSelected, handleItemSelect],
  );

  const renderMovieCard = useCallback(
    (movie: Movie, index: number) => (
      <motion.div
        key={movie.id}
        className="relative flex-shrink-0"
        initial={ANIMATION_CONFIG.movieCard.initial}
        animate={ANIMATION_CONFIG.movieCard.animate}
        exit={ANIMATION_CONFIG.movieCard.exit}
        transition={ANIMATION_CONFIG.movieCard.transition}
        layout
      >
        {renderSelectionIndicator(movie.id)}
        <MovieCard
          movie={movie}
          showFavoriteButton={false}
          onClick={() => mode === "edit" && handleItemSelect(movie.id)}
          index={index}
        />
      </motion.div>
    ),
    [renderSelectionIndicator, mode, handleItemSelect],
  );

  const renderBottomDrawer = useCallback(
    () => (
      <AnimatePresence>
        {mode === "edit" && (
          <motion.div
            className="fixed right-0 bottom-0 left-0 z-40 mx-auto max-w-md rounded-t-3xl border-t border-[#444444] bg-[#2B2B2B] backdrop-blur-sm"
            initial={ANIMATION_CONFIG.bottomDrawer.initial}
            animate={ANIMATION_CONFIG.bottomDrawer.animate}
            exit={ANIMATION_CONFIG.bottomDrawer.exit}
            transition={ANIMATION_CONFIG.bottomDrawer.transition}
          >
            <div className="flex flex-col gap-4 px-5 py-4">
              {/* Header with selection count and close button */}
              <div className="flex items-center justify-between py-2">
                <span className="text-foreground text-lg font-semibold">
                  {selectedItems.size} Selected
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="[&_svg:not([class*='size-'])]:size-6"
                  onClick={handleCancelEdit}
                >
                  <X />
                </Button>
              </div>

              {/* Action buttons */}
              <div className="mb-4 flex gap-3">
                <Button
                  variant="secondary"
                  onClick={handleSelectAll}
                  className="h-13 flex-1 rounded-full bg-white/8 text-base hover:bg-white/20"
                >
                  {isAllSelected
                    ? t("pages.bookmarks.deselectAll")
                    : t("pages.bookmarks.selectAll")}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleRemoveSelected}
                  disabled={selectedItems.size === 0}
                  className="hover:bg-brand-red h-13 flex-1 rounded-full bg-white/8 bg-linear-to-b from-[#FF0040] to-[#990026] text-base disabled:opacity-50"
                >
                  {t("pages.bookmarks.remove")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    ),
    [
      mode,
      selectedItems.size,
      handleCancelEdit,
      handleSelectAll,
      isAllSelected,
      t,
      handleRemoveSelected,
    ],
  );

  const renderTags = useCallback(
    () => (
      <div className="scrollbar-hide flex items-center gap-x-1.5 overflow-auto">
        {Object.entries(TAGS).map(([key, label], index) => (
          <motion.div
            initial={ANIMATION_CONFIG.tag.initial}
            animate={ANIMATION_CONFIG.tag.animate}
            transition={ANIMATION_CONFIG.tag.transition(index)}
          >
            <Tag
              key={key}
              size="lg"
              className={cn("", {
                "ml-4": index === 0,
                "mr-4": index === Object.keys(TAGS).length - 1,
              })}
              variant={searchState.tags === key ? "active" : "default"}
            >
              {label}
            </Tag>
          </motion.div>
        ))}
      </div>
    ),
    [searchState.tags],
  );

  const renderMovieGrid = useCallback(
    () => (
      <div className="mt-5 px-4 pb-32">
        <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
          <AnimatePresence mode="popLayout">
            {bookmarkedMovies.map((movie, index) =>
              renderMovieCard(movie, index),
            )}
          </AnimatePresence>
        </div>
      </div>
    ),
    [bookmarkedMovies, renderMovieCard],
  );

  return (
    <div className="relative h-full">
      <NavHeader
        isShowBack={false}
        title={t("pages.bookmarks.title")}
        rightNode={
          <Button variant="ghost" onClick={handleModeToggle}>
            {mode === "list"
              ? t("pages.bookmarks.edit")
              : t("pages.bookmarks.cancel")}
          </Button>
        }
      />

      <div className="mt-5">
        {renderTags()}
        {renderMovieGrid()}
      </div>

      {renderBottomDrawer()}
    </div>
  );
}
