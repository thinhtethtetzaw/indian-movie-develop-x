import { useGetAds } from "@/apis/app/queryGetAds";
import { useGetAllTypes } from "@/apis/app/queryGetAllTypes";
import { useGetVideoListByIds } from "@/apis/app/queryGetVideoListByIds";
import BookmarksEmptyImage from "@/assets/svgs/image-bookmarks-empty.svg?react";
import { AdsSection, AdsSectionSkeleton } from "@/components/common/AdsSection";
import { EmptyState } from "@/components/common/EmptyState";
import NavHeader from "@/components/common/layouts/NavHeader";
import { Tag, TagSkeleton } from "@/components/common/Tag";
import VideoCard, { VideoCardSkeleton } from "@/components/common/VideoCard";
import { Button } from "@/components/ui/button";
import { COMMON_ANIMATION_CONFIG } from "@/config/animation";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/stores/useDialogStore";
import type { VideoResponse } from "@/types/api-schema/response";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  videos: 9,
} as const;

const BOOKMARKS_ANIMATION_CONFIG = {
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
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  bottomDrawer: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
} as const;

function RouteComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showDialog } = useDialogStore();

  // Query state management
  const [mode, setMode] = useQueryState(
    "mode",
    parseAsStringEnum(["list", "edit"]).withDefault("list"),
  );
  const [searchState, setSearchState] = useQueryStates({
    mode: parseAsStringEnum(["list", "edit"]).withDefault("list"),
    category: parseAsString.withDefault("0"),
  });

  // Data fetching
  const allBookmarks =
    useLiveQuery(() =>
      db.bookmarks
        .orderBy("updated_at")
        .reverse()
        .toArray()
        .catch((err) => {
          console.error("Dexie query error:", err);
          return [];
        }),
    ) ?? [];

  const { videoList, isLoading: isVideoListLoading } = useGetVideoListByIds({
    videoIds: allBookmarks.map((bookmark) => bookmark.id ?? ""),
    typeId: Number(searchState.category),
    queryConfig: {
      enabled: allBookmarks.length > 0,
    },
  });

  const { allTypes, isLoading: isCategoryListLoading } = useGetAllTypes({});

  // Ads list
  const { allAds, isLoading: isAdsLoading } = useGetAds({
    uniqueLabel: "bookmark_page_ads",
  });

  // Local state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Computed values
  const bookmarkedVideos = useMemo(
    () =>
      videoList?.filter((video) =>
        allBookmarks.some((bookmark) => bookmark.id === video.vod_id),
      ),
    [allBookmarks, videoList],
  );

  const isAllSelected = useMemo(
    () => selectedItems.size === bookmarkedVideos?.length,
    [selectedItems.size, bookmarkedVideos?.length],
  );

  // Event handlers
  const isSelected = useCallback(
    (videoId: string) => selectedItems.has(videoId),
    [selectedItems],
  );

  const handleItemSelect = useCallback(
    (videoId: string) => {
      if (mode !== "edit") return;

      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(videoId)) {
          newSet.delete(videoId);
        } else {
          newSet.add(videoId);
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
        new Set(bookmarkedVideos?.map((video) => video.vod_id ?? "")),
      );
    }
  }, [isAllSelected, bookmarkedVideos]);

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
    (videoId: string) => (
      <AnimatePresence>
        {mode === "edit" && (
          <motion.div
            className={cn(
              "absolute top-2 right-3 z-10 size-6 cursor-pointer rounded-full border-2 p-1",
              isSelected(videoId)
                ? "bg-brand-red border-transparent"
                : "border-white/30 bg-white/50",
            )}
            onClick={() => handleItemSelect(videoId)}
            whileHover={BOOKMARKS_ANIMATION_CONFIG.selectionIndicator.hover}
            whileTap={BOOKMARKS_ANIMATION_CONFIG.selectionIndicator.tap}
            initial={BOOKMARKS_ANIMATION_CONFIG.selectionIndicator.initial}
            animate={BOOKMARKS_ANIMATION_CONFIG.selectionIndicator.animate}
            exit={BOOKMARKS_ANIMATION_CONFIG.selectionIndicator.exit}
            transition={{
              ...BOOKMARKS_ANIMATION_CONFIG.selectionIndicator.transition,
              delay: Number(videoId) * 0.05,
            }}
          >
            <AnimatePresence mode="wait">
              {isSelected(videoId) && (
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

  const renderVideoCard = useCallback(
    (video: VideoResponse, index: number) => (
      <motion.div
        key={video.vod_id}
        className="relative flex-shrink-0"
        initial={COMMON_ANIMATION_CONFIG.videoCard.initial}
        animate={COMMON_ANIMATION_CONFIG.videoCard.animate}
        exit={COMMON_ANIMATION_CONFIG.videoCard.exit}
        transition={COMMON_ANIMATION_CONFIG.videoCard.transition}
        layout
      >
        {renderSelectionIndicator(video.vod_id ?? "")}
        <VideoCard
          video={video}
          showFavoriteButton={false}
          onClick={() => {
            mode === "edit"
              ? handleItemSelect(video.vod_id ?? "")
              : navigate({
                  to: "/videos/$videoId",
                  params: {
                    videoId: video.vod_id ?? "",
                  },
                });
          }}
          index={index}
        />
      </motion.div>
    ),
    [renderSelectionIndicator, mode, handleItemSelect],
  );

  const renderVideoCardSkeleton = useCallback(
    (index: number) => <VideoCardSkeleton key={index} index={index} />,
    [],
  );

  const renderBottomDrawer = useCallback(
    () => (
      <AnimatePresence>
        {mode === "edit" && (
          <motion.div
            className="fixed right-0 bottom-0 left-0 z-[var(--z-popover)] mx-auto max-w-md rounded-t-3xl border-t border-[#444444] bg-[#2B2B2B] backdrop-blur-sm"
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

  const renderVideoSkeletons = useCallback(
    () =>
      Array.from({ length: SKELETON_COUNT.videos }).map((_, index) =>
        renderVideoCardSkeleton(index),
      ),
    [renderVideoCardSkeleton],
  );

  const renderVideoGrid = useCallback(
    () => (
      <div className="px-4">
        {isVideoListLoading ? (
          <div className="grid grid-cols-3 gap-x-3 gap-y-6">
            {renderVideoSkeletons()}
          </div>
        ) : (
          <>
            {bookmarkedVideos && bookmarkedVideos.length > 0 ? (
              <div className="grid grid-cols-3 gap-x-3 gap-y-6">
                <AnimatePresence mode="popLayout">
                  {bookmarkedVideos?.map((video, index) =>
                    renderVideoCard(video, index),
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState
                imageSrc={<BookmarksEmptyImage className="size-33" />}
                title={t("pages.bookmarks.emptyTitle")}
                description={t("pages.bookmarks.emptyDescription")}
              />
            )}
          </>
        )}
      </div>
    ),
    [
      bookmarkedVideos,
      renderVideoCard,
      renderVideoSkeletons,
      isVideoListLoading,
    ],
  );

  return (
    <div className="relative h-full">
      <NavHeader
        title={t("pages.bookmarks.title")}
        rightNode={
          <Button
            variant="ghost"
            onClick={handleModeToggle}
            disabled={
              isVideoListLoading ||
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

      <div className="lighter-scrollbar h-[calc(100dvh-var(--nav-header-height)-var(--bottom-nav-height))] space-y-6 overflow-y-auto py-5">
        {renderTags()}
        {isAdsLoading ? (
          <>
            <AdsSectionSkeleton />
          </>
        ) : (
          allAds.length > 0 && (
            <div className="px-4">
              <AdsSection allAds={allAds} />
            </div>
          )
        )}
        {renderVideoGrid()}
      </div>

      {renderBottomDrawer()}
    </div>
  );
}
