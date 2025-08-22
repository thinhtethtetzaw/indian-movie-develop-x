import { useGetAllTypes } from "@/apis/app/queryGetAllTypes";
import { useGetMovieListByIds } from "@/apis/app/queryGetMovieListByIds";
import BookmarksEmptyImage from "@/assets/svgs/image-bookmarks-empty.svg?react";
import { EmptyState } from "@/components/common/EmptyState";
import NavHeader from "@/components/common/layouts/NavHeader";
import MovieCard, { MovieCardSkeleton } from "@/components/common/MovieCard";
import { Tag, TagSkeleton } from "@/components/common/Tag";
import { Button } from "@/components/ui/button";
import {
  BOOKMARKS_ANIMATION_CONFIG,
  COMMON_ANIMATION_CONFIG,
} from "@/config/animation";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/stores/useDialogStore";
import type { MovieResponse } from "@/types/api-schema/response";
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

const SKELETON_COUNT = {
  tags: 4,
  movies: 9,
} as const;

function RouteComponent() {
  const { t } = useTranslation();
  const { showDialog } = useDialogStore();

  // Data fetching
  const allBookmarks =
    useLiveQuery(() =>
      db.bookmarks.toArray().catch((err) => {
        console.error("Dexie query error:", err);
        return [];
      }),
    ) ?? [];

  const { movieList, isLoading: isMovieListLoading } = useGetMovieListByIds({
    videoIds: allBookmarks.map((bookmark) => bookmark.id ?? ""),
    queryConfig: {
      enabled: allBookmarks.length > 0,
    },
  });

  const { allTypes, isLoading: isCategoryListLoading } = useGetAllTypes({});

  // Query state management
  const [mode, setMode] = useQueryState(
    "mode",
    parseAsStringEnum(["list", "edit"]).withDefault("list"),
  );
  const [searchState, setSearchState] = useQueryStates({
    mode: parseAsStringEnum(["list", "edit"]).withDefault("list"),
    category: parseAsString.withDefault("0"),
  });

  // Local state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Computed values
  const bookmarkedMovies = useMemo(
    () =>
      movieList?.filter((movie) =>
        allBookmarks.some((bookmark) => bookmark.id === movie.vod_id),
      ),
    [allBookmarks, movieList],
  );

  const isAllSelected = useMemo(
    () => selectedItems.size === bookmarkedMovies?.length,
    [selectedItems.size, bookmarkedMovies?.length],
  );

  // Event handlers
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
      setSelectedItems(
        new Set(bookmarkedMovies?.map((movie) => movie.vod_id ?? "")),
      );
    }
  }, [isAllSelected, bookmarkedMovies]);

  const handleRemoveSelected = useCallback(async () => {
    showDialog({
      dialog: {
        isAlert: true,
        title: t("pages.bookmarks.removeDialogTitle"),
        description: t("pages.bookmarks.removeDialogDescription"),
        action: {
          label: t("pages.bookmarks.confirm"),
          variant: "ghost",
          className: "text-red-600 hover:text-red-500",
          onClick: async () => {
            if (selectedItems.size > 0) {
              await db.bookmarks.bulkDelete(Array.from(selectedItems));
            }
            setSelectedItems(new Set());
            setMode("list");
          },
        },
        cancel: {
          label: t("pages.bookmarks.goBack"),
          variant: "ghost",
        },
      },
    });
  }, [selectedItems, setMode, showDialog, t]);

  const handleCancelEdit = useCallback(() => {
    setMode("list");
    setSelectedItems(new Set());
  }, [setMode]);

  const handleModeToggle = useCallback(() => {
    setMode(mode === "list" ? "edit" : "list");
    setSelectedItems(new Set());
  }, [mode, setMode]);

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
            whileHover={BOOKMARKS_ANIMATION_CONFIG.selectionIndicator.hover}
            whileTap={BOOKMARKS_ANIMATION_CONFIG.selectionIndicator.tap}
            initial={BOOKMARKS_ANIMATION_CONFIG.selectionIndicator.initial}
            animate={BOOKMARKS_ANIMATION_CONFIG.selectionIndicator.animate}
            exit={BOOKMARKS_ANIMATION_CONFIG.selectionIndicator.exit}
            transition={{
              ...BOOKMARKS_ANIMATION_CONFIG.selectionIndicator.transition,
              delay: Number(movieId) * 0.05,
            }}
          >
            <AnimatePresence mode="wait">
              {isSelected(movieId) && (
                <motion.div
                  initial={BOOKMARKS_ANIMATION_CONFIG.checkIcon.initial}
                  animate={BOOKMARKS_ANIMATION_CONFIG.checkIcon.animate}
                  exit={BOOKMARKS_ANIMATION_CONFIG.checkIcon.exit}
                  transition={BOOKMARKS_ANIMATION_CONFIG.checkIcon.transition}
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
    (movie: MovieResponse, index: number) => (
      <motion.div
        key={movie.vod_id}
        className="relative flex-shrink-0"
        initial={COMMON_ANIMATION_CONFIG.movieCard.initial}
        animate={COMMON_ANIMATION_CONFIG.movieCard.animate}
        exit={COMMON_ANIMATION_CONFIG.movieCard.exit}
        transition={COMMON_ANIMATION_CONFIG.movieCard.transition}
        layout
      >
        {renderSelectionIndicator(movie.vod_id ?? "")}
        <MovieCard
          movie={movie}
          showFavoriteButton={false}
          onClick={
            mode === "edit"
              ? () => handleItemSelect(movie.vod_id ?? "")
              : undefined
          }
          index={index}
        />
      </motion.div>
    ),
    [renderSelectionIndicator, mode, handleItemSelect],
  );

  const renderMovieSkeleton = useCallback(
    (index: number) => <MovieCardSkeleton key={index} index={index} />,
    [],
  );

  const renderBottomDrawer = useCallback(
    () => (
      <AnimatePresence>
        {mode === "edit" && (
          <motion.div
            className="fixed right-0 bottom-0 left-0 z-40 mx-auto max-w-md rounded-t-3xl border-t border-[#444444] bg-[#2B2B2B] backdrop-blur-sm"
            initial={BOOKMARKS_ANIMATION_CONFIG.bottomDrawer.initial}
            animate={BOOKMARKS_ANIMATION_CONFIG.bottomDrawer.animate}
            exit={BOOKMARKS_ANIMATION_CONFIG.bottomDrawer.exit}
            transition={BOOKMARKS_ANIMATION_CONFIG.bottomDrawer.transition}
          >
            <div className="flex flex-col gap-4 px-5 py-4">
              {/* Header */}
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

  const renderTagSkeletons = useCallback(
    () =>
      Array.from({ length: SKELETON_COUNT.tags }).map((_, index) => (
        <TagSkeleton
          key={`tag-skeleton-${index}`}
          index={index}
          className={cn("", {
            "ml-4": index === 0,
            "mr-4": index === SKELETON_COUNT.tags - 1,
          })}
        />
      )),
    [],
  );

  const renderTags = useCallback(
    () => (
      <div className="scrollbar-hide flex items-center gap-x-1.5 overflow-auto">
        {isCategoryListLoading
          ? renderTagSkeletons()
          : allTypes?.map((category, index) => (
              <Tag
                key={category.type_id}
                index={index}
                size="lg"
                className={cn("cursor-pointer", {
                  "ml-4": index === 0,
                  "mr-4": index === allTypes.length - 1,
                })}
                variant={
                  searchState.category === category.type_id?.toString()
                    ? "active"
                    : "default"
                }
                onClick={() =>
                  setSearchState({
                    category: category.type_id?.toString() ?? "0",
                  })
                }
              >
                {category.type_name}
              </Tag>
            ))}
      </div>
    ),
    [searchState.category, isCategoryListLoading, renderTagSkeletons],
  );

  const renderMovieSkeletons = useCallback(
    () =>
      Array.from({ length: SKELETON_COUNT.movies }).map((_, index) =>
        renderMovieSkeleton(index),
      ),
    [renderMovieSkeleton],
  );

  const renderMovieGrid = useCallback(
    () => (
      <div className="mt-5 px-4 pb-32">
        <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
          {isMovieListLoading ? (
            renderMovieSkeletons()
          ) : (
            <AnimatePresence mode="popLayout">
              {bookmarkedMovies?.map((movie, index) =>
                renderMovieCard(movie, index),
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    ),
    [
      bookmarkedMovies,
      renderMovieCard,
      renderMovieSkeletons,
      isMovieListLoading,
    ],
  );

  return (
    <div className="relative h-full">
      <NavHeader
        isShowBack={false}
        title={t("pages.bookmarks.title")}
        rightNode={
          <Button
            variant="ghost"
            onClick={handleModeToggle}
            disabled={
              isMovieListLoading ||
              isCategoryListLoading ||
              allBookmarks.length === 0
            }
          >
            {mode === "list"
              ? t("pages.bookmarks.edit")
              : t("pages.bookmarks.cancel")}
          </Button>
        }
      />

      <div className="mt-5">
        {renderTags()}
        {allBookmarks.length > 0 ? (
          renderMovieGrid()
        ) : (
          <EmptyState
            imageSrc={<BookmarksEmptyImage className="size-33" />}
            title={t("pages.bookmarks.emptyTitle")}
            description={t("pages.bookmarks.emptyDescription")}
            className="translate-y-1/2"
          />
        )}
      </div>

      {renderBottomDrawer()}
    </div>
  );
}
