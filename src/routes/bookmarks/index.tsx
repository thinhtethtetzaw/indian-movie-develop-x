import NavHeader from "@/components/common/layouts/NavHeader";
import MovieCard, { type Movie } from "@/components/common/MovieCard";
import { Tag } from "@/components/common/Tag";
import { Button } from "@/components/ui/button";
import { MOCK_MOVIES } from "@/constants/mock";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  parseAsString,
  parseAsStringEnum,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { useState } from "react";
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

function RouteComponent() {
  const { t } = useTranslation();
  const [mode, setMode] = useQueryState(
    "mode",
    parseAsStringEnum(["list", "edit"]).withDefault("list"),
  );
  const [searchState, setSearchState] = useQueryStates({
    mode: parseAsStringEnum(["list", "edit"]).withDefault("list"),
    tags: parseAsString.withDefault("all"),
  });
  const [currentBookmakrs, setCurrentBookmarks] = useState<Movie[]>([
    MOCK_MOVIES[0],
  ]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Helper functions
  const isInBookmarks = (movie: Movie) =>
    currentBookmakrs.some(
      (currentBookmakrs) => currentBookmakrs.id === movie.id,
    );

  const isSelected = (movieId: string) => selectedItems.has(movieId);

  const isAllSelected = selectedItems.size === MOCK_MOVIES.length;

  // Event handlers
  const handleBookmark = (movie: Movie) => {
    if (isInBookmarks(movie)) {
      setCurrentBookmarks(currentBookmakrs.filter((b) => b.id !== movie.id));
    } else {
      setCurrentBookmarks([...currentBookmakrs, movie]);
    }
  };

  const handleItemSelect = (movieId: string) => {
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
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(MOCK_MOVIES.map((movie) => movie.id)));
    }
  };

  const handleRemoveSelected = () => {
    setCurrentBookmarks((prev) =>
      prev.filter((movie) => !selectedItems.has(movie.id)),
    );
    setSelectedItems(new Set());
    setMode("list");
  };

  const handleCancelEdit = () => {
    setMode("list");
    setSelectedItems(new Set());
  };

  const handleModeToggle = () => setMode(mode === "list" ? "edit" : "list");

  // Render functions
  const renderSelectionIndicator = (movieId: string) => (
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: Number(movieId) * 0.05,
          }}
        >
          <AnimatePresence mode="wait">
            {isSelected(movieId) && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <CheckIcon className="text-forground h-full w-full stroke-3" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderMovieCard = (movie: Movie) => (
    <div key={movie.id} className="relative flex-shrink-0">
      {renderSelectionIndicator(movie.id)}
      <MovieCard
        movie={movie}
        showFavoriteButton={false}
        onClick={() =>
          mode === "edit" ? handleItemSelect(movie.id) : handleBookmark(movie)
        }
      />
    </div>
  );

  const renderBottomDrawer = () => (
    <AnimatePresence>
      {mode === "edit" && (
        <motion.div
          className="fixed right-0 bottom-0 left-0 z-40 mx-auto max-w-md rounded-t-3xl border-t border-[#444444] bg-[#2B2B2B] backdrop-blur-sm"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
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
        {/* Tags */}
        <div className="scrollbar-hide flex items-center gap-x-1.5 overflow-auto">
          {Object.keys(TAGS).map((key, index) => (
            <Tag
              key={key}
              size="lg"
              className={cn("", {
                "ml-4": index === 0,
                "mr-4": index === Object.keys(TAGS).length - 1,
              })}
              variant={searchState.tags === key ? "active" : "default"}
            >
              {TAGS[key as keyof typeof TAGS]}
            </Tag>
          ))}
        </div>

        {/* Movie Grid */}
        <div className="mt-5 px-4 pb-32">
          <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
            {MOCK_MOVIES.map(renderMovieCard)}
          </div>
        </div>
      </div>

      {renderBottomDrawer()}
    </div>
  );
}
